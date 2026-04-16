import { get } from 'lodash';
import axios from '../axios';
const handleLoginApi = (email, password) => {
    return axios.post('/api/login', { email, password });
}
const getAllUsers = (inputId) => {
    return axios.get(`/api/get-all-users?id=${inputId}`);
}
const createNewUsersService = (data) => {
    console.log(`check data from service`, data)
    return axios.post(`/api/create-new-user`, data)
}
const deleteUserService = (userId) => {
    return axios.delete('/api/delete-user', {
        data: {
            id: userId
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
const postCreateNewSpecialtyService = (data) => {
    return axios.post(`/api/create-new-specialty`, data);
};
const getAllSpecialtyService = () => {
    return axios.get(`/api/get-all-specialty`);
}
const getDetailSpecialtyByIdService = (inputId) => {
    return axios.get(`/api/get-detail-specialty-by-id?id=${inputId}`);
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
export {
    handleLoginApi,
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

}