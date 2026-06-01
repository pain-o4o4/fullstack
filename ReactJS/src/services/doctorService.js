import axios from '../auth/axiosInstance';

export const getTopDoctorHomeService = (limit) => {
    return axios.get(`/api/top-doctor-home?limit=${limit}`);
}
export const getAllDoctorsService = () => {
    return axios.get(`/api/get-all-doctors`);
}
export const postInforDoctorService = (data) => {
    console.log(`check data from service axios`, data)
    return axios.post(`/api/save-infor-doctor`, data);
}
export const getDetailDoctorByIdService = (inputId) => {
    return axios.get(`/api/get-detail-doctor-by-id?id=${inputId}`);
}
export const getExtraInforDoctorById = (doctorId) => {
    return axios.get(`/api/get-extra-infor-doctor-by-id?doctorId=${doctorId} `)
}
export const getProfileDoctorById = (doctorId) => {
    return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId} `)
}
