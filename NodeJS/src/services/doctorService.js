import { raw } from "body-parser";
import db from "../../models/index"
require("dotenv").config();
import _ from "lodash";
import { Op } from 'sequelize';
import moment from 'moment'
import clinic from "../../models/clinic";
// const { Op } = require('sequelize');
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE

let getTopDoctorHomeService = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limit,
                where: { roleId: "R2" },
                order: [["createdAt", "DESC"]],
                attributes: {
                    exclude: ["password"],
                },
                include: [
                    {
                        model: db.Allcode,
                        as: "positionData",
                        attributes: ["valueEn", "valueVi"],
                    },
                    {
                        model: db.Allcode,
                        as: "genderData",
                        attributes: ["valueEn", "valueVi"],
                    },
                ],
                raw: false,
                nest: true,
            });

            if (users && users.length > 0) {
                users.map(item => {
                    if (item.image) {
                        item.image = Buffer.from(item.image, 'base64').toString('binary');
                    }
                    return item;
                })
            }

            resolve({
                errCode: 0,
                data: users,
            });
        } catch (error) {
            reject(error);
        }
    });
}
let getAllDoctorsService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: "R2" },
                attributes: {
                    exclude: ["password"],
                },
                include: [
                    {
                        model: db.Allcode,
                        as: 'positionData',
                        attributes: ['valueEn', 'valueVi']
                    },
                    {
                        model: db.Allcode,
                        as: 'genderData',
                        attributes: ['valueEn', 'valueVi']
                    },
                ],
                raw: false,
                nest: true
            });

            if (doctors && doctors.length > 0) {
                doctors = doctors.map(item => {
                    if (item.image) {
                        item.image = Buffer.from(item.image, 'base64').toString('binary');
                    }
                    return item;
                });
            }

            resolve({
                errCode: 0,
                data: doctors,
            });
        } catch (error) {
            reject(error);
        }
    });
}

let postInforDoctorService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.doctorId || !data.contentHTML || !data.contentMarkdown || !data.action
                || !data.selectedPrice || !data.selectedPayment || !data.selectedProvince
                || !data.nameClinic || !data.addressClinic || !data.note || !data.specialtyId || !data.clinicId) {
                return resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters !"
                });
            }


            let doctorMarkdown = await db.Markdown.findOne({
                where: { doctorId: data.doctorId },
                raw: false
            });

            if (doctorMarkdown) {
                doctorMarkdown.contentHTML = data.contentHTML;
                doctorMarkdown.contentMarkdown = data.contentMarkdown;
                doctorMarkdown.description = data.description;
                await doctorMarkdown.save();
            } else {
                await db.Markdown.create({
                    contentHTML: data.contentHTML,
                    contentMarkdown: data.contentMarkdown,
                    description: data.description,
                    doctorId: data.doctorId,
                });
            }
            let doctorInfor = await db.Doctor_infor.findOne({
                where: { doctorId: data.doctorId },
                raw: false
            })
            if (doctorInfor) {
                // EDIT
                doctorInfor.doctorId = data.doctorId;
                doctorInfor.priceId = data.selectedPrice;
                doctorInfor.provinceId = data.selectedProvince;
                doctorInfor.paymentId = data.selectedPayment;
                doctorInfor.nameClinic = data.nameClinic;
                doctorInfor.addressClinic = data.addressClinic;
                doctorInfor.note = data.note;
                doctorInfor.specialtyId = data.specialtyId;
                doctorInfor.clinicId = data.clinicId;
                doctorInfor.count = data.maxNumber;
                await doctorInfor.save();
            }
            else {// EDIT
                await db.Doctor_infor.create({
                    doctorId: data.doctorId,
                    priceId: data.selectedPrice,
                    provinceId: data.selectedProvince,
                    paymentId: data.selectedPayment,
                    nameClinic: data.nameClinic,
                    addressClinic: data.addressClinic,
                    note: data.note,
                    specialtyId: data.specialtyId,
                    clinicId: data.clinicId,
                    count: data.maxNumber
                });
            }
            resolve({
                errCode: 0,
                errMessage: "Save info doctor successfully!"
            });
        } catch (error) {
            console.log('>>> check error:', error);
            reject(error);
        }
    })
}
let getDetailDoctorByIdService = (idInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!idInput) {
                return resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!"
                });
            }
            let infor = await db.User.findOne({
                where: { id: idInput },
                attributes: {
                    exclude: ["password"],
                },
                include: [
                    {
                        model: db.Allcode,
                        as: "positionData",
                        attributes: ["valueEn", "valueVi"],
                    },
                    {
                        model: db.Allcode,
                        as: "genderData",
                        attributes: ["valueEn", "valueVi"],
                    },
                    {
                        model: db.Markdown,
                        as: "markdownData",
                        attributes: ["description", "contentHTML", "contentMarkdown"],
                    },
                    {
                        model: db.Doctor_infor,
                        as: "doctorinforData",
                        attributes: { exclude: ["id", "createdAt", "updatedAt", "doctorId"], },
                        include: [
                            {
                                model: db.Allcode,
                                as: "priceTypeData",
                                attributes: ["valueEn", "valueVi"],
                            },
                            {
                                model: db.Allcode,
                                as: "provinceTypeData",
                                attributes: ["valueEn", "valueVi"],
                            },
                            {
                                model: db.Allcode,
                                as: "paymentTypeData",
                                attributes: ["valueEn", "valueVi"],
                            },
                        ]
                    },
                ],
                raw: false,
                nest: true,
            });
            if (infor && infor.image) {
                infor.image = Buffer.from(infor.image, 'base64').toString('binary');
            }
            if (!infor) { infor = {} }
            resolve({
                errCode: 0,
                data: infor,
            });
        } catch (error) {
            reject(error);
        }
    })
}
let bulkCreateScheduleService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.arrSchedule || !data.doctorId || !data.date) {
                return resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!"
                });
            }

            let schedule = data.arrSchedule;
            let formattedDate = moment(+data.date).startOf('day').format('DD/MM/YYYY');

            if (schedule && schedule.length > 0) {
                // Lấy thông tin maxNumber của bác sĩ từ bảng Doctor_infor
                let doctorInfor = await db.Doctor_infor.findOne({
                    where: { doctorId: data.doctorId },
                    attributes: ['count']
                });

                let customMaxNumber = (doctorInfor && doctorInfor.count) ? doctorInfor.count : MAX_NUMBER_SCHEDULE;

                schedule = schedule.map(item => {
                    item.maxNumber = customMaxNumber;
                    item.date = moment(+item.date).startOf('day').format('DD/MM/YYYY');
                    return item;
                });
            }
            let existing = await db.Schedule.findAll({
                where: { doctorId: data.doctorId, date: formattedDate },
                attributes: ['timeType', 'date', 'doctorId', 'maxNumber']
            });
            let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                return a.timeType === b.timeType && a.date === b.date;
            });
            if (toCreate && toCreate.length > 0) {
                await db.Schedule.bulkCreate(toCreate);
            }
            resolve({
                errCode: 0,
                errMessage: 'Save infor schedule successfully!',
                data: toCreate
            });

        } catch (error) {
            reject(error);
        }
    })
}

let getScheduleByDateService = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                return resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!"
                });
            } else {
                // let formattedDate = moment.unix(+date / 1000).format('DD/MM/YYYY');
                let queryDate = moment(+date).startOf('day').format('DD/MM/YYYY');
                console.log(">>> Check queryDate thực tế Node dùng để tìm:", queryDate);
                let dataSchedule = await db.Schedule.findAll({

                    where: {
                        doctorId: doctorId,
                        date: queryDate
                    },
                    include: [
                        {
                            model: db.Allcode,
                            as: "timeTypeData",
                            attributes: ["valueEn", "valueVi"],
                        },
                    ],
                    raw: false,
                    nest: true,
                });

                resolve({
                    errCode: 0,
                    data: dataSchedule ? dataSchedule : []
                });
            }
        } catch (error) {
            reject(error);
        }
    })
}
let getExtraDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!"
                })
            } else {
                let data = await db.Doctor_infor.findOne({
                    where: {
                        doctorId: inputId,
                    },
                    attributes: {
                        exclude: ["id", "doctorId"]
                    },
                    include: [
                        // 3. Sửa 'mode' thành 'model'
                        { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: false,
                    nest: true,
                })

                if (!data) data = {};


                resolve({
                    errCode: 0,
                    data: data
                });
            }
        } catch (error) {
            reject(error);
        }
    })
}
let getProfileDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!"
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: doctorId,
                    },
                    attributes: {
                        exclude: ["password"],
                    },
                    include: [
                        {
                            model: db.Markdown,
                            as: "markdownData",

                            attributes: ["description", "contentHTML", "contentMarkdown"]
                        },
                        {
                            model: db.Allcode,
                            as: "positionData",
                            attributes: ["valueEn", "valueVi"],
                        },
                        {
                            model: db.Doctor_infor,
                            as: "doctorinforData",
                            attributes: {
                                exclude: ["id", "doctorId"]
                            },
                            include: [
                                { model: db.Allcode, as: "priceTypeData", attributes: ["valueEn", "valueVi"] },
                                { model: db.Allcode, as: "provinceTypeData", attributes: ["valueEn", "valueVi"] },
                                { model: db.Allcode, as: "paymentTypeData", attributes: ["valueEn", "valueVi"] },
                            ]

                        },
                    ],
                    raw: false,
                    nest: true,
                })
                if (data && data.image) {
                    data.image = Buffer.from(data.image, 'base64').toString('binary');
                }
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
                });
            }
        } catch (error) {
            reject(error);
        }
    })
}
let getListPatientForDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                return resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!"
                });
            }

            // 1. Auto cleanup for missed and expired appointments
            let nowMillis = moment().valueOf();
            let todayStart = moment().startOf('day').valueOf();
            let fifteenMins = 15 * 60 * 1000;

            // Fetch all active bookings for this doctor to cleanup
            let allActive = await db.Booking.findAll({
                where: {
                    doctorId: doctorId,
                    statusId: { [Op.in]: ['S1', 'S2'] }
                },
                raw: false
            });

            for (let booking of allActive) {
                const createdAt = new Date(booking.createdAt).getTime();
                // Parse date from DD/MM/YYYY format if necessary
                const bookingDate = booking.date.includes('/') 
                    ? moment(booking.date, 'DD/MM/YYYY').valueOf()
                    : Number(booking.date);

                // A. Auto-cancel S1 (Unpaid) after 15 mins
                if (booking.statusId === 'S1' && (nowMillis - createdAt > fifteenMins)) {
                    booking.statusId = 'S4'; // Cancelled
                    await booking.save();
                    continue;
                }

                // B. Auto-mark S2 (Paid) as S5 (Missed) if date passed
                if (booking.statusId === 'S2' && (bookingDate < todayStart)) {
                    booking.statusId = 'S5'; // Missed
                    await booking.save();
                }
            }

            // 2. Format query date to DD/MM/YYYY to match DB format
            let queryDate = moment(+date).startOf('day').format('DD/MM/YYYY');

            // 3. Fetch all for the specified date
            let data = await db.Booking.findAll({
                where: { doctorId: doctorId, date: queryDate },
                include: [
                    {
                        model: db.User,
                        as: 'patientBookingData',
                        attributes: ['email', 'firstName', 'lastName', 'address', 'gender', 'phonenumber'],
                        include: [
                            { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                        ]
                    },
                    { model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueEn', 'valueVi'] }
                ],
                raw: false,
                nest: true
            });

            // 3. Custom Sort: S2 (priority 1) > S3 (priority 2) > S5 (priority 3) > S1 (priority 4) > S4 (priority 5)
            if (data && data.length > 0) {
                data.sort((a, b) => {
                    let priorities = { 'S2': 1, 'S3': 2, 'S5': 3, 'S1': 4, 'S4': 5 };
                    let pA = priorities[a.statusId] || 9;
                    let pB = priorities[b.statusId] || 9;
                    return pA - pB;
                });
            }

            resolve({
                errCode: 0,
                data: data
            })
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}

let updateBookingStatus = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctorId || !data.patientId || !data.timeType || !data.date || !data.statusId) {
                return resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!"
                })
            }
            let appointment = await db.Booking.findOne({
                where: {
                    doctorId: data.doctorId,
                    patientId: data.patientId,
                    timeType: data.timeType,
                    date: data.date
                },
                raw: false
            })

            if (appointment) {
                let oldStatus = appointment.statusId;
                appointment.statusId = data.statusId;
                await appointment.save();

                // If shifting to S3, send complete email
                if (data.statusId === 'S3' && oldStatus !== 'S3') {
                    if (data.email) {
                        try {
                            await emailService.sendRemedyEmail({
                                receiverEmail: data.email,
                                patientName: data.patientName || '',
                                time: data.time || '',
                                doctorName: data.doctorName || '',
                                clinicName: data.clinicName || 'BookingCare',
                                language: data.language || 'vi'
                            });
                        } catch (e) {
                            console.log("Email failed to send but booking updated: ", e);
                        }
                    }
                }

                resolve({
                    errCode: 0,
                    errMessage: "Update booking status successful!"
                })
            } else {
                resolve({
                    errCode: 2,
                    errMessage: "Appointment not found!"
                })
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}

export default {
    getTopDoctorHomeService: getTopDoctorHomeService,
    getAllDoctorsService: getAllDoctorsService,
    postInforDoctorService: postInforDoctorService,
    getDetailDoctorByIdService: getDetailDoctorByIdService,
    bulkCreateScheduleService: bulkCreateScheduleService,
    getScheduleByDateService: getScheduleByDateService,
    getExtraDoctorById: getExtraDoctorById,
    getProfileDoctorById: getProfileDoctorById,
    getListPatientForDoctor: getListPatientForDoctor,
    updateBookingStatus: updateBookingStatus
};