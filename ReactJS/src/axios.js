import axios from 'axios';
import _ from 'lodash';
import config from './config';

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

// Hàm để xử lý các request đang chờ trong hàng hàng đợi
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

instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

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
                // Nếu đang trong quá trình lấy token mới, hãy bắt request này "xếp hàng" chờ
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
                // GỌI API ĐỔI THẺ MỚI
                axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/refresh-token`, {}, { withCredentials: true })
                    .then(({ data }) => {
                        if (data && data.errCode === 0) {
                            const newToken = data.newAccessToken;
                            localStorage.setItem('token', newToken); // Lưu thẻ mới vào túi

                            instance.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
                            originalRequest.headers['Authorization'] = 'Bearer ' + newToken;

                            processQueue(null, newToken); // Giải phóng hàng đợi
                            resolve(instance(originalRequest)); // Thực hiện lại request bị lỗi
                        } else {
                            // Nếu Refresh Token cũng hết hạn -> Logout
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

// Hàm hỗ trợ đăng xuất khi mọi thứ thất bại
const handleLogout = () => {
    localStorage.removeItem('token');
    if (store) {
        store.dispatch({ type: 'PROCESS_LOGOUT' });
    }
    window.location.href = '/login';
};

export default instance;
