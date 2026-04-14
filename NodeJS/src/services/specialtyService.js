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
                // Thêm 'id' vào để Frontend có key khi render list (quan trọng)
                attributes: ['id', 'name', 'image', 'descriptionHTML', 'descriptionMarkdown']
            });

            if (data && data.length > 0) {
                data = data.map((item) => {
                    if (item.image) {
                        // Sử dụng Buffer.from thay vì new Buffer (đã bị deprecated)
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
export default {
    postCreateNewSpecialtyService,
    getAllSpecialtyService
}