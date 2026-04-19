import { raw } from "body-parser";
import db from "../../models/index"
require("dotenv").config();
import _ from "lodash";
import { Op, where } from 'sequelize';
import moment from 'moment'
import emailService from "./emailService";
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE
import { v4 as uuidv4 } from 'uuid';

let postCreateNewSpecialtyService = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            }
            else {
                await db.Specialty.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                });

                resolve({
                    errCode: 0,
                    errMessage: 'Save specialty success!'
                });
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getAllSpecialtyService = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll({
                attributes: ['id', 'name', 'image', 'descriptionHTML', 'descriptionMarkdown']
            });

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
                errMessage: 'OK',
                data: data
            });
        } catch (error) {
            console.log("Check error from service: ", error);
            reject(error);
        }
    });
};
let getSpecialtyByIdService = async (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!"
                })
            } else {
                let data = await db.Specialty.findOne({
                    where: { id: inputId },
                    // Include phải nằm ngoài where Duy nhé
                    include: [
                        {
                            model: db.Doctor_infor,
                            as: 'doctorSpecialty',
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
                    errMessage: 'OK',
                    data: data
                });
            }
        } catch (error) {
            console.log("Check error from service: ", error);
            reject(error);
        }
    })
}

let deleteSpecialtyService = (specialtyId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let specialty = await db.Specialty.findOne({
                where: { id: specialtyId }
            });
            if (!specialty) {
                resolve({
                    errCode: 2,
                    errMessage: "The specialty isn't exist"
                })
            } else {
                await db.Specialty.destroy({
                    where: { id: specialtyId }
                });
                resolve({
                    errCode: 0,
                    errMessage: 'The specialty is deleted'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let editSpecialtyService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.name || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!"
                })
            } else {
                let specialty = await db.Specialty.findOne({
                    where: { id: data.id },
                    raw: false
                });

                if (specialty) {
                    specialty.name = data.name;
                    specialty.descriptionHTML = data.descriptionHTML;
                    specialty.descriptionMarkdown = data.descriptionMarkdown;

                    if (data.imageBase64) {
                        specialty.image = data.imageBase64;
                    }

                    await specialty.save();
                    resolve({
                        errCode: 0,
                        errMessage: "Update the specialty succeeds!"
                    });
                } else {
                    resolve({
                        errCode: 1,
                        errMessage: "Specialty not found!"
                    });
                }
            }
        } catch (error) {
            reject(error);
        }
    })
}
export default {
    postCreateNewSpecialtyService,
    getAllSpecialtyService,
    getSpecialtyByIdService,
    deleteSpecialtyService,
    editSpecialtyService
}