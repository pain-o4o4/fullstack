import express from "express"
import homeController, { getHomePage } from "../controller/homeController"
import userController from "../controller/userController"
import doctorController from "../controller/doctorController"
import patientController from "../controller/patientController"
import specialtyController from "../controller/specialtyController"
import clinicController from "../controller/clinicController"
import handbookController from "../controller/handbookController"
import { checkUserJWT, checkUserPermission } from '../middleware/authMiddleware';
let router = express.Router()

let initWebRoutes = (app) => {

    // ==========================================
    // BẢO VỆ TỔNG THỂ (GLOBAL MIDDLEWARE)
    // ==========================================
    // Middleware này sẽ chặn ở CỔNG VÀO của toàn bộ các API.
    // Nếu là PUBLIC_PATHS -> Cho qua. Nếu không -> Bắt buộc kiểm tra Token & Quyền.
    router.all('*', checkUserJWT, checkUserPermission);

    // ==========================================
    // DANH SÁCH API (KHÔNG CẦN CHÈN MIDDLEWARE LẺ TẺ NỮA)
    // ==========================================

    // Users
    router.post("/api/register", userController.createRegister);
    router.post('/api/login', userController.handleLogin);
    router.post('/api/refresh-token', userController.handleRefreshToken);
    router.get("/api/get-all-users", userController.handleGetAllUsers);
    router.put("/api/edit-user", userController.handleEditUser);
    router.delete("/api/delete-user", userController.handleDeleteUser);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.get('/api/allcode', userController.getAllCode);

    // Doctors
    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctors', doctorController.getAllDoctors);
    router.post('/api/save-infor-doctor', doctorController.postInforDoctor);
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById);
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate);
    router.get('/api/get-extra-infor-doctor-by-id', doctorController.getExtraDoctorById);
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById);
    router.get('/api/get-list-patient-for-doctor', doctorController.getListPatientForDoctor);
    router.put('/api/update-booking-status', doctorController.updateBookingStatus);

    // Specialty
    router.post('/api/create-new-specialty', specialtyController.postCreateNewSpecialty);
    router.get('/api/get-all-specialty', specialtyController.getAllSpecialty);
    router.get('/api/get-detail-specialty-by-id', specialtyController.getSpecialtyById);
    router.delete('/api/delete-specialty', specialtyController.handleDeleteSpecialty);
    router.put('/api/edit-specialty', specialtyController.handleEditSpecialty);

    // Clinic
    router.post('/api/create-new-clinic', clinicController.postCreateNewClinic);
    router.get('/api/get-all-clinic', clinicController.getAllClinic);
    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById);
    router.delete('/api/delete-clinic', clinicController.handleDeleteClinic);
    router.put('/api/edit-clinic', clinicController.handleEditClinic);

    // Patient & Booking & Payment
    router.post('/api/patient-book-appointment', patientController.postBookAppointment);
    router.post('/api/verify-book-appointment', patientController.postVerifyAppointment);
    router.get('/api/get-all-appointments-by-id', patientController.getAllAppointmentsById);
    router.get('/api/get-detail-schedule-patient', patientController.getDetailSchedulePatient);
    router.post('/api/update-patient', patientController.postUpdatePatient);

    // Webhook thanh toán (Luôn phải Public)
    router.post('/api/payos-webhook', patientController.handlePayOSWebhook);
    router.post('/api/verify-payment-status', patientController.handleVerifyPayment);

    // Handbook
    router.post('/api/create-new-handbook', handbookController.createHandbook);
    router.get('/api/get-handbook', handbookController.getAllHandbook);
    router.get('/api/get-detail-handbook-by-id', handbookController.getDetailHandbookById);
    router.delete('/api/delete-handbook', handbookController.deleteHandbook);
    router.put('/api/edit-handbook', handbookController.handleEditHandbook);

    return app.use("/", router)
}

export default initWebRoutes