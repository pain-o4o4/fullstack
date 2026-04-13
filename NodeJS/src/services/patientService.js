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

let postBookAppointmentService = async (infor) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!infor.email || !infor.doctorId || !infor.date || !infor.timeType) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!"
                })
            } else {
                let token = uuidv4();
                // await emailService.sendSimpleEmail(infor.email)
                await emailService.sendSimpleEmail({
                    receiverEmail: infor.email,
                    patientName: infor.fullName,
                    time: infor.date,
                    doctorName: `Dr. ${infor.doctorName}" Bác sĩ chuyên kho tâm thần"`,
                    language: infor.language,
                    redirectLink: buildUrlEmail(infor.doctorId, token)
                })
                let user = await db.User.findOrCreate({
                    where: { email: infor.email },
                    defaults: {
                        email: infor.email,
                        roleId: 'R3', // Kiểm tra lại roleId hay roleId trong model nhé
                        gender: infor.gender,
                        address: infor.address,
                        firstName: infor.fullName
                    }
                });
                if (user && user[0]) {
                    let count = await db.Booking.count({
                        where: {
                            doctorId: infor.doctorId,
                            date: infor.date,
                            timeType: infor.timeType
                        }
                    });
                    if (count < MAX_NUMBER_SCHEDULE) {
                        // 4. Tạo lịch hẹn mới (Dùng create)
                        await db.Booking.create({
                            statusId: 'S1',
                            doctorId: infor.doctorId,
                            patientId: user[0].id,
                            date: infor.date,
                            timeType: infor.timeType,
                            token: token
                        });

                        return resolve({
                            errCode: 0,
                            errMessage: "OK"
                        });
                    }
                    else {
                        return resolve({
                            errCode: 2,
                            errMessage: "Your schedule is full!"
                        });
                    }

                }
                resolve({
                    errCode: 0,
                    errMessage: "OK",
                    user: user
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}
let postVeryfyAppointmentService = async (infor) => {
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
export default {
    postBookAppointmentService,
    postVeryfyAppointmentService,
}