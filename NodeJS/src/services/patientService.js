import { raw } from "body-parser";
import db from "../../models/index"
require("dotenv").config();
import _ from "lodash";
import { Op, where } from 'sequelize';
import moment from 'moment'
import emailService from "./emailService";
import { v4 as uuidv4 } from 'uuid';
import payOS from '../config/payos';
import bcrypt from "bcryptjs";
import { hashUserPassword } from './userService'
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE
const URL_REACT = process.env.URL_REACT


let buildUrlEmail = (doctorId, token) => {
    return `${process.env.URL_REACT}/verify-booking?doctorId=${doctorId}&token=${token}`;
}


let postBookAppointmentService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data) {
                return resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!"
                });
            }
            let appointment;
            if (data.bookingId) {
                // CASE 1: Booking already exists, user wants to pay now
                appointment = await db.Booking.findOne({
                    where: { id: data.bookingId, statusId: 'S1' },
                    raw: false
                });
                if (!appointment) {
                    return resolve({
                        errCode: 2,
                        errMessage: "Appointment not found, expired or already paid!"
                    });
                }
            } else {
                // CASE 2: New booking creation
                const orderCode = Number(String(Date.now()).slice(-6));
                let token = uuidv4();
                appointment = await db.Booking.create({
                    statusId: 'S1', // Always start as S1
                    doctorId: data.doctorId,
                    patientId: data.patientId,
                    paymentId: data.paymentId,
                    date: data.date,
                    orderCode: orderCode,
                    timeType: data.timeType,
                    token: token
                });

                return resolve({
                    errCode: 0,
                    data: {
                        bookingId: appointment.id
                    }
                });
            }

            // PayOS logic...
            const orderCode = Number(appointment.orderCode);
            const token = appointment.token;
            const finalAmount = 5000;

            const body = {
                orderCode: orderCode,
                amount: finalAmount,
                description: `Booking for ${data.fullName || 'BN'}`.slice(0, 25),
                returnUrl: `${process.env.URL_REACT}/patient/my-booking`,
                cancelUrl: `${process.env.URL_REACT}/verify-booking?token=${token}`,
                items: [
                    {
                        name: "Appointment booking",
                        quantity: 1,
                        price: finalAmount
                    }
                ]
            };

            const payosInstance = payOS?.default || payOS;
            if (!payosInstance || typeof payosInstance.paymentRequests?.create !== 'function') {
                throw new Error("Unable to call PayOS. Check @payos/node configuration.");
            }

            console.log(">>> [DEBUG] Sending to PayOS:", JSON.stringify(body, null, 2));

            let paymentLinkRes;
            try {
                paymentLinkRes = await payosInstance.paymentRequests.create(body);
            } catch (payosError) {
                console.error(">>> [ERROR] PayOS API:", payosError);
                return resolve({
                    errCode: 3,
                    errMessage: `PayOS API Error: ${payosError.message || "Failed to create payment link"}`
                });
            }

            if (paymentLinkRes && paymentLinkRes.checkoutUrl) {
                return resolve({
                    errCode: 0,
                    data: {
                        checkoutUrl: paymentLinkRes.checkoutUrl,
                        bookingId: appointment.id
                    }
                });
            } else {
                throw new Error("PayOS response missing checkoutUrl");
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
                // 1. Auto cleanup for this patient's records
                let nowMillis = moment().valueOf();
                let todayStart = moment().startOf('day').valueOf();
                let fifteenMins = 15 * 60 * 1000;

                let allActive = await db.Booking.findAll({
                    where: {
                        patientId: id,
                        statusId: { [Op.in]: ['S1', 'S2'] }
                    },
                    raw: false
                });

                for (let booking of allActive) {
                    const createdAt = new Date(booking.createdAt).getTime();
                    const bookingDate = Number(booking.date);

                    if (booking.statusId === 'S1' && (nowMillis - createdAt > fifteenMins)) {
                        booking.statusId = 'S4';
                        await booking.save();
                    }
                    if (booking.statusId === 'S2' && (bookingDate < todayStart)) {
                        booking.statusId = 'S5';
                        await booking.save();
                    }
                }

                // 2. Fetch the updated list
                let data = await db.Booking.findAll({
                    where: {
                        patientId: id,
                        statusId: { [Op.in]: ['S1', 'S2', 'S3', 'S4', 'S5'] } // Fetch all types
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

let getDetailSchedulePatient = async (bookingId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!bookingId) {
                resolve({ errCode: 1, errMessage: 'Missing ID!' });
            } else {
                // 1. Fetch & Auto-Cleanup for this specific booking if needed
                let appointment = await db.Booking.findOne({
                    where: { id: bookingId },
                    raw: false
                });

                if (appointment && appointment.statusId === 'S1') {
                    let nowMillis = moment().valueOf();
                    let fifteenMins = 15 * 60 * 1000;
                    if (nowMillis - new Date(appointment.createdAt).getTime() > fifteenMins) {
                        appointment.statusId = 'S4';
                        await appointment.save();
                    }
                }
                if (appointment && appointment.statusId === 'S2') {
                    let todayStart = moment().startOf('day').valueOf();
                    if (Number(appointment.date) < todayStart) {
                        appointment.statusId = 'S5';
                        await appointment.save();
                    }
                }

                // 2. Fetch with all relations
                let data = await db.Booking.findOne({
                    where: { id: bookingId },
                    include: [
                        {
                            model: db.User,
                            as: 'doctorBookingData',
                            attributes: ['firstName', 'lastName', 'image'],
                            include: [
                                {
                                    model: db.Doctor_infor, as: 'doctorinforData',
                                    attributes: ['nameClinic', 'addressClinic', 'priceId', 'paymentId'],
                                    include: [
                                        { model: db.Allcode, as: 'priceTypeData', attributes: ['valueVi', 'valueEn'] },
                                        { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueVi', 'valueEn'] }
                                    ]
                                },
                                { model: db.Markdown, as: 'markdownData', attributes: ['description'] }
                            ]
                        },
                        {
                            model: db.User,
                            as: 'patientBookingData',
                            attributes: ['firstName', 'lastName', 'email', 'phonenumber', 'address'],
                            include: [
                                { model: db.Allcode, as: 'genderData', attributes: ['valueVi', 'valueEn'] }
                            ]
                        },
                        { model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueVi', 'valueEn'] },
                        { model: db.Allcode, as: 'statusData', attributes: ['valueVi', 'valueEn'] }
                    ],
                    raw: false,
                    nest: true
                });

                if (data && data.doctorBookingData && data.doctorBookingData.image) {
                    data.doctorBookingData.image = Buffer.from(data.doctorBookingData.image, 'base64').toString('binary');
                }

                resolve({
                    errCode: 0,
                    data: data
                });
            }
        } catch (error) {
            reject(error);
        }
    });
}

let processPayOSWebhook = (webhookBody) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(">>> PAYOS WEBHOOK JUST CALLED!");

            // ====================== VERIFY WEBHOOK (ASYNC) ======================
            let verifiedData;
            try {
                // Phải await vì hàm này trả về Promise
                verifiedData = await payOS.webhooks.verify(webhookBody);
            } catch (verifyError) {
                console.error('>>> Webhook signature không hợp lệ:', verifyError.message);
                return resolve({ errCode: 0 });
            }

            console.log(">>> Webhook verified successfully:", JSON.stringify(verifiedData, null, 2));

            // Lấy orderCode từ cấu trúc đúng
            const orderCode = verifiedData.data?.orderCode || verifiedData.orderCode;

            if (!orderCode) {
                console.log(">>> Webhook thiếu orderCode trong data");
                return resolve({ errCode: 0 });
            }

            console.log(">>> Đang xử lý thanh toán cho orderCode:", orderCode);

            if (webhookBody.code === "00" || verifiedData.code === "00") {

                let booking = await db.Booking.findOne({
                    where: {
                        orderCode: String(orderCode), // Ép kiểu string cho chắc chắn khớp DB
                        statusId: { [Op.in]: ['S1', 'S4'] } // Allow rescuing S4 if late payment arrives
                    },
                    include: [
                        { model: db.User, as: 'patientBookingData', attributes: ['email', 'firstName', 'lastName'] },
                        { model: db.User, as: 'doctorBookingData', attributes: ['firstName', 'lastName'] },
                        { model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueVi'] }
                    ],
                    raw: false
                });

                if (booking) {
                    console.log(`>>> Đã tìm thấy Booking ID: ${booking.id}. Đang cập nhật trạng thái...`);

                    booking.statusId = 'S2';
                    await booking.save();

                    // Lấy email từ patientBookingData (vì bảng Booking thường không có cột email)
                    const receiverEmail = booking.patientBookingData?.email;

                    if (receiverEmail) {
                        console.log(">>> Đang tiến hành gửi email tới:", receiverEmail);

                        await emailService.sendSimpleEmail({
                            receiverEmail: receiverEmail,
                            patientName: `${booking.patientBookingData?.lastName || ''} ${booking.patientBookingData?.firstName || ''}`.trim() || "Bệnh nhân",
                            doctorName: `${booking.doctorBookingData?.lastName || ''} ${booking.doctorBookingData?.firstName || ''}`.trim(),
                            time: booking.timeTypeDataPatient?.valueVi || "",
                            clinicName: "BookingCare 🏥",
                            addressClinic: "Hà Nội, Việt Nam",
                            language: booking.language || 'vi'
                        });

                        console.log(">>> [SUCCESS] EMAIL ĐÃ GỬI THÀNH CÔNG!");
                    } else {
                        console.log(">>> [WARNING] Tìm thấy booking nhưng Patient email bị trống!");
                    }
                } else {
                    console.log(`>>> [ERROR] Không tìm thấy booking với orderCode = ${orderCode} trong DB.`);
                }
            } else {
                // Sửa log này để ông không bị nhầm
                console.log(`>>> Trạng thái PayOS báo về không phải thành công. Code: ${webhookBody.code}`);
            }

            resolve({ errCode: 0 });

        } catch (e) {
            console.error('>>> WEBHOOK SYSTEM ERROR:', e.message || e);
            resolve({ errCode: 0 });   // Luôn trả OK
        }
    });
};
let postUpdatePatientService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.id || !data.roleId) {
                return resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                });
            }

            let user = await db.User.findOne({
                where: {
                    email: data.email,
                    id: Number(data.id),
                    roleId: data.roleId
                },
                raw: false
            });

            if (user) {
                const fields = [
                    'firstName', 'lastName', 'address',
                    'phonenumber'
                ];
                const updateData = {};

                fields.forEach(field => {
                    if (data[field] !== undefined) {
                        updateData[field] = data[field];
                    }
                });

                if (data.image !== undefined) {
                    updateData.image = data.image;
                }
                // if (data.password !== undefined) {
                //     let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                //     updateData.password = hashPasswordFromBcrypt;
                // }
                if (data.password) {
                    const salt = bcrypt.genSaltSync(10);
                    updateData.password = bcrypt.hashSync(data.password, salt);
                    console.log(">>> updateData.password: ", updateData.password, data.password);
                }
                Object.assign(user, updateData);

                await user.save();

                resolve({
                    errCode: 0,
                    message: 'Update user success!'
                });
            } else {
                resolve({
                    errCode: 2,
                    errMessage: 'User not found!'
                });
            }
        } catch (e) {
            reject(e);
        }
    });
}
export default {
    postBookAppointmentService,
    postVerifyAppointmentService,
    getAllAppointmentsByIdService,
    processPayOSWebhook,
    postUpdatePatientService,
    getDetailSchedulePatient
}