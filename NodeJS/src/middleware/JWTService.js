import jwt from "jsonwebtoken";
require('dotenv').config();

// Những link không cần check login (ví dụ: xem danh sách bác sĩ ở trang chủ)
const nonSecurePaths = ['/api/login', '/api/top-doctor-home'];

const createJWT = (payload) => {
    let key = process.env.JWT_SECRET;
    let token = null;
    try {
        token = jwt.sign(payload, key, { expiresIn: '1h' });
    } catch (e) { console.log(e) }
    return token;
};

const verifyToken = (req, res, next) => {
    if (nonSecurePaths.includes(req.path)) return next();

    let cookies = req.cookies; // Nếu Duy dùng cookie
    let tokenFromHeader = req.headers.authorization?.split(' ')[1]; // Nếu Duy dùng Header Bearer
    let token = cookies?.jwt || tokenFromHeader;

    if (token) {
        try {
            let decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Lưu thông tin user (gồm roleId) vào req
            next();
        } catch (err) {
            return res.status(401).json({ errCode: -1, message: 'Token không hợp lệ' });
        }
    } else {
        return res.status(401).json({ errCode: -1, message: 'Bạn chưa đăng nhập!' });
    }
};

module.exports = { createJWT, verifyToken };