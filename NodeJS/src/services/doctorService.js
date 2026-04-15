import { raw } from "body-parser";
import db from "../../models/index"
require("dotenv").config();
import _ from "lodash";
import { Op } from 'sequelize';
import moment from 'moment'
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
                raw: true,
                nest: true,
            });
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
                    exclude: ["password", "image"],
                },
            });
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
                || !data.nameClinic || !data.addressClinic || !data.note || !data.specialtyId) {
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
                    specialtyId: data.specialtyId
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
            if (schedule && schedule.length > 0) {

                schedule = schedule.map(item => {
                    item.maxNumber = MAX_NUMBER_SCHEDULE;
                    return item;
                });
            }
            let existing = await db.Schedule.findAll({
                where: { doctorId: data.doctorId, date: data.date },
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
export default {
    getTopDoctorHomeService: getTopDoctorHomeService,
    getAllDoctorsService: getAllDoctorsService,
    postInforDoctorService: postInforDoctorService,
    getDetailDoctorByIdService: getDetailDoctorByIdService,
    bulkCreateScheduleService: bulkCreateScheduleService,
    getScheduleByDateService: getScheduleByDateService,
    getExtraDoctorById: getExtraDoctorById,
    getProfileDoctorById: getProfileDoctorById,
};