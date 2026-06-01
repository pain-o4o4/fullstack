import axios from '../auth/axiosInstance';

export const bulkCreateScheduleService = (data) => {
    return axios.post(`/api/bulk-create-schedule`, data);
}
export const getScheduleByDate = (doctorId, date) => {
    return axios.get('/api/get-schedule-doctor-by-date', {
        params: {
            doctorId: doctorId,
            date: date
        }
    });
}
export const postBookAppointment = (data) => {
    return axios.post(`/api/patient-book-appointment`, data)
}
export const postVerifyAppointmentService = (data) => {
    return axios.post(`/api/verify-book-appointment`, data)
}
export const getAllAppointmentsByIdService = (inputId) => {
    return axios.get(`/api/get-all-appointments-by-id?id=${inputId}`);
}
export const getHistoryAppointmentByIdService = (inputId) => {
    return axios.get(`/api/get-history-appointment-by-id?id=${inputId}`);
}
export const getListPatientForDoctor = (data) => {
    return axios.get(`/api/get-list-patient-for-doctor?doctorId=${data.doctorId}&date=${data.date}`);
}
export const getDetailSchedulePatient = (bookingId) => {
    return axios.get(`/api/get-detail-schedule-patient?bookingId=${bookingId}`);
}
export const updateBookingStatus = (data) => {
    return axios.put('/api/update-booking-status', data);
}
export const getListBookingHistoryService = (data) => {
    return axios.get(`/api/get-list-booking-history`, { params: data });
}
export const updateBookingServiceManual = (data) => {
    return axios.put('/api/update-booking', data);
}
export const deleteBookingServiceManual = (id) => {
    return axios.delete('/api/delete-booking', { data: { id } });
}
