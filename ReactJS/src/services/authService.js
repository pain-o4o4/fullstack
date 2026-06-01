import axios from '../auth/axiosInstance';

export const handleLoginApi = (email, password) => {
    return axios.post('/api/login', { email, password });
}
export const handleLogoutApi = () => {
    return axios.post('/api/logout');
}
export const initiateRegister = (data) => {
    return axios.post('/api/register', { ...data, action: 'initiate' });
}
export const verifyRegisterOtp = (email, verificationCode) => {
    return axios.post('/api/register', { email, verificationCode, action: 'verify' });
}
export const resendRegisterOtp = (email) => {
    return axios.post('/api/register', { email, action: 'resend' });
}
export const handleForgotPasswordAPI = (email, language = 'vi') => {
    return axios.post('/api/forgot-password', { email, language });
}
export const handleResetPasswordAPI = (data) => {
    return axios.post('/api/reset-password', data);
}
