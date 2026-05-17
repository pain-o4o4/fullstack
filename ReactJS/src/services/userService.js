import { get } from 'lodash';
import axios from '../auth/axiosInstance';
const handleLoginApi = (email, password) => {
    return axios.post('/api/login', { email, password });
}
const initiateRegister = (data) => {
    return axios.post('/api/register', { ...data, action: 'initiate' });
}
const verifyRegisterOtp = (email, verificationCode) => {
    return axios.post('/api/register', { email, verificationCode, action: 'verify' });
}
const resendRegisterOtp = (email) => {
    return axios.post('/api/register', { email, action: 'resend' });
}
const getAllUsers = (inputId) => {
    return axios.get(`/api/get-all-users?id=${inputId}`);
}
const createNewUsersService = (data) => {
    console.log(`check data from service`, data)
    return axios.post(`/api/create-new-user`, data)
}
const deleteUserService = (userId, force = false) => {
    return axios.delete('/api/delete-user', {
        data: {
            id: userId,
            force: force
        }
    });
}
const editUserService = (data) => {
    console.log(`check data from service`, data)
    return axios.put('/api/edit-user', data);
}


const getAllCodeService = (inputType) => {
    return axios.get(`/api/allcode?type=${inputType}`);
}


const getTopDoctorHomeService = (limit) => {
    return axios.get(`/api/top-doctor-home?limit=${limit}`);
}
const getAllDoctorsService = () => {
    return axios.get(`/api/get-all-doctors`);
}
const postInforDoctorService = (data) => {
    console.log(`check data from service axios`, data)
    return axios.post(`/api/save-infor-doctor`, data);
}
const getDetailDoctorByIdService = (inputId) => {
    return axios.get(`/api/get-detail-doctor-by-id?id=${inputId}`);
}


