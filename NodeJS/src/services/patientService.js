import { raw } from "body-parser";
import db from "../../models/index"
require("dotenv").config();
import _ from "lodash";
import { Op, where } from 'sequelize';
import moment from 'moment'
import emailService from "./emailService";
const payOS = require('../config/payos');
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE
const URL_REACT = process.env.URL_REACT
import { v4 as uuidv4 } from 'uuid';
let buildUrlEmail = (doctorId, token) => {
    // Không tạo uuid ở đây nữa, mà nhận từ tham số truyền vào
    return `${process.env.URL_REACT}/verify-booking?doctorId=${doctorId}&token=${token}`;
}

let postBookAppointment = async (data) => {
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
};//bỏ
let postBookAppointmentService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data) {
                return resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!"
                });
            }

            let token = uuidv4();
            let appointment = await db.Booking.create({
                statusId: 'S1',
                doctorId: data.doctorId,
                patientId: data.patientId,
                paymentId: data.paymentId,
                date: data.date,
                timeType: data.timeType,
                token: token
            });

            // 2. Tạo đơn hàng payOS
            const orderCode = Number(String(Date.now()).slice(-6));

            // Ép kiểu amount từ price gửi lên
            let finalAmount = Number(data.price);
            if (isNaN(finalAmount) || finalAmount < 2000) {
                finalAmount = 5000;
            }

            const body = {
                orderCode: orderCode,
                amount: finalAmount,
                description: `Booking for ${data.fullName || 'BN'}`.slice(0, 25),
                returnUrl: `${URL_REACT}/payment-success`,
                cancelUrl: `${URL_REACT}/payment-cancel`,
                items: [
                    {
                        name: "Appointment booking",
                        quantity: 1,
                        price: finalAmount
                    }
                ]
            };

            // GỌI PAYOS
            try {
                const paymentLinkRes = await payOS.createPaymentLink(body);

                if (paymentLinkRes && paymentLinkRes.checkoutUrl) {
                    return resolve({
                        errCode: 0,
                        data: paymentLinkRes.checkoutUrl // Trả về link để FE redirect
                    });
                }
            } catch (payosError) {
                console.log('>>> PAYOS ERROR:', payosError.message);
                return resolve({
                    errCode: -1,
                    errMessage: "PayOS Error: " + payosError.message
                });
            }

        } catch (e) {
            console.log('>>> SYSTEM ERROR:', e);
            reject(e);
        }
    });
}

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
let processPayOSWebhook = (webhookData) => {
    return new Promise(async (resolve, reject) => {
        try {
            // 1. Kiem tra du lieu tu PayOS
            const verifiedData = payOS.verifyPaymentWebhookData(webhookData);

            // 2. payOS quy định "00" là thành công
            if (verifiedData.code === "00") {
                let bookingId = verifiedData.orderCode;

                // 3. Tìm booking và cập nhật trạng thái
                let booking = await db.Booking.findOne({
                    where: { id: bookingId, statusId: 'S1' },
                    include: [
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] },
                        { model: db.Allcode, as: 'timeData', attributes: ['valueVi', 'valueEn'] }
                    ],
                    raw: false
                });

                if (booking) {
                    // Update trạng thái sang S2 (Đã thanh toán)
                    booking.statusId = 'S2';
                    await booking.save();

                    // 4. Gửi email thông báo
                    await emailService.sendSimpleEmail({
                        receiverEmail: booking.email,
                        patientName: booking.fullName,
                        doctorName: `${booking.doctorData.lastName} ${booking.doctorData.firstName}`,
                        time: booking.timeData.valueVi,
                        clinicName: "chua gan relationship voi clinic",
                        addressClinic: "chua gan relationship voi clinic",
                        language: booking.language
                    });

                    console.log(`>>> Booking ID ${bookingId} updated to S2 and Email sent!`);
                }
            }

            resolve({
                errCode: 0,
                errMessage: 'Webhook processed successfully'
            });

        } catch (e) {
            reject(e);
        }
    });
};
export default {
    postBookAppointmentService,
    postVerifyAppointmentService,
    getAllAppointmentsByIdService,
    postBookAppointment,
    processPayOSWebhook
}