import db from "../../models/index";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Pinecone } from '@pinecone-database/pinecone';

const loadRegistryFromDB = async () => {
    let registry = {
        doctors: [],
        specialties: [],
        clinics: [],
        handbooks: []
    };
    try {
        const states = await db.RagSyncState.findAll({ raw: true });
        states.forEach(state => {
            if (state.entityType === 'doctor') registry.doctors.push(state.entityId);
            if (state.entityType === 'specialty') registry.specialties.push(state.entityId);
            if (state.entityType === 'clinic') registry.clinics.push(state.entityId);
            if (state.entityType === 'handbook') registry.handbooks.push(state.entityId);
        });
    } catch (e) {
        console.error(">>> [RAG] Lỗi đọc state từ Database:", e);
    }
    return registry;
};

const saveBatchToDB = async (type, dbIds) => {
    try {
        const records = dbIds.map(id => ({ entityType: type, entityId: id }));
        await db.RagSyncState.bulkCreate(records, { ignoreDuplicates: true });
    } catch (e) {
        console.error(`>>> [RAG] Lỗi lưu state vào DB cho ${type}:`, e);
    }
};

const syncAllToPinecone = async () => {
    try {
        console.log(">>> [RAG] Bắt đầu đồng bộ dữ liệu lũy tiến lên Pinecone...");

        const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
        const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

        if (!PINECONE_API_KEY || !GOOGLE_API_KEY) {
            console.log(">>> [RAG] Lỗi: Thiếu API Key trong .env (Cần GOOGLE_API_KEY và PINECONE_API_KEY)");
            return { errCode: 1, errMessage: 'Missing API Keys' };
        }

        const { pineconeIndex } = require('../config/pinecone');
        const sleep = ms => new Promise(r => setTimeout(r, ms));
        
        const currentModel = new GoogleGenerativeAI(GOOGLE_API_KEY).getGenerativeModel({ model: "gemini-embedding-001" });

        const generateEmbedding = async (text) => {
            const result = await currentModel.embedContent({
                content: { parts: [{ text: text }] },
                outputDimensionality: 768
            });
            return result.embedding.values;
        };

        const registry = await loadRegistryFromDB();
        const Op = db.Sequelize.Op;

        // 1. Đồng bộ BÁC SĨ (Chưa được sync)
        console.log(">>> [RAG] Đang tải danh sách bác sĩ chưa đồng bộ...");
        let doctors = await db.User.findAll({
            where: {
                roleId: 'R2',
                id: { [Op.notIn]: registry.doctors.length > 0 ? registry.doctors : [0] }
            },
            include: [
                { model: db.Markdown, as: "markdownData", attributes: ["description"] },
                { model: db.Allcode, as: "positionData", attributes: ["valueVi"] }
            ],
            raw: false,
            nest: true
        });

        console.log(`>>> [RAG] Tìm thấy ${doctors.length} bác sĩ cần đồng bộ.`);
        
        let batch = [];
        const batchSize = 10;

        for (let doc of doctors) {
            const title = doc.positionData?.valueVi || "Bác sĩ";
            const name = `${doc.lastName} ${doc.firstName}`;
            const desc = doc.markdownData?.description || "";
            const textToEmbed = `Đây là thông tin Bác sĩ. Chức danh: ${title}. Tên: ${name}. Thông tin chuyên môn/Mô tả: ${desc}`;

            await sleep(1000); // Tránh bị Google khóa rate limit (RPM)
            const embedding = await generateEmbedding(textToEmbed);

            batch.push({
                id: `doctor_${doc.id}`,
                values: embedding,
                metadata: {
                    type: 'doctor',
                    dbId: doc.id,
                    name: name,
                    description: desc
                }
            });

            if (batch.length >= batchSize) {
                await pineconeIndex.upsert({ records: batch });
                await saveBatchToDB('doctor', batch.map(item => item.metadata.dbId));
                console.log(`>>> [RAG] Đã đẩy thành công ${batch.length} bác sĩ lên Pinecone.`);
                batch = [];
            }
        }
        if (batch.length > 0) {
            await pineconeIndex.upsert({ records: batch });
            await saveBatchToDB('doctor', batch.map(item => item.metadata.dbId));
            console.log(`>>> [RAG] Đã đẩy thành công ${batch.length} bác sĩ cuối cùng lên Pinecone.`);
            batch = [];
        }

        // 2. Đồng bộ CHUYÊN KHOA
        console.log(">>> [RAG] Đang tải danh sách chuyên khoa chưa đồng bộ...");
        let specialties = await db.Specialty.findAll({
            where: {
                id: { [Op.notIn]: registry.specialties.length > 0 ? registry.specialties : [0] }
            },
            raw: true
        });
        console.log(`>>> [RAG] Tìm thấy ${specialties.length} chuyên khoa cần đồng bộ.`);

        for (let spec of specialties) {
            const textToEmbed = `Đây là thông tin Chuyên khoa y tế. Tên chuyên khoa: ${spec.name}. Mô tả chuyên khoa: ${spec.descriptionHTML || ''}`;
            
            await sleep(1000);
            const embedding = await generateEmbedding(textToEmbed);
            
            batch.push({
                id: `specialty_${spec.id}`,
                values: embedding,
                metadata: {
                    type: 'specialty',
                    dbId: spec.id,
                    name: spec.name
                }
            });

            if (batch.length >= batchSize) {
                await pineconeIndex.upsert({ records: batch });
                await saveBatchToDB('specialty', batch.map(item => item.metadata.dbId));
                console.log(`>>> [RAG] Đã đẩy thành công ${batch.length} chuyên khoa lên Pinecone.`);
                batch = [];
            }
        }
        if (batch.length > 0) {
            await pineconeIndex.upsert({ records: batch });
            await saveBatchToDB('specialty', batch.map(item => item.metadata.dbId));
            console.log(`>>> [RAG] Đã đẩy thành công ${batch.length} chuyên khoa cuối cùng lên Pinecone.`);
            batch = [];
        }

        // 3. Đồng bộ PHÒNG KHÁM
        console.log(">>> [RAG] Đang tải danh sách phòng khám chưa đồng bộ...");
        let clinics = await db.Clinic.findAll({
            where: {
                id: { [Op.notIn]: registry.clinics.length > 0 ? registry.clinics : [0] }
            },
            raw: true
        });
        console.log(`>>> [RAG] Tìm thấy ${clinics.length} phòng khám cần đồng bộ.`);

        for (let clinic of clinics) {
            const textToEmbed = `Đây là thông tin Cơ sở y tế / Bệnh viện / Phòng khám. Tên cơ sở: ${clinic.name}. Địa chỉ: ${clinic.address}. Mô tả: ${clinic.descriptionHTML || ''}`;
            
            await sleep(1000);
            const embedding = await generateEmbedding(textToEmbed);
            
            batch.push({
                id: `clinic_${clinic.id}`,
                values: embedding,
                metadata: {
                    type: 'clinic',
                    dbId: clinic.id,
                    name: clinic.name
                }
            });

            if (batch.length >= batchSize) {
                await pineconeIndex.upsert({ records: batch });
                await saveBatchToDB('clinic', batch.map(item => item.metadata.dbId));
                console.log(`>>> [RAG] Đã đẩy thành công ${batch.length} phòng khám lên Pinecone.`);
                batch = [];
            }
        }
        if (batch.length > 0) {
            await pineconeIndex.upsert({ records: batch });
            await saveBatchToDB('clinic', batch.map(item => item.metadata.dbId));
            console.log(`>>> [RAG] Đã đẩy thành công ${batch.length} phòng khám cuối cùng lên Pinecone.`);
            batch = [];
        }

        // 4. Đồng bộ CẨM NANG
        console.log(">>> [RAG] Đang tải danh sách cẩm nang chưa đồng bộ...");
        let handbooks = await db.Handbook.findAll({
            where: {
                id: { [Op.notIn]: registry.handbooks.length > 0 ? registry.handbooks : [0] }
            },
            raw: true
        });
        console.log(`>>> [RAG] Tìm thấy ${handbooks.length} cẩm nang cần đồng bộ.`);

        for (let handbook of handbooks) {
            const textToEmbed = `Đây là thông tin Bài viết Cẩm nang y khoa. Tiêu đề bài viết: ${handbook.name}. Mô tả/Nội dung: ${handbook.descriptionHTML || ''}`;
            
            await sleep(1000);
            const embedding = await generateEmbedding(textToEmbed);
            
            batch.push({
                id: `handbook_${handbook.id}`,
                values: embedding,
                metadata: {
                    type: 'handbook',
                    dbId: handbook.id,
                    name: handbook.name
                }
            });

            if (batch.length >= batchSize) {
                await pineconeIndex.upsert({ records: batch });
                await saveBatchToDB('handbook', batch.map(item => item.metadata.dbId));
                console.log(`>>> [RAG] Đã đẩy thành công ${batch.length} cẩm nang lên Pinecone.`);
                batch = [];
            }
        }
        if (batch.length > 0) {
            await pineconeIndex.upsert({ records: batch });
            await saveBatchToDB('handbook', batch.map(item => item.metadata.dbId));
            console.log(`>>> [RAG] Đã đẩy thành công ${batch.length} cẩm nang cuối cùng lên Pinecone.`);
            batch = [];
        }

        console.log(">>> [RAG] Hoàn tất đồng bộ toàn bộ cơ sở dữ liệu!");
        return { errCode: 0, errMessage: 'Sync fully successful' };

    } catch (e) {
        console.error(">>> [RAG] Lỗi trong quá trình đồng bộ lũy tiến:", e);
        return { errCode: -1, errMessage: e.message || 'Error during sync' };
    }
}

export default { syncAllToPinecone };