const bulkCreateScheduleService = (data) => {
    return axios.post(`/api/bulk-create-schedule`, data);
}
const getScheduleByDate = (doctorId, date) => {
    return axios.get('/api/get-schedule-doctor-by-date', {
        params: {
            doctorId: doctorId,
            date: date
        }
    });
}
const getExtraInforDoctorById = (doctorId) => {
    return axios.get(`/api/get-extra-infor-doctor-by-id?doctorId=${doctorId} `)
}
const getProfileDoctorById = (doctorId) => {
    return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId} `)
}


const postBookAppointment = (data) => {
    return axios.post(`/api/patient-book-appointment`, data)
}
const postVerifyAppointmentService = (data) => {
    return axios.post(`/api/verify-book-appointment`, data)
}
const getAllAppointmentsByIdService = (inputId) => {
    return axios.get(`/api/get-all-appointments-by-id?id=${inputId}`);
}
const getHistoryAppointmentByIdService = (inputId) => {
    return axios.get(`/api/get-history-appointment-by-id?id=${inputId}`);
}



const postCreateNewSpecialtyService = (data) => {
    return axios.post(`/api/create-new-specialty`, data);
};
const getAllSpecialtyService = () => {
    return axios.get(`/api/get-all-specialty`);
}
const getDetailSpecialtyByIdService = (inputId) => {
    return axios.get(`/api/get-detail-specialty-by-id?id=${inputId}`);
}
const deleteSpecialtyService = (specialtyId, force = false) => {
    return axios.delete('/api/delete-specialty', {
        data: {
            id: specialtyId,
            force: force
        }
    });
}
const editSpecialtyService = (data) => {
    return axios.put('/api/edit-specialty', data);
}

const postCreateNewClinicService = (data) => {
    return axios.post(`/api/create-new-clinic`, data);
};
const getAllClinicService = () => {
    return axios.get(`/api/get-all-clinic`);
}
const getDetailClinicByIdService = (inputId) => {
    return axios.get(`/api/get-detail-clinic-by-id?id=${inputId}`);
}
const deleteClinicService = (clinicId, force = false) => {
    return axios.delete('/api/delete-clinic', {
        data: {
            id: clinicId,
            force: force
        }
    });
}
const editClinicService = (data) => {
    return axios.put('/api/edit-clinic', data);
}

const getListPatientForDoctor = (data) => {
    return axios.get(`/api/get-list-patient-for-doctor?doctorId=${data.doctorId}&date=${data.date}`);
}

const getDetailSchedulePatient = (bookingId) => {
    return axios.get(`/api/get-detail-schedule-patient?bookingId=${bookingId}`);
}

const updateBookingStatus = (data) => {
    return axios.put('/api/update-booking-status', data);
}

const postUpdatePatientService = (data) => {
    return axios.post(`/api/update-patient`, data);
}

const createNewHandbookService = (data) => {
    return axios.post(`/api/create-new-handbook`, data);
}

const getAllHandbookService = () => {
    return axios.get(`/api/get-handbook`);
}

const getDetailHandbookByIdService = (id) => {
    return axios.get(`/api/get-detail-handbook-by-id?id=${id}`);
}

const deleteHandbookService = (handbookId, force = false) => {
    return axios.delete('/api/delete-handbook', {
        data: {
            id: handbookId,
            force: force
        }
    });
}

const editHandbookService = (data) => {
    return axios.put('/api/edit-handbook', data);
}

const verifyPaymentStatus = (orderCode) => {
    return axios.post('/api/verify-payment-status', { orderCode });
}

const postChatWithAIService = (data) => {
    return axios.post('/api/chat-with-ai', data);
}
const searchGlobal = (keyword, signal) => {
    return axios.get(`/api/search?q=${encodeURIComponent(keyword)}`, {
        signal: signal,
        timeout: 10000
    });
}
const getSystemStatisticsService = () => {
    return axios.get('/api/get-system-statistics');
}

const sendMessageApi = (data) => {
    return axios.post('/api/send-message', data);
}

const getMessagesApi = (senderId, receiverId) => {
    return axios.get(`/api/get-messages?senderId=${senderId}&receiverId=${receiverId}`);
}

const getChatHistorySidebarApi = (userId) => {
    return axios.get(`/api/get-chat-history-sidebar?userId=${userId}`);
}

const searchUsersForChatApi = (userId, query) => {
    return axios.get(`/api/search-users-for-chat?userId=${userId}&query=${query}`);
}

const getQuickRepliesApi = (doctorId) => {
    return axios.get(`/api/get-quick-replies?doctorId=${doctorId}`);
}

const saveQuickReplyApi = (data) => {
    return axios.post('/api/save-quick-reply', data);
}

const deleteQuickReplyApi = (id) => {
    return axios.delete('/api/delete-quick-reply', { data: { id } });
}

const deleteConversationApi = (data) => {
    return axios.post('/api/delete-conversation', data);
}

const markMessagesAsReadApi = (data) => {
    return axios.post('/api/mark-messages-as-read', data);
}

const updateMessageReactionApi = (data) => {
    return axios.post('/api/update-reaction', data);
}

const getAllEmailTemplatesApi = () => {
    return axios.get('/api/get-all-email-templates');
}

const saveEmailTemplateApi = (data) => {
    return axios.post('/api/save-email-template', data);
}

const getAllGlobalQuickRepliesApi = () => {
    return axios.get('/api/get-all-global-quick-replies');
}

const saveGlobalQuickReplyApi = (data) => {
    return axios.post('/api/save-global-quick-reply', data);
}

const getListBookingHistoryService = (data) => {
    return axios.get(`/api/get-list-booking-history`, { params: data });
}

const updateBookingServiceManual = (data) => {
    return axios.put('/api/update-booking', data);
}

const deleteBookingServiceManual = (id) => {
    return axios.delete('/api/delete-booking', { data: { id } });
}

export {
    handleLoginApi,
    verifyPaymentStatus,
    postChatWithAIService,
    initiateRegister,
    verifyRegisterOtp,
    resendRegisterOtp,
    getAllUsers,
    createNewUsersService,
    deleteUserService,
    getAllCodeService,
    getTopDoctorHomeService,
    editUserService,
    getAllDoctorsService,
    postInforDoctorService,
    getDetailDoctorByIdService,
    bulkCreateScheduleService,
    getScheduleByDate,
    getExtraInforDoctorById,
    getProfileDoctorById,
    postBookAppointment,
    postVerifyAppointmentService,
    postCreateNewSpecialtyService,
    getAllSpecialtyService,
    postCreateNewClinicService,
    getAllClinicService,
    getDetailClinicByIdService,
    getDetailSpecialtyByIdService,
    getAllAppointmentsByIdService,
    postUpdatePatientService,
    deleteSpecialtyService,
    editSpecialtyService,
    deleteClinicService,
    editClinicService,
    getListPatientForDoctor,
    updateBookingStatus,
    getDetailSchedulePatient,
    createNewHandbookService,
    getAllHandbookService,
    getDetailHandbookByIdService,
    deleteHandbookService,
    editHandbookService,
    getHistoryAppointmentByIdService,
    searchGlobal,
    getSystemStatisticsService,
    sendMessageApi,
    getMessagesApi,
    getChatHistorySidebarApi,
    searchUsersForChatApi,
    deleteConversationApi,
    markMessagesAsReadApi,
    getQuickRepliesApi,
    saveQuickReplyApi,
    deleteQuickReplyApi,
    updateMessageReactionApi,
    getAllEmailTemplatesApi,
    saveEmailTemplateApi,
    getAllGlobalQuickRepliesApi,
    saveGlobalQuickReplyApi,
    getListBookingHistoryService,
    updateBookingServiceManual,
    deleteBookingServiceManual
}