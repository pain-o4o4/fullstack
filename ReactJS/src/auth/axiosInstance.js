import axios from 'axios';
import { startTimer, stopTimer } from './TokenRefreshManager';

let store;
export const injectStore = (_store) => {
    store = _store;
};

const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    withCredentials: true //  BẮT BUỘC: Để gửi/nhận Cookie từ Server
});

// Biến để kiểm soát việc Refresh Token
let isRefreshing = false;
let failedQueue = [];

// Hàm để xử lý các request đang chờ trong hàng đợi
const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// ========================
// REQUEST INTERCEPTOR
// Gắn Access Token vào mọi request trước khi gửi đi
// ========================
instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

// ========================
// RESPONSE INTERCEPTOR — "LƯỚI AN TOÀN" DỰ PHÒNG
// ========================
// Trong điều kiện bình thường, TokenRefreshManager sẽ refresh token
// TRƯỚC KHI nó hết hạn, nên interceptor này sẽ KHÔNG BAO GIỜ chạy.
// Nó chỉ kích hoạt trong trường hợp hiếm gặp (mất mạng tạm, race condition).
instance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status || 500;

        // NẾU LỖI 401 VÀ CHƯA TỪNG RETRY REQUEST NÀY
        if (status === 401 && !originalRequest._retry) {

            if (isRefreshing) {
                // Nếu đang trong quá trình lấy token mới, xếp hàng chờ
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return instance(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            return new Promise(function (resolve, reject) {
                // GỌI API ĐỔI TOKEN MỚI
                axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/refresh-token`, {}, { withCredentials: true })
                    .then(({ data }) => {
                        if (data && data.errCode === 0) {
                            const newToken = data.newAccessToken;
                            localStorage.setItem('token', newToken);

                            instance.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
                            originalRequest.headers['Authorization'] = 'Bearer ' + newToken;

                            // Đồng bộ Redux
                            if (store) {
                                store.dispatch({
                                    type: 'USER_LOGIN_SUCCESS',
                                    userInfo: {
                                        ...store.getState().user.userInfo,
                                        token: newToken
                                    }
                                });
                            }

                            // Khởi động lại Silent Refresh Timer với token mới
                            // (Phòng trường hợp timer cũ đã bị mất do lỗi)
                            startTimer(newToken);

                            processQueue(null, newToken);
                            resolve(instance(originalRequest));
                        } else {
                            // Refresh Token cũng hết hạn → Logout
                            handleLogout();
                            reject(error);
                        }
                    })
                    .catch((err) => {
                        handleLogout();
                        processQueue(err, null);
                        reject(err);
                    })
                    .finally(() => {
                        isRefreshing = false;
                    });
            });
        }

        return Promise.reject(error);
    }
);

// ========================
// ĐĂNG XUẤT
// ========================
const handleLogout = () => {
    // 1. Dừng Silent Refresh Timer
    stopTimer();

    // 2. Xóa Access Token khỏi localStorage
    localStorage.removeItem('token');

    // 3. Gọi server để xóa HttpOnly Cookie (refreshToken)
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/logout`, {}, { withCredentials: true }).catch(() => {});

    // 4. Cập nhật Redux state
    if (store) {
        store.dispatch({ type: 'PROCESS_LOGOUT' });
    }

    // 5. Chuyển về trang login
    window.location.href = '/login';
};

export default instance;
