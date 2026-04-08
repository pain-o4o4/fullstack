// import db from '../models/index';
import doctorService from '../services/doctorService';
let getTopDoctorHome = async (req, res) => {
    // return res.render('homepage.ejs')
    let limit = (req.query.limit) ? req.query.limit : 10;
    if (limit > 15) {
        limit = 15;
    }
    try {
        let response = await doctorService.getTopDoctorHomeService(+limit);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
            errPin: JSON.stringify(error)
        });
    }
}
let getAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctorsService();
        return res.status(200).json(doctors);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
            errPin: JSON.stringify(error)
        });
    }
}
let postInforDoctor = async (req, res) => {
    try {
        let infor = req.body;
        console.log('infor body', infor);
        let response = await doctorService.postInforDoctorService(infor);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
            errPin: JSON.stringify(error)
        });
    }
}
let getDetailDoctorById = async (req, res) => {
    try {
        let infor = req.query.id;
        let response = await doctorService.getDetailDoctorByIdService(infor);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
            errPin: JSON.stringify(error)
        });
    }
}
let bulkCreateSchedule = async (req, res) => {
    try {
        let infor = await doctorService.bulkCreateScheduleService(req.body);
        return res.status(200).json(infor);
    } catch (error) {
        console.log("CHECK BUG:", error);
        return res.status(200).json({
            errCode: -1,
            errMessage: error.message,
            errPin: JSON.stringify(error)
        });
    }
}
let getScheduleByDate = async (req, res) => {
    try {
        let infor = await doctorService.getScheduleByDateService(req.query.doctorId, req.query.date);
        return res.status(200).json(infor);
    } catch (error) {
        console.log(">>> check query params:", req.query.doctorId, req.query.date);
        return res.status(200).json({
            errCode: -1,
            errMessage: error.message,
            errPin: JSON.stringify(error)
        });
    }
}
let getExtraDoctorById = async (req, res) => {
    try {
        let infor = await doctorService.getExtraDoctorById(req.query.doctorId)
        return res.status(200).json(infor);

    } catch (error) {
        // console.log(">>> check query params:", req.query.doctorId, req.query.date);
        return res.status(200).json({
            errCode: -1,
            errMessage: error.message,
            errPin: JSON.stringify(error)
        });
    }
}
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    postInforDoctor: postInforDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraDoctorById: getExtraDoctorById,
}