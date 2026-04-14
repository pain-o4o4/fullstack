import express from "express"
import homeController, { getHomePage } from "../controller/homeController"
import userController from "../controller/userController"
import doctorController from "../controller/doctorController"
import patientController from "../controller/patientController"
import { checkUserRole } from "../middleware/authMiddleware";
let router = express.Router()
import { verifyToken } from "../middleware/JWTService";

// Hàm middleware check quyền cụ thể
const checkUserPermission = (req, res, next) => {
    const adminPaths = ['/api/get-all-users', '/api/delete-user', '/api/create-new-user'];
    const doctorPaths = ['/api/bulk-create-schedule', '/api/save-infor-doctor'];

    if (req.user) {
        let role = req.user.roleId;
        let path = req.path;

        // Admin (R1) được làm tất cả
        if (role === 'R1') return next();

        // Doctor (R2) chỉ được làm những việc của Doctor
        if (role === 'R2' && doctorPaths.includes(path)) return next();

        // Patient (R3) hoặc các quyền khác bị chặn nếu cố vào path Admin/Doctor
        if (adminPaths.includes(path) || doctorPaths.includes(path)) {
            return res.status(403).json({ errCode: -1, message: 'Bạn không có quyền!' });
        }
    }
    next();
};

let initWebRoutes = (app) => {
    // TẤT CẢ API PHẢI QUA 2 LỚP NÀY (Trừ những path public đã khai báo ở Bước 1)
    router.all('*', verifyToken, checkUserPermission);

    // --- CÁC ROUTE CỦA DUY ---
    router.post("/api/login", userController.handleLogin);

    // Nhóm Admin
    router.get("/api/get-all-users", userController.handleGetAllUsers);
    router.delete("/api/delete-user", userController.handleDeleteUser);
    router.post('/api/create-new-user', userController.handleCreateNewUser);

    // Nhóm Doctor
    router.post('/api/save-infor-doctor', doctorController.postInforDoctor);
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);

    // Nhóm Public (Bệnh nhân xem)
    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById);

    return app.use("/", router);
}

export default initWebRoutes