import axios from '../auth/axiosInstance';

export const createNewHandbookService = (data) => {
    return axios.post(`/api/create-new-handbook`, data);
}
export const getAllHandbookService = () => {
    return axios.get(`/api/get-handbook`);
}
export const getDetailHandbookByIdService = (id) => {
    return axios.get(`/api/get-detail-handbook-by-id?id=${id}`);
}
export const deleteHandbookService = (handbookId, force = false) => {
    return axios.delete('/api/delete-handbook', {
        data: {
            id: handbookId,
            force: force
        }
    });
}
export const editHandbookService = (data) => {
    return axios.put('/api/edit-handbook', data);
}
