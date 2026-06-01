import axios from '../auth/axiosInstance';

export const searchGlobal = (keyword, signal) => {
    return axios.get(`/api/search?q=${encodeURIComponent(keyword)}`, {
        signal: signal,
        timeout: 10000
    });
}
export const saveSearchHistoryApi = (userId, keyword) => {
    return axios.post('/api/save-search-history', { userId, keyword });
}
export const getSearchHistoryApi = (userId) => {
    return axios.get(`/api/get-search-history?userId=${userId}`);
}
export const deleteSearchHistoryItemApi = (userId, id) => {
    return axios.delete('/api/delete-search-history-item', { data: { userId, id } });
}
export const clearSearchHistoryApi = (userId) => {
    return axios.delete('/api/clear-search-history', { data: { userId } });
}
export const getSystemStatisticsService = () => {
    return axios.get('/api/get-system-statistics');
}
export const getAllEmailTemplatesApi = () => {
    return axios.get('/api/get-all-email-templates');
}
export const saveEmailTemplateApi = (data) => {
    return axios.post('/api/save-email-template', data);
}
export const getAllCodeService = (inputType) => {
    return axios.get(`/api/allcode?type=${inputType}`);
}
export const getAllUsers = (inputId) => {
    return axios.get(`/api/get-all-users?id=${inputId}`);
}
export const createNewUsersService = (data) => {
    console.log(`check data from service`, data)
    return axios.post(`/api/create-new-user`, data)
}
export const deleteUserService = (userId, force = false) => {
    return axios.delete('/api/delete-user', {
        data: {
            id: userId,
            force: force
        }
    });
}
export const editUserService = (data) => {
    console.log(`check data from service`, data)
    return axios.put('/api/edit-user', data);
}
export const postUpdatePatientService = (data) => {
    return axios.post(`/api/update-patient`, data);
}
export const verifyPaymentStatus = (orderCode) => {
    return axios.post('/api/verify-payment-status', { orderCode });
}
