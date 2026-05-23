# ==========================================
# STAGE 1: BUILDER (Biên dịch code)
# ==========================================
FROM node:18-alpine AS builder

# Cài đặt thư viện hỗ trợ C/C++ (cần cho bcrypt/sharp)
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package và package-lock để cài đặt
COPY package*.json ./

# Cài đặt toàn bộ (bao gồm devDependencies) bằng npm install
RUN npm install

# Copy toàn bộ source code vào
COPY . .

# Biên dịch code ES6 -> ES5 (cần cấu hình script build trong package.json)
RUN npm run build

# ==========================================
# STAGE 2: PRODUCTION (Môi trường chạy thực tế)
# ==========================================
FROM node:18-alpine AS runner

WORKDIR /app

# Chỉ cài đặt thư viện hệ thống cần thiết
RUN apk add --no-cache libc6-compat

# Copy lại file package để cài thư viện
COPY package*.json ./

# CHỈ cài đặt dependencies (Bỏ qua devDependencies -> giảm 50% dung lượng)
RUN npm install --omit=dev && npm cache clean --force

# Copy thư mục đã được biên dịch từ STAGE 1 sang STAGE 2
COPY --from=builder /app/build ./build

# Copy các thư mục cấu hình và database cần thiết nằm ngoài src
COPY --from=builder /app/models ./models
COPY --from=builder /app/config ./config
COPY --from=builder /app/migrations ./migrations

# Chuyển sang user "node" (không có quyền root) để tăng cường bảo mật
USER node

# Expose backend port
EXPOSE 2004

# Chạy trực tiếp bằng Node siêu nhẹ, không dùng babel-node nữa
CMD ["npm", "start"]
