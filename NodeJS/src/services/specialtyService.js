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
                    errMessage: 'Save specialty thành công!'
                });
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getAllSpecialtyService = async () => {
    return new promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll({
                attributes: ['id', 'descriptionHTML', 'descriptionMarkdown', 'image', 'name']
            })
            if (data && data.length > 0) {
                data.map((item) => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                })
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
export default {
    postCreateNewSpecialtyService,
    getAllSpecialtyService
}