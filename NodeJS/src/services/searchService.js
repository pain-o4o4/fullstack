const { Op } = require('sequelize');
import db from "../../models/index";
import { parseImageFromDb } from "../utils/imageUtils";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Pinecone } from '@pinecone-database/pinecone';

const searchAll = async (keyword) => {
    try {
        const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
        const PINECONE_INDEX = process.env.PINECONE_INDEX || 'bookingcare-rag';
        const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

        // Xử lý image: trả về imageUrl (Cloudinary URL)
        const formatImage = (item) => {
            let itemData = item.dataValues || item;
            let imageUrl = null;
            if (itemData.image) {
                imageUrl = parseImageFromDb(itemData.image);
            }
            return {
                ...itemData,
                image: imageUrl
            }
        };

        // NẾU KHÔNG CÓ PINECONE KEY, FALLBACK VỀ SQL CŨ
        if (!PINECONE_API_KEY) {
            console.log(">>> [Search] Fallback to SQL LIKE search (No Pinecone API Key)");
            const [doctors, clinics, specialties, handbooks] = await Promise.all([
                db.User.findAll({
                    where: {
                        roleId: 'R2',
                        [Op.or]: [
                            { firstName: { [Op.like]: `%${keyword}%` } },
                            { lastName: { [Op.like]: `%${keyword}%` } },
                            db.sequelize.where(db.sequelize.fn('concat', db.sequelize.col('lastName'), ' ', db.sequelize.col('firstName')), 'LIKE', `%${keyword}%`)
                        ]
                    },
                    attributes: ['id', 'firstName', 'lastName', 'positionId', 'image'],
                    limit: 5
                }),
                db.Clinic.findAll({ where: { name: { [Op.like]: `%${keyword}%` } }, attributes: ['id', 'name', 'image'], limit: 5 }),
                db.Specialty.findAll({ where: { name: { [Op.like]: `%${keyword}%` } }, attributes: ['id', 'name', 'image'], limit: 5 }),
                db.Handbook.findAll({ where: { name: { [Op.like]: `%${keyword}%` } }, attributes: ['id', 'name', 'image'], limit: 5 })
            ]);
            return {
                errCode: 0,
                data: {
                    doctors: doctors.map(formatImage), clinics: clinics.map(formatImage),
                    specialties: specialties.map(formatImage), handbooks: handbooks.map(formatImage)
                }
            };
        }

        // --- BẮT ĐẦU RAG SEARCH ---
        console.log(">>> [RAG Search] Keyword:", keyword);
        const { pineconeIndex } = require('../config/pinecone');
        const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

        let queryVector;
        try {
            // 1. Tạo vector cho câu hỏi (keyword)
            const embedResult = await model.embedContent({
                content: { parts: [{ text: keyword }] },
                outputDimensionality: 768
            });
            queryVector = embedResult.embedding.values;
        } catch (embedError) {
            console.error(">>> [RAG Search] Lỗi tạo Embedding (có thể do hết Quota). Fallback về SQL LIKE. Lỗi:", embedError.message);
            // Fallback SQL Search
            const [doctors, clinics, specialties, handbooks] = await Promise.all([
                db.User.findAll({
                    where: {
                        roleId: 'R2',
                        [Op.or]: [
                            { firstName: { [Op.like]: `%${keyword}%` } },
                            { lastName: { [Op.like]: `%${keyword}%` } },
                            db.sequelize.where(db.sequelize.fn('concat', db.sequelize.col('lastName'), ' ', db.sequelize.col('firstName')), 'LIKE', `%${keyword}%`)
                        ]
                    },
                    attributes: ['id', 'firstName', 'lastName', 'positionId', 'image'],
                    limit: 5
                }),
                db.Clinic.findAll({ where: { name: { [Op.like]: `%${keyword}%` } }, attributes: ['id', 'name', 'image'], limit: 5 }),
                db.Specialty.findAll({ where: { name: { [Op.like]: `%${keyword}%` } }, attributes: ['id', 'name', 'image'], limit: 5 }),
                db.Handbook.findAll({ where: { name: { [Op.like]: `%${keyword}%` } }, attributes: ['id', 'name', 'image'], limit: 5 })
            ]);
            console.log(">>> [DEBUG Fallback] Keyword:", keyword, "=> Found specialties:", specialties.length);
            return {
                errCode: 0,
                data: {
                    doctors: doctors.map(formatImage), clinics: clinics.map(formatImage),
                    specialties: specialties.map(formatImage), handbooks: handbooks.map(formatImage)
                }
            };
        }

        // 2. Query Pinecone lấy top 10 kết quả gần nhất
        let queryResponse;
        try {
            queryResponse = await pineconeIndex.query({
                vector: queryVector,
                topK: 10,
                includeMetadata: true
            });
        } catch (pineconeError) {
            console.error(">>> [RAG Search] Lỗi query Pinecone:", pineconeError.message);
            return {
                errCode: 0,
                data: { doctors: [], clinics: [], specialties: [], handbooks: [] }
            };
        }

        // 3. Phân loại ID theo type
        const docIds = [];
        const clinicIds = [];
        const specIds = [];
        const hbIds = [];

        for (const match of queryResponse.matches) {
            // Lọc ra các kết quả có độ tương đồng đủ lớn (tuỳ chỉnh)
            if (match.score < 0.6) continue; // Bỏ qua nếu độ liên quan quá thấp

            const type = match.metadata.type;
            const dbId = match.metadata.dbId;

            if (type === 'doctor') docIds.push(dbId);
            else if (type === 'clinic') clinicIds.push(dbId);
            else if (type === 'specialty') specIds.push(dbId);
            else if (type === 'handbook') hbIds.push(dbId);
        }

        // 4. Lấy data từ MySQL dựa trên danh sách ID từ Pinecone
        const [doctors, clinics, specialties, handbooks] = await Promise.all([
            docIds.length > 0 ? db.User.findAll({
                where: { id: { [Op.in]: docIds }, roleId: 'R2' },
                attributes: ['id', 'firstName', 'lastName', 'positionId', 'image']
            }) : [],
            clinicIds.length > 0 ? db.Clinic.findAll({
                where: { id: { [Op.in]: clinicIds } },
                attributes: ['id', 'name', 'image']
            }) : [],
            specIds.length > 0 ? db.Specialty.findAll({
                where: { id: { [Op.in]: specIds } },
                attributes: ['id', 'name', 'image']
            }) : [],
            hbIds.length > 0 ? db.Handbook.findAll({
                where: { id: { [Op.in]: hbIds } },
                attributes: ['id', 'name', 'image']
            }) : []
        ]);

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
        console.error(">>> [Search] Lỗi:", e);
        return {
            errCode: -1,
            errMessage: 'Error from server'
        }
    }
};

export default { searchAll };
