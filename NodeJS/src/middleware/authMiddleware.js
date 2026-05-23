import { PERMISSIONS, PUBLIC_PATHS, ROLES } from '../config/permissions';
import JWTAction from './JWTAction';
const checkUserJWT = (req, res, next) => {
    if (PUBLIC_PATHS.includes(req.path)) return next();
    // 1. Lấy token từ header (Bearer token)
    let tokenFromHeader = req.headers.authorization?.split(' ')[1];
    if (tokenFromHeader) {
        let decoded = JWTAction.verifyToken(tokenFromHeader);
        if (decoded) {
            req.user = decoded; // Lưu thông tin vào req để dùng cho bước sau
            // decoded {user: {id: '', roleId: ''}}
            next();
        } else {
            return res.status(401).json({
                errCode: -1,
                message: 'Token không hợp lệ hoặc đã hết hạn!'
            });
        }
    } else {
        return res.status(401).json({
            errCode: -1,
            message: 'Bạn chưa đăng nhập (Thiếu Token)!'
        });
    }
};
const checkUserPermission = (req, res, next) => {
    const path = req.path;
    const user = req.user; // Đã lấy được từ verifyToken

    // 1. Nếu là đường dẫn công khai -> Cho qua luôn
    if (PUBLIC_PATHS.includes(path)) return next();

    if (user) {
        // 2. Nếu là ADMIN -> Cho qua tất cả
        if (user.roleId === ROLES.ADMIN) return next();

        // 3. Kiểm tra xem Role hiện tại có nằm trong danh sách cho phép của Path này không
        const allowedPaths = PERMISSIONS[user.roleId] || [];
        if (allowedPaths.includes(path)) {
            return next();
        }
    }

    // 4. Mặc định là chặn nếu không thỏa mãn các điều kiện trên
    return res.status(403).json({
        errCode: -1,
        message: 'Bạn không có quyền truy cập luồng này!'
    });
};

export {
    checkUserPermission,
    checkUserJWT
};