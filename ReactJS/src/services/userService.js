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
}