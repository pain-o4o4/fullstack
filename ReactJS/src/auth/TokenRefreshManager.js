import axios from 'axios';

// ================================================================
// TOKEN REFRESH MANAGER — Cơ chế "Silent Refresh" cấp Enterprise
// ================================================================
// Thay vì đợi token hết hạn rồi mới refresh (reactive),
// Manager này chủ động refresh TRƯỚC KHI token hết hạn (proactive).
//
// Luồng hoạt động:
// 1. User login → startTimer() → decode JWT lấy thời gian exp
// 2. Đặt setTimeout refresh tại 80% thời gian sống của token
//    (VD: token 15 phút → refresh sau 12 phút)
// 3. Khi timer kích hoạt → gọi /api/refresh-token → nhận token mới
// 4. Cập nhật localStorage + Redux + đặt timer mới
// 5. Lặp lại vĩnh viễn cho đến khi user logout hoặc refresh token hết hạn
//
// Kết quả: User KHÔNG BAO GIỜ cầm token hết hạn.
// Axios interceptor 401 chỉ còn là "lưới an toàn" dự phòng.
// ================================================================

let store = null;
let refreshTimerId = null;

// Inject Redux store từ bên ngoài (gọi 1 lần ở index.js)
export const injectStoreForRefresh = (_store) => {
    store = _store;
};

// ========================
// HÀM HỖ TRỢ: Decode JWT để đọc thời gian hết hạn (exp)
// ========================
const decodeJwtPayload = (token) => {
    try {
        const cleaned = `${token || ''}`.replace(/^Bearer\s+/i, '').trim();
        if (!cleaned) return null;
        const payload = cleaned.split('.')[1];
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
    } catch {
        return null;
    }
};

// ========================
// HÀM CHÍNH: Tính toán thời điểm cần refresh
// ========================
// Công thức: refreshAt = 80% thời gian sống của token
// Token 15 phút (900s) → refresh sau 720s (12 phút) → còn dư 3 phút an toàn
const calculateRefreshDelay = (token) => {
    const decoded = decodeJwtPayload(token);
    if (!decoded?.exp || !decoded?.iat) return null;

    const totalLifetime = (decoded.exp - decoded.iat) * 1000; // Tổng thời gian sống (ms)
    const elapsed = Date.now() - (decoded.iat * 1000);         // Đã trôi qua bao lâu (ms)
    const refreshAt = totalLifetime * 0.8;                     // Refresh tại 80% thời gian sống
    const delay = refreshAt - elapsed;                         // Còn bao lâu nữa thì refresh

    // Nếu delay <= 0 nghĩa là token sắp hết hoặc đã hết → refresh ngay lập tức
    return Math.max(delay, 0);
};

// ========================
// THỰC HIỆN REFRESH
// ========================
const performSilentRefresh = async () => {
    try {
        console.log('[SilentRefresh] Đang refresh token...');

        const { data } = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/refresh-token`,
            {},
            { withCredentials: true }
        );

        if (data && data.errCode === 0) {
            const newToken = data.newAccessToken;

            // 1. Cập nhật localStorage
            localStorage.setItem('token', newToken);

            // 2. Cập nhật Redux → SocketContext tự động nhận token mới
            if (store) {
                store.dispatch({
                    type: 'USER_LOGIN_SUCCESS',
                    userInfo: {
                        ...store.getState().user.userInfo,
                        token: newToken
                    }
                });
            }

            console.log('[SilentRefresh] Token mới đã được cập nhật thành công!');

            // 3. Đặt timer mới cho lần refresh tiếp theo
            scheduleRefresh(newToken);
        } else {
            // Refresh Token cũng đã hết hạn (7 ngày) → Buộc phải logout
            console.warn('[SilentRefresh] Refresh token hết hạn. Đăng xuất...');
            handleForceLogout();
        }
    } catch (error) {
        console.error('[SilentRefresh] Lỗi khi refresh:', error?.message);
        // Nếu lỗi mạng tạm thời, thử lại sau 30 giây thay vì logout ngay
        // Điều này giúp user không bị đá ra khi mất mạng tạm thời
        refreshTimerId = setTimeout(() => {
            performSilentRefresh();
        }, 30 * 1000);
    }
};

// ========================
// ĐẶT LỊCH REFRESH (Timer)
// ========================
const scheduleRefresh = (token) => {
    // Xóa timer cũ nếu có (tránh chạy 2 timer song song)
    if (refreshTimerId) {
        clearTimeout(refreshTimerId);
        refreshTimerId = null;
    }

    const delay = calculateRefreshDelay(token);
    if (delay === null) {
        console.warn('[SilentRefresh] Không thể decode token, bỏ qua scheduling.');
        return;
    }

    const delaySeconds = Math.round(delay / 1000);
    console.log(`[SilentRefresh] Token sẽ được refresh sau ${delaySeconds} giây.`);

    refreshTimerId = setTimeout(() => {
        performSilentRefresh();
    }, delay);
};

// ========================
// LOGOUT KHI REFRESH THẤT BẠI
// ========================
const handleForceLogout = () => {
    stopTimer();
    localStorage.removeItem('token');
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/logout`, {}, { withCredentials: true }).catch(() => {});
    if (store) {
        store.dispatch({ type: 'PROCESS_LOGOUT' });
    }
    window.location.href = '/login';
};

// ========================
// API CÔNG KHAI
// ========================

// Gọi sau khi login/register thành công
export const startTimer = (token) => {
    if (!token) return;
    scheduleRefresh(token);
};

// Gọi khi user logout
export const stopTimer = () => {
    if (refreshTimerId) {
        clearTimeout(refreshTimerId);
        refreshTimerId = null;
        console.log('[SilentRefresh] Timer đã được dừng.');
    }
};

// Gọi khi app khởi động (F5/mở tab mới) để khôi phục timer
// nếu user vẫn đang login từ phiên trước
export const restoreTimer = () => {
    const token = localStorage.getItem('token');
    if (token && store) {
        const isLoggedIn = store.getState().user?.isLoggedIn;
        if (isLoggedIn) {
            const decoded = decodeJwtPayload(token);
            if (decoded?.exp && Date.now() < decoded.exp * 1000) {
                // Token vẫn còn sống → đặt timer bình thường
                console.log('[SilentRefresh] Khôi phục timer từ phiên trước.');
                scheduleRefresh(token);
            } else {
                // Token đã hết hạn → thử refresh ngay lập tức
                console.log('[SilentRefresh] Token cũ đã hết hạn, thử refresh ngay...');
                performSilentRefresh();
            }
        }
    }
};

export default {
    injectStoreForRefresh,
    startTimer,
    stopTimer,
    restoreTimer
};
