import { raw } from "body-parser";
import db from "../../models/index"
require("dotenv").config();
import _ from "lodash";
import { Op, where } from 'sequelize';
import moment from 'moment'
import emailService from "./emailService";
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE
import { v4 as uuidv4 } from 'uuid';

let buildUrlEmail = (doctorId, token) => {
    // Không tạo uuid ở đây nữa, mà nhận từ tham số truyền vào
    return `${process.env.URL_REACT}/verify-booking?doctorId=${doctorId}&token=${token}`;
}

let postBookAppointmentService = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data) {
                return resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!"
                });
            }
            let token = uuidv4();
            let finalPatientId = null;
            await emailService.sendSimpleEmail({
                receiverEmail: data.email,
                patientName: data.fullName,
                time: data.date,
                doctorName: data.doctorName,
                language: data.language,
                redirectLink: buildUrlEmail(data.doctorId, token)
            });

            if (data.patientId) {
                finalPatientId = data.patientId;
            } else {
                let [user, created] = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        gender: data.gender,
                        address: data.address,
                        firstName: data.fullName,
                        phonenumber: data.phoneNumber
                    }
                });
                finalPatientId = user.id;
            }

            if (finalPatientId) {
                let count = await db.Booking.count({
                    where: {
                        doctorId: data.doctorId,
                        date: data.date,
                        timeType: data.timeType
                    }
                });

                if (count < MAX_NUMBER_SCHEDULE) {
                    await db.Booking.create({
                        statusId: 'S1',
                        doctorId: data.doctorId,
                        patientId: finalPatientId,
                        date: data.date,
                        timeType: data.timeType,
                        token: token,
                        // reason: data.reason 
                    });

                    resolve({
                        errCode: 0,
                        errMessage: "Save infor patient success!"
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: "Heathcare is full this day!"
                    });
                }
            } else {
                resolve({
                    errCode: 3,
                    errMessage: "Patient not found!"
                });
            }

        } catch (e) {
            reject(e);
        }
    });
};
let postVerifyAppointmentService = async (infor) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!infor.doctorId || !infor.token) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!"
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: infor.doctorId,
                        token: infor.token,
                        statusId: 'S1'
                    },
                    raw: false
                });
                if (appointment) {
                    appointment.statusId = 'S2';
                    await appointment.save();
                    return resolve({
                        errCode: 0,
                        errMessage: "OK"
                    });
                } else {
                    return resolve({
                        errCode: 2,
                        errMessage: "Appointment not found!"
                    });
                }
            }
        } catch (error) {
            reject(error);
        }
    })
}
let getAllAppointmentsByIdService = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({ errCode: 1, errMessage: 'Missing required parameter!' });
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        patientId: id,
                        statusId: { [Op.in]: ['S1', 'S2'] }
                    },
                    include: [
                        {
                            model: db.User,
                            as: 'doctorBookingData',
                            attributes: ['firstName', 'lastName'],
                            include: [
                                {
                                    model: db.Doctor_infor,
                                    as: 'doctorinforData',
                                    attributes: ['nameClinic', 'addressClinic']
                                }
                            ]
                        },
                        {
                            model: db.Allcode,
                            as: 'timeTypeDataPatient',
                            attributes: ['valueVi', 'valueEn']
                        },
                        {
                            model: db.Allcode,
                            as: 'statusData',
                            attributes: ['valueVi', 'valueEn']
                        }
                    ],
                    raw: false,
                    nest: true
                });

                resolve({
                    errCode: 0,
                    data: data
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};
export default {
    postBookAppointmentService,
    postVerifyAppointmentService,
    getAllAppointmentsByIdService,
}