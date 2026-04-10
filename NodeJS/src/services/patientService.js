import { raw } from "body-parser";
import db from "../../models/index"
require("dotenv").config();
import _ from "lodash";
import { Op, where } from 'sequelize';
import moment from 'moment'
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE



let postBookAppointmentService = async (infor) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!infor.email || !infor.doctorId || !infor.date || !infor.timeType) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!"
                })
            } else {
                let user = await db.User.findOrCreate({
                    where: { email: infor.email },
                    defaults: {
                        email: infor.email,
                        roleID: 'R3',
                        gender: infor.gender,
                        address: infor.address
                    }
                })
                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        // 1. Điều kiện để check trùng: 
                        // Thường là check cùng bệnh nhân, cùng ngày, cùng khung giờ để tránh đặt trùng
                        where: {
                            patientId: user[0].id,
                            date: infor.date,
                            timeType: infor.timeType
                        },

                        // 2. Dữ liệu thêm mới nếu không tìm thấy bản ghi thỏa mãn 'where'
                        defaults: {
                            statusId: 'S1',
                            doctorId: infor.doctorId,
                            patientId: user[0].id,
                            date: infor.date,
                            timeType: infor.timeType
                        }
                    });
                }
                resolve({
                    errCode: 0,
                    errMessage: "OK",
                    user: user
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}
export default {
    postBookAppointmentService,
}