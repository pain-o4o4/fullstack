import { raw } from "body-parser";
import db from "../../models/index"
require("dotenv").config();
import _ from "lodash";
import { Op, where } from 'sequelize';
import moment from 'moment'
import emailService from "./emailService";
import { v4 as uuidv4 } from 'uuid';
import payOS from '../config/payos';

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
            const orderCode = Number(String(Date.now()).slice(-6));

            let token = uuidv4();
            let appointment = await db.Booking.create({
                statusId: 'S1',
                doctorId: data.doctorId,
                patientId: data.patientId,
                paymentId: data.paymentId,
                date: data.date,
                orderCode: orderCode,
                timeType: data.timeType,
                token: token
            });


            let finalAmount = Number("2000");
            // if (isNaN(finalAmount) || finalAmount < 2000) {
            //     finalAmount = 5000;
            // }

            const body = {
                orderCode: orderCode,
                amount: finalAmount,
                description: `Booking for ${data.fullName || 'BN'}`.slice(0, 25),
                returnUrl: `${process.env.URL_REACT}/patient/my-booking`,
                cancelUrl: `${process.env.URL_REACT}/verify-booking?token=${token}`, //lay trang nay huy
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
                throw new Error("Unable to call paymentRequests.create. Check @payos/node again!");
            }

            const paymentLinkRes = await payosInstance.paymentRequests.create(body);

            if (paymentLinkRes && paymentLinkRes.checkoutUrl) {
                return resolve({
                    errCode: 0,
                    data: paymentLinkRes.checkoutUrl
                });
            } else {
                throw new Error("PayOS does not return the checkout URL.");
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
                        statusId: 'S1'
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

export default {
    postBookAppointmentService,
    postVerifyAppointmentService,
    getAllAppointmentsByIdService,
    processPayOSWebhook
}