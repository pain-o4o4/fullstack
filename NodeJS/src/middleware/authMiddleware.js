import { PERMISSIONS, PUBLIC_PATHS, ROLES } from '../config/permissions';

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

module.exports = {
    checkUserPermission: checkUserPermission
};