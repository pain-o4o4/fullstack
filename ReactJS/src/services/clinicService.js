import axios from '../auth/axiosInstance';

export const postCreateNewClinicService = (data) => {
    return axios.post(`/api/create-new-clinic`, data);
};
export const getAllClinicService = () => {
    return axios.get(`/api/get-all-clinic`);
}
export const getDetailClinicByIdService = (inputId) => {
    return axios.get(`/api/get-detail-clinic-by-id?id=${inputId}`);
}
export const deleteClinicService = (clinicId, force = false) => {
    return axios.delete('/api/delete-clinic', {
        data: {
            id: clinicId,
            force: force
        }
    });
}
export const editClinicService = (data) => {
    return axios.put('/api/edit-clinic', data);
}
