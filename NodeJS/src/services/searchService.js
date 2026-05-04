const { Op } = require('sequelize');
import db from "../../models/index";

const searchAll = async (keyword) => {
    try {
        // Chạy 4 query SONG SONG thay vì tuần tự
        const [doctors, clinics, specialties, handbooks] = await Promise.all([
            db.User.findAll({
                where: {
                    roleId: 'R2', // Chỉ tìm trong Bác sĩ
                    [Op.or]: [
                        { firstName: { [Op.like]: `%${keyword}%` } },
                        { lastName: { [Op.like]: `%${keyword}%` } }
                    ]
                },
                attributes: ['id', 'firstName', 'lastName', 'positionId', 'image'],
                limit: 5
            }),
            db.Clinic.findAll({
                where: { name: { [Op.like]: `%${keyword}%` } },
                attributes: ['id', 'name', 'image'],
                limit: 5
            }),
            db.Specialty.findAll({
                where: { name: { [Op.like]: `%${keyword}%` } },
                attributes: ['id', 'name', 'image'],
                limit: 5
            }),
            db.Handbook.findAll({
                where: { name: { [Op.like]: `%${keyword}%` } },
                attributes: ['id', 'name', 'image'],
                limit: 5
            })
        ]);

        // Xử lý image: trả về imageUrl thay vì raw Buffer/Base64
        const formatImage = (item) => {
            let itemData = item.dataValues || item;
            let imageBase64 = null;
            if (itemData.image) {
                imageBase64 = Buffer.from(itemData.image, 'base64').toString('binary');
            }
            return {
                ...itemData,
                image: imageBase64
                // TODO: migrate image path to URL (CDN) thay vì BLOB
            }
        };

        return {
            errCode: 0,
            data: {
                doctors: doctors.map(formatImage),
                clinics: clinics.map(formatImage),
                specialties: specialties.map(formatImage),
                handbooks: handbooks.map(formatImage)
            }
        };
    } catch (e) {
        console.log(e);
        return {
            errCode: -1,
            errMessage: 'Error from server'
        }
    }
};

export default { searchAll };
