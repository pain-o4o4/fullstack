import axios from '../auth/axiosInstance';

export const postCreateNewSpecialtyService = (data) => {
    return axios.post(`/api/create-new-specialty`, data);
};
export const getAllSpecialtyService = () => {
    return axios.get(`/api/get-all-specialty`);
}
export const getDetailSpecialtyByIdService = (inputId) => {
    return axios.get(`/api/get-detail-specialty-by-id?id=${inputId}`);
}
export const deleteSpecialtyService = (specialtyId, force = false) => {
    return axios.delete('/api/delete-specialty', {
        data: {
            id: specialtyId,
            force: force
        }
    });
}
export const editSpecialtyService = (data) => {
    return axios.put('/api/edit-specialty', data);
}
