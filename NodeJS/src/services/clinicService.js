import { raw } from "body-parser";
import db from "../../models/index"
require("dotenv").config();
import _ from "lodash";
import { Op, where } from 'sequelize';
import moment from 'moment'
import emailService from "./emailService";
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE
import { v4 as uuidv4 } from 'uuid';



let postCreateNewClinicService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            }
            else {
                await db.Clinic.create({
                    name: data.name,
                    address: data.address,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                });
                resolve({
                    errCode: 0,
                    errMessage: 'Save clinic success!'
                });
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getAllClinicService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll({ raw: true });
            if (data && data.length > 0) {
                data = data.map((item) => {
                    if (item.image) {

                        item.image = Buffer.from(item.image, 'base64').toString('binary');
                    }
                    return item;
                });
            }
            resolve({
                errCode: 0,
                data: data
            })
        } catch (error) {
            reject(error)
        }
    })
}
let getDetailClinicByIdService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            }
            else {
                let data = await db.Clinic.findOne({
                    where: { id: id },
                    include: [
                        {
                            model: db.Doctor_infor, // Check lại chữ I hoa/thường ở đây
                            as: 'doctorClinic',    // Phải khớp với as ở clinic.js
                            attributes: ['doctorId', 'provinceId']
                        },
                    ],
                    raw: false,
                    nest: true
                });
                if (data && data.image) {
                    data.image = Buffer.from(data.image, 'base64').toString('binary');
                }
                resolve({
                    errCode: 0,
                    data: data
                });
            }
        } catch (error) {
            reject(error)
        }
    })
}
let deleteClinicService = (clinicId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let clinic = await db.Clinic.findOne({
                where: { id: clinicId }
            });
            if (!clinic) {
                resolve({
                    errCode: 2,
                    errMessage: "The clinic doesn't exist"
                })
            } else {
                await db.Clinic.destroy({
                    where: { id: clinicId }
                });
                resolve({
                    errCode: 0,
                    errMessage: 'The clinic is deleted'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let editClinicService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.name || !data.address || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!"
                })
            } else {
                let clinic = await db.Clinic.findOne({
                    where: { id: data.id },
                    raw: false
                });

                if (clinic) {
                    clinic.name = data.name;
                    clinic.address = data.address;
                    clinic.descriptionHTML = data.descriptionHTML;
                    clinic.descriptionMarkdown = data.descriptionMarkdown;

                    if (data.imageBase64) {
                        clinic.image = data.imageBase64;
                    }

                    await clinic.save();
                    resolve({
                        errCode: 0,
                        errMessage: "Update the clinic succeeds!"
                    });
                } else {
                    resolve({
                        errCode: 1,
                        errMessage: "Clinic not found!"
                    });
                }
            }
        } catch (error) {
            reject(error);
        }
    })
}

export default {
    getAllClinicService,
    postCreateNewClinicService,
    getDetailClinicByIdService,
    deleteClinicService,
    editClinicService
}