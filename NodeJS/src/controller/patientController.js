import patientService from '../services/patientService'

let postBookAppointment = async (req, res) => {
    try {
        let infor = req.body;
        console.log('infor body', infor);
        let response = await patientService.postBookAppointmentService(infor);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server controller',
            errPin: JSON.stringify(error)
        });
    }
}
let postVerifyAppointment = async (req, res) => {
    try {
        let infor = req.body;
        console.log('infor body', infor);
        let response = await patientService.postVerifyAppointmentService(infor);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server ',
            errPin: JSON.stringify(error)
        });
    }
}
let getAllAppointmentsById = async (req, res) => {
    try {
        let idPatient = req.query.id
        if (!idPatient) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameter: id'
            });
        }
        let response = await patientService.getAllAppointmentsByIdService(idPatient);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
        });
    }
}
// src/controllers/patientController.js

let handlePayOSWebhook = async (req, res) => {
    try {
        let response = await patientService.processPayOSWebhook(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
}

export default {
    postBookAppointment,
    postVerifyAppointment,
    getAllAppointmentsById,
    handlePayOSWebhook
}