import { raw } from "body-parser";
import db from "../../models/index"


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
                where: { roleID: "R2" },
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
            // 1. Check xem có thiếu cái gì quan trọng không
            if (!data.doctorId || !data.contentHTML || !data.contentMarkdown) {
                return resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!"
                });
            }

            // 2. Tìm xem ông bác sĩ này đã có bài giới thiệu chưa
            let doctorMarkdown = await db.Markdown.findOne({
                where: { doctorId: data.doctorId },
                raw: false // Phải để false để dùng được hàm .save()
            });

            if (doctorMarkdown) {
                // NẾU CÓ RỒI -> CẬP NHẬT (EDIT)
                doctorMarkdown.contentHTML = data.contentHTML;
                doctorMarkdown.contentMarkdown = data.contentMarkdown;
                doctorMarkdown.description = data.description;
                await doctorMarkdown.save();
            } else {
                // NẾU CHƯA CÓ -> TẠO MỚI (CREATE)
                await db.Markdown.create({
                    contentHTML: data.contentHTML,
                    contentMarkdown: data.contentMarkdown,
                    description: data.description,
                    doctorId: data.doctorId,
                });
            }

            resolve({
                errCode: 0,
                errMessage: "Save info doctor successfully!"
            });
        } catch (error) {
            // Log lỗi thật sự ra đây để soi cho dễ
            console.log('>>> LỖI SQL CHI TIẾT TẠI ĐÂY:', error);
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
                        as: "markdownData", // Thêm as vào đây cho khớp với associate
                        attributes: ["description", "contentHTML", "contentMarkdown"],
                    },
                ],
                raw: false,
                nest: true,
            });
            if (infor && infor.image) {
                // Dùng Buffer.from thay cho new Buffer
                infor.image = Buffer.from(infor.image, 'base64').toString('binary');
            }
            resolve({
                errCode: 0,
                data: infor,
            });
        } catch (error) {
            reject(error);
        }
    })
}
export default {
    getTopDoctorHomeService: getTopDoctorHomeService,
    getAllDoctorsService: getAllDoctorsService,
    postInforDoctorService: postInforDoctorService,
    getDetailDoctorByIdService: getDetailDoctorByIdService
};