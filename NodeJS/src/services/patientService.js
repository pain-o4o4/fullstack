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

/**
 * finalizeBookingPayment - Hàm dùng chung (Atomic) để:
 * 1. Khóa dòng booking (LOCK.UPDATE) để tránh race condition
 * 2. Cập nhật statusId S1 -> S2
 * 3. Gửi email xác nhận một lần duy nhất
 * 
 * Được gọi bởi cả processPayOSWebhook và verifyPaymentStatusService.
 * @param {number|string} orderCode 
 * @returns {{ updated: boolean, errMessage?: string }}
 */
let finalizeBookingPayment = async (orderCode) => {
    const t = await db.sequelize.transaction();
    try {
        const orderCodeNum = Number(orderCode);
        const orderCodeStr = String(orderCode);
        console.log(`>>> [finalize] Looking for orderCode: ${orderCodeStr} (num: ${orderCodeNum})`);

        // Tìm với cả số và chuỗi để đảm bảo tương thích
        let booking = await db.Booking.findOne({
            where: {
                [Op.or]: [
                    { orderCode: orderCodeNum },
                    { orderCode: orderCodeStr }
                ],
                statusId: 'S1'
            },
            include: [
                { model: db.User, as: 'patientBookingData', attributes: ['email', 'firstName', 'lastName'] },
                { model: db.User, as: 'doctorBookingData', attributes: ['firstName', 'lastName'] },
                { model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueVi'] }
            ],
            lock: t.LOCK.UPDATE,
            transaction: t,
            raw: false
        });

        console.log(`>>> [finalize] Booking found: ${booking ? `id=${booking.id} status=${booking.statusId}` : 'NOT FOUND'}`);

        if (!booking) {
            await t.rollback();
            return { updated: false, errMessage: 'Booking not found or already processed.' };
        }

        // Cập nhật trạng thái
        booking.statusId = 'S2';
        await booking.save({ transaction: t });
        await t.commit();

        // Gửi email SAU KHI commit (không block transaction)
        const receiverEmail = booking.patientBookingData?.email;
        if (receiverEmail) {
            try {
                await emailService.sendSimpleEmail({
                    receiverEmail: receiverEmail,
                    patientName: `${booking.patientBookingData?.lastName || ''} ${booking.patientBookingData?.firstName || ''}`.trim() || 'Bệnh nhân',
                    doctorName: `${booking.doctorBookingData?.lastName || ''} ${booking.doctorBookingData?.firstName || ''}`.trim(),
                    time: booking.timeTypeDataPatient?.valueVi || '',
                    clinicName: 'BookingCare 🏥',
                    addressClinic: 'Hà Nội, Việt Nam',
                    language: 'vi'
                });
                console.log(`>>> [finalizeBookingPayment] Email sent to ${receiverEmail}`);
            } catch (emailErr) {
                // Không throw - email fail không nên ảnh hưởng đến kết quả thanh toán
                console.error('>>> [finalizeBookingPayment] Email failed:', emailErr.message);
            }
        }

        return { updated: true };
    } catch (e) {
        if (t && !t.finished) await t.rollback();
        console.error('>>> [finalizeBookingPayment] Error:', e.message);
        return { updated: false, errMessage: e.message };
    }
};


let buildUrlEmail = (doctorId, token) => {
    return `${process.env.URL_REACT}/verify-booking?doctorId=${doctorId}&token=${token}`;
}


let postBookAppointmentService = (data) => {
    return new Promise(async (resolve, reject) => {
        const t = await db.sequelize.transaction();
        try {
            if (!data || !data.doctorId || !data.date || !data.timeType || !data.patientId) {
                await t.rollback();
                return resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!"
                });
            }

            let formattedDate = '';
            if (moment(data.date, 'DD/MM/YYYY', true).isValid()) {
                formattedDate = data.date;
            } else {
                formattedDate = moment(+data.date).startOf('day').format('DD/MM/YYYY');
            }

            // 1. Kiểm tra xem Bệnh nhân này đã đặt lịch cho khung giờ này chưa? (Tránh đặt trùng)
            let appointment = await db.Booking.findOne({
                where: {
                    patientId: data.patientId,
                    doctorId: data.doctorId,
                    date: formattedDate,
                    timeType: data.timeType,
                    statusId: { [Op.ne]: 'S4' }
                },
                transaction: t,
                raw: false
            });

            if (appointment && appointment.statusId !== 'S1') {
                await t.rollback();
                return resolve({
                    errCode: 5,
                    errMessage: "Bạn đã đặt lịch khám này rồi. Vui lòng kiểm tra lại trong mục 'Lịch hẹn của bạn'."
                });
            }

            if (appointment && appointment.statusId === 'S1') {
                // CASE 1: Đã có booking (S1), tái sử dụng nhưng sinh mã đơn mới 
                // để tránh lỗi trùng mã (Duplicate OrderCode) trên PayOS
                const newOrderCode = Number(String(Date.now()).slice(-10));
                await appointment.update({
                    reason: data.reason,
                    paymentId: data.paymentId,
                    orderCode: newOrderCode
                }, { transaction: t });
            } else {
                // CASE 2: Tạo mới booking (Chưa có hoặc đã hủy)

                // 2. KHÓA dòng Schedule này lại để kiểm tra sức chứa
                let schedule = await db.Schedule.findOne({
                    where: { doctorId: data.doctorId, date: formattedDate, timeType: data.timeType },
                    transaction: t,
                    lock: t.LOCK.UPDATE
                });

                if (!schedule) {
                    await t.rollback();
                    return resolve({
                        errCode: 3,
                        errMessage: "Bác sĩ chưa mở lịch khám cho khung giờ này!"
                    });
                }

                // 3. Đếm số lượng booking hiện có
                let bookingCount = await db.Booking.count({
                    where: {
                        doctorId: data.doctorId,
                        date: formattedDate,
                        timeType: data.timeType,
                        // statusId: { [Op.ne]: 'S4' } // Hủy
                        statusId: { [Op.in]: ['S1', 'S2', 'S3'] }
                    },
                    transaction: t
                });

                if (bookingCount >= schedule.maxNumber) {
                    await t.rollback();
                    return resolve({
                        errCode: 4,
                        errMessage: "Khung giờ này đã đầy, vui lòng chọn khung giờ khác!"
                    });
                }

                const orderCode = Number(String(Date.now()).slice(-10));
                let token = uuidv4();
                appointment = await db.Booking.create({
                    statusId: 'S1', // đợi thanh toansn
                    doctorId: data.doctorId,
                    patientId: data.patientId,
                    clinicId: data.clinicId,
                    paymentId: data.paymentId,
                    date: formattedDate,
                    orderCode: orderCode,
                    timeType: data.timeType,
                    token: token,
                    reason: data.reason
                }, { transaction: t });
            }

            // --- PAYOS LOGIC ---
            const finalAmount = 5000;
            const body = {
                orderCode: Number(appointment.orderCode),
                amount: finalAmount,
                description: `Booking for ${data.fullName || 'BN'}`.slice(0, 25),
                returnUrl: `${process.env.URL_REACT}/patient/my-booking`,
                cancelUrl: `${process.env.URL_REACT}/verify-booking?token=${appointment.token}&doctorId=${appointment.doctorId}&status=CANCELLED`,
                items: [{ name: "Appointment booking", quantity: 1, price: finalAmount }]
            };

            // Lấy instance chuẩn xác nhất
            let payosInstance = payOS;
            if (payOS && payOS.default) payosInstance = payOS.default;


            try {
                let paymentLinkRes = await payosInstance.paymentRequests.create(body);

                // Guard: Kiểm tra checkoutUrl có hợp lệ không trước khi commit
                if (!paymentLinkRes || !paymentLinkRes.checkoutUrl) {
                    throw new Error('PayOS returned invalid response: missing checkoutUrl');
                }

                await t.commit();
                return resolve({
                    errCode: 0,
                    data: { checkoutUrl: paymentLinkRes.checkoutUrl, bookingId: appointment.id }
                });
            } catch (payosError) {
                console.error(">>> [PAYOS API ERROR]:", payosError?.response?.data || payosError.message || payosError);
                if (t && !t.finished) await t.rollback();
                return resolve({
                    errCode: 3,
                    errMessage: "Lỗi kết nối cổng thanh toán. Vui lòng thử lại!"
                });
            }

        } catch (e) {
            console.log('>>> SYSTEM ERROR:', e);
            if (t && !t.finished) await t.rollback();
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
                        statusId: { [Op.in]: ['S1', 'S2', 'S4'] }
                    },
                    raw: false
                });
                if (appointment) {
                    if (infor.status === 'CANCELLED') {
                        appointment.statusId = 'S4';
                        await appointment.save();

                        // Hủy link thanh toán trên PayOS để không ai thanh toán được nữa
                        if (appointment.orderCode) {
                            try {
                                const payosInstance = payOS?.default || payOS;
                                let cancelFn = payosInstance?.paymentRequests?.cancel
                                    || payosInstance?.cancelPaymentLink;
                                if (typeof cancelFn === 'function') {
                                    await cancelFn.call(payosInstance.paymentRequests || payosInstance, appointment.orderCode, 'Cancelled by user');
                                    console.log(`>>> [CANCEL] PayOS link cancelled for orderCode: ${appointment.orderCode}`);
                                }
                            } catch (payosErr) {
                                // Không throw - hủy PayOS thất bại không ảnh hưởng đến trạng thái DB
                                console.warn('>>> [CANCEL] PayOS link cancellation failed (non-critical):', payosErr.message);
                            }
                        }

                        return resolve({ errCode: 0, errMessage: "CANCELLED" });
                    }

                    if (appointment.statusId === 'S1') {
                        appointment.statusId = 'S2';
                        await appointment.save();
                    }

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
                    const bookingDate = /^\d{10,13}$/.test(booking.date) ? Number(booking.date) : moment(booking.date, 'DD/MM/YYYY').valueOf();

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
                        },
                        {
                            model: db.Clinic,
                            as: 'clinicBookingData',
                            attributes: ['name', 'address']
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
                    let bookingDate = /^\d{10,13}$/.test(appointment.date) ? Number(appointment.date) : moment(appointment.date, 'DD/MM/YYYY').valueOf();
                    if (bookingDate < todayStart) {
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
                        { model: db.Allcode, as: 'statusData', attributes: ['valueVi', 'valueEn'] },
                        {
                            model: db.Clinic,
                            as: 'clinicBookingData',
                            attributes: ['name', 'address']
                        }
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
//processPayOSWebhook 
let processPayOSWebhook = (webhookBody) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(">>> [WEBHOOK] PAYOS JUST CALLED! Body:", JSON.stringify(webhookBody));

            let verifiedData;
            try {
                verifiedData = await payOS.webhooks.verify(webhookBody);
            } catch (verifyError) {
                console.error('>>> [WEBHOOK] Signature invalid:', verifyError.message);
                return resolve({ errCode: 0 });
            }

            console.log(">>> [WEBHOOK] Verified successfully. Data:", JSON.stringify(verifiedData, null, 2));

            // Lấy orderCode từ cấu trúc PayOS trả về
            const orderCode = verifiedData.orderCode;

            if (webhookBody.code === "00") {
                console.log(">>> [WEBHOOK] Payment Success for orderCode:", orderCode);
                const result = await finalizeBookingPayment(orderCode);
                if (result.updated) {
                    console.log(">>> [WEBHOOK] Booking finalized and email sent for orderCode:", orderCode);
                } else {
                    console.log(">>> [WEBHOOK] Booking not updated (possibly already processed):", result.errMessage);
                }
            } else {
                console.log(`>>> [WEBHOOK] Status not success. Code: ${webhookBody.code}`);
            }

            resolve({ errCode: 0 });

        } catch (e) {
            console.error('>>> [WEBHOOK] System Error:', e);
            resolve({ errCode: 0 });
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
//verifyPaymentStatusService api de kiem tra trang thai thanh toan
let verifyPaymentStatusService = (orderCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!orderCode) {
                return resolve({ errCode: 1, errMessage: "Missing orderCode!" });
            }

            const payosInstance = payOS?.default || payOS;

            let paymentInfo;
            try {
                if (payosInstance.paymentRequests && typeof payosInstance.paymentRequests.getPaymentLinkInformation === 'function') {
                    paymentInfo = await payosInstance.paymentRequests.getPaymentLinkInformation(orderCode);
                } else if (typeof payosInstance.getPaymentLinkInformation === 'function') {
                    paymentInfo = await payosInstance.getPaymentLinkInformation(orderCode);
                } else {
                    throw new Error("Cannot find getPaymentLinkInformation method in PayOS instance.");
                }
            } catch (error) {
                console.error(">>> [VERIFY] PayOS API Error:", error.message);
                return resolve({ errCode: -1, errMessage: error.message });
            }

            const currentStatus = (paymentInfo?.status || "").toUpperCase();
            console.log(">>> [VERIFY] PayOS returned status:", currentStatus, "for orderCode:", orderCode);

            if (currentStatus === "PAID" || currentStatus === "COMPLETED") {
                // Dùng hàm chung - tự động lock, tránh race condition và double email
                const result = await finalizeBookingPayment(orderCode);
                if (result.updated) {
                    return resolve({ errCode: 0, message: "Payment verified and booking confirmed!" });
                } else {
                    // Không tìm thấy S1 nghĩa là đã được Webhook xử lý rồi - vẫn OK
                    return resolve({ errCode: 0, message: "Payment confirmed (already processed by webhook)." });
                }
            }

            // Trả về trạng thái hiện tại cho Frontend biết
            resolve({ errCode: 0, status: currentStatus, message: "Payment not yet completed." });

        } catch (e) {
            console.error(">>> Error in verifyPaymentStatusService:", e);
            resolve({ errCode: -1, errMessage: e.message });
        }
    });
};
// nhan thong tin dat ve xem phim 
//luu vao db trang thai chua thanh toan de giu cho ve xem phim

// config payos
// import service
// taoj ordercode 1 taoj link thanh toan, 2 là xử lý db , 3 la cap nhap trang thai don hang trong , post di payos (/api/verify-payment-status)

// api thong tin don hang /api/webhook/payos // chuyen trang thai cho thanh toan -> da thanh toan - gui email
// api gui xac nhan thanh toan /api/verify-payment-status // // chuyen trang thai cho thanh toan -> da thanh toan - gui email

// truong hop huy thanh toan tra ve component thong bao huy don hang

// 
export default {
    postBookAppointmentService,
    postVerifyAppointmentService,
    getAllAppointmentsByIdService,
    processPayOSWebhook,
    postUpdatePatientService,
    getDetailSchedulePatient,
    verifyPaymentStatusService
}