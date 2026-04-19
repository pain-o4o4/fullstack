import express from "express"
import homeController, { getHomePage } from "../controller/homeController"
import userController from "../controller/userController"
import doctorController from "../controller/doctorController"
import patientController from "../controller/patientController"
import specialtyController from "../controller/specialtyController"
import clinicController from "../controller/clinicController"
let router = express.Router()

let initWebRoutes = (app) => {

    router.post("/api/register", userController.createRegister);
    router.post('/api/login', userController.handleLogin);
    router.get("/api/get-all-users", userController.handleGetAllUsers);
    router.put("/api/edit-user", userController.handleEditUser);
    router.delete("/api/delete-user", userController.handleDeleteUser);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.get('/api/allcode', userController.getAllCode);

    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctors', doctorController.getAllDoctors);
    router.post('/api/save-infor-doctor', doctorController.postInforDoctor);
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById);
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);    router.get('/api/get-detail-schedule-patient', patientController.getDetailSchedulePatient);

    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate);
    router.get('/api/get-extra-infor-doctor-by-id', doctorController.getExtraDoctorById)
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById)
    router.get('/api/get-list-patient-for-doctor', doctorController.getListPatientForDoctor)
    router.put('/api/update-booking-status', doctorController.updateBookingStatus)    //specialty
    router.post('/api/create-new-specialty', specialtyController.postCreateNewSpecialty);
    router.get('/api/get-all-specialty', specialtyController.getAllSpecialty);
    router.get('/api/get-detail-specialty-by-id', specialtyController.getSpecialtyById);
    router.delete('/api/delete-specialty', specialtyController.handleDeleteSpecialty);
    router.put('/api/edit-specialty', specialtyController.handleEditSpecialty);

    //clinic
    router.post('/api/create-new-clinic', clinicController.postCreateNewClinic);
    router.get('/api/get-all-clinic', clinicController.getAllClinic);
    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById);
    router.delete('/api/delete-clinic', clinicController.handleDeleteClinic);
    router.put('/api/edit-clinic', clinicController.handleEditClinic);

    //patient
    router.post('/api/patient-book-appointment', patientController.postBookAppointment);
    router.post('/api/verify-book-appointment', patientController.postVerifyAppointment);
    router.get('/api/get-all-appointments-by-id', patientController.getAllAppointmentsById);
    router.post('/api/payos-webhook', patientController.handlePayOSWebhook);
    router.post('/api/update-patient', patientController.postUpdatePatient);
    return app.use("/", router)
}

export default initWebRoutes