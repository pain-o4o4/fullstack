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

        const generateEmbeddingsBatchWithRetry = async (texts, maxRetries = 5, delayMs = 6000) => {
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    const response = await currentModel.batchEmbedContents({
                        requests: texts.map(t => ({
                            content: { parts: [{ text: t }] },
                            outputDimensionality: 768
                        }))
                    });
                    return response.embeddings.map(e => e.values);
                } catch (error) {
                    const isRateLimit = error.status === 429 || error.message?.includes('429') || error.message?.includes('Quota exceeded');
                    if (isRateLimit && attempt < maxRetries) {
                        console.warn(`>>> [RAG] Đụng trần Google API Rate Limit. Đang tự động thử lại lần ${attempt}/${maxRetries} sau ${delayMs / 1000} giây...`);
                        await sleep(delayMs);
                        delayMs = delayMs * 1.5;
                        continue;
                    }
                    throw error;
                }
            }
        };

        const registry = await loadRegistryFromDB();
        const Op = db.Sequelize.Op;
        const batchSize = 20;

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
        
        for (let i = 0; i < doctors.length; i += batchSize) {
            const currentBatchDocs = doctors.slice(i, i + batchSize);
            const texts = currentBatchDocs.map(doc => {
                const title = doc.positionData?.valueVi || "Bác sĩ";
                const name = `${doc.lastName} ${doc.firstName}`;
                const desc = doc.markdownData?.description || "";
                return `Đây là thông tin Bác sĩ. Chức danh: ${title}. Tên: ${name}. Thông tin chuyên môn/Mô tả: ${desc}`;
            });

            await sleep(4000); // Giữ RPM an toàn dưới 15 RPM
            
            try {
                const embeddings = await generateEmbeddingsBatchWithRetry(texts);
                
                const records = currentBatchDocs.map((doc, index) => {
                    const name = `${doc.lastName} ${doc.firstName}`;
                    const desc = doc.markdownData?.description || "";
                    return {
                        id: `doctor_${doc.id}`,
                        values: embeddings[index],
                        metadata: {
                            type: 'doctor',
                            dbId: doc.id,
                            name: name,
                            description: desc
                        }
                    };
                });

                await pineconeIndex.upsert({ records });
                await saveBatchToDB('doctor', currentBatchDocs.map(doc => doc.id));
                console.log(`>>> [RAG] Đã đẩy thành công ${records.length} bác sĩ lên Pinecone. (${i + records.length}/${doctors.length})`);
            } catch (err) {
                console.error(`>>> [RAG] Lỗi đồng bộ batch bác sĩ từ index ${i}:`, err.message);
                throw err;
            }
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

        for (let i = 0; i < specialties.length; i += batchSize) {
            const currentBatchSpecs = specialties.slice(i, i + batchSize);
            const texts = currentBatchSpecs.map(spec => 
                `Đây là thông tin Chuyên khoa y tế. Tên chuyên khoa: ${spec.name}. Mô tả chuyên khoa: ${spec.descriptionHTML || ''}`
            );

            await sleep(4000);
            
            try {
                const embeddings = await generateEmbeddingsBatchWithRetry(texts);
                
                const records = currentBatchSpecs.map((spec, index) => ({
                    id: `specialty_${spec.id}`,
                    values: embeddings[index],
                    metadata: {
                        type: 'specialty',
                        dbId: spec.id,
                        name: spec.name
                    }
                }));

                await pineconeIndex.upsert({ records });
                await saveBatchToDB('specialty', currentBatchSpecs.map(spec => spec.id));
                console.log(`>>> [RAG] Đã đẩy thành công ${records.length} chuyên khoa lên Pinecone. (${i + records.length}/${specialties.length})`);
            } catch (err) {
                console.error(`>>> [RAG] Lỗi đồng bộ batch chuyên khoa từ index ${i}:`, err.message);
                throw err;
            }
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

        for (let i = 0; i < clinics.length; i += batchSize) {
            const currentBatchClinics = clinics.slice(i, i + batchSize);
            const texts = currentBatchClinics.map(clinic => 
                `Đây là thông tin Cơ sở y tế / Bệnh viện / Phòng khám. Tên cơ sở: ${clinic.name}. Địa chỉ: ${clinic.address}. Mô tả: ${clinic.descriptionHTML || ''}`
            );

            await sleep(4000);
            
            try {
                const embeddings = await generateEmbeddingsBatchWithRetry(texts);
                
                const records = currentBatchClinics.map((clinic, index) => ({
                    id: `clinic_${clinic.id}`,
                    values: embeddings[index],
                    metadata: {
                        type: 'clinic',
                        dbId: clinic.id,
                        name: clinic.name
                    }
                }));

                await pineconeIndex.upsert({ records });
                await saveBatchToDB('clinic', currentBatchClinics.map(clinic => clinic.id));
                console.log(`>>> [RAG] Đã đẩy thành công ${records.length} phòng khám lên Pinecone. (${i + records.length}/${clinics.length})`);
            } catch (err) {
                console.error(`>>> [RAG] Lỗi đồng bộ batch phòng khám từ index ${i}:`, err.message);
                throw err;
            }
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

        for (let i = 0; i < handbooks.length; i += batchSize) {
            const currentBatchHandbooks = handbooks.slice(i, i + batchSize);
            const texts = currentBatchHandbooks.map(handbook => 
                `Đây là thông tin Bài viết Cẩm nang y khoa. Tiêu đề bài viết: ${handbook.name}. Mô tả/Nội dung: ${handbook.descriptionHTML || ''}`
            );

            await sleep(4000);
            
            try {
                const embeddings = await generateEmbeddingsBatchWithRetry(texts);
                
                const records = currentBatchHandbooks.map((handbook, index) => ({
                    id: `handbook_${handbook.id}`,
                    values: embeddings[index],
                    metadata: {
                        type: 'handbook',
                        dbId: handbook.id,
                        name: handbook.name
                    }
                }));

                await pineconeIndex.upsert({ records });
                await saveBatchToDB('handbook', currentBatchHandbooks.map(handbook => handbook.id));
                console.log(`>>> [RAG] Đã đẩy thành công ${records.length} cẩm nang lên Pinecone. (${i + records.length}/${handbooks.length})`);
            } catch (err) {
                console.error(`>>> [RAG] Lỗi đồng bộ batch cẩm nang từ index ${i}:`, err.message);
                throw err;
            }
        }

        console.log(">>> [RAG] Hoàn tất đồng bộ toàn bộ cơ sở dữ liệu!");
        return { errCode: 0, errMessage: 'Sync fully successful' };

    } catch (e) {
        console.error(">>> [RAG] Lỗi trong quá trình đồng bộ lũy tiến:", e);
        return { errCode: -1, errMessage: e.message || 'Error during sync' };
    }
}

export default { syncAllToPinecone };
