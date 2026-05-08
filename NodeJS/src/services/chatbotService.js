import db from "../../models/index";
import { GoogleGenerativeAI } from "@google/generative-ai";
require('dotenv').config();

const saveMessage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.userId || !data.sessionId || !data.role || !data.content) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                });
            } else {
                await db.Chatbot.create({
                    userId: data.userId,
                    sessionId: data.sessionId,
                    role: data.role,
                    content: data.content
                });
                resolve({
                    errCode: 0,
                    errMessage: 'Message saved'
                });
            }
        } catch (e) {
            console.log(e);
            resolve({
                errCode: -1,
                errMessage: 'Error from service saveMessage: ' + e.message
            });
        }
    });
};

const getChatSessions = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                });
            } else {
                let sessions = await db.Chatbot.findAll({
                    where: { userId: userId },
                    attributes: ['sessionId', 'createdAt', 'content'],
                    order: [['createdAt', 'DESC']],
                });

                const uniqueSessions = [];
                const seen = new Set();
                for (const s of sessions) {
                    if (!seen.has(s.sessionId)) {
                        seen.add(s.sessionId);
                        uniqueSessions.push({
                            sessionId: s.sessionId,
                            lastMessage: s.content,
                            createdAt: s.createdAt
                        });
                    }
                }

                resolve({
                    errCode: 0,
                    data: uniqueSessions
                });
            }
        } catch (e) {
            console.log(e);
            resolve({
                errCode: -1,
                errMessage: 'Error from service: ' + e.message
            });
        }
    });
};

const getChatHistory = (userId, sessionId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId || !sessionId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                });
            } else {
                let history = await db.Chatbot.findAll({
                    where: { userId: userId, sessionId: sessionId },
                    order: [['createdAt', 'ASC']]
                });
                resolve({
                    errCode: 0,
                    data: history
                });
            }
        } catch (e) {
            console.log(e);
            resolve({
                errCode: -1,
                errMessage: 'Error from service: ' + e.message
            });
        }
    });
};

const handleChatWithAI = async (userQuery, language, history = [], io = null, userId = null, sessionId = null) => {
    let retries = 3;
    let delay = 2000;

    for (let i = 0; i < retries; i++) {
        try {
            const API_KEY = process.env.GOOGLE_API_KEY;
            if (!API_KEY) return language === 'en' ? "System configuration error." : "Lỗi cấu hình hệ thống.";

            const genAI = new GoogleGenerativeAI(API_KEY);
            const modelName = process.env.GOOGLE_MODEL_NAME || "gemini-1.5-flash";
            const model = genAI.getGenerativeModel({ model: modelName });

            const systemLang = language === 'en' ? 'Tiếng Anh (English)' : 'Tiếng Việt (Vietnamese)';

            const chatHistory = history.map(item => ({
                role: item.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: item.content }],
            }));

            const chat = model.startChat({
                history: chatHistory,
                generationConfig: {
                    maxOutputTokens: 1000,
                },
            });

            const systemPrompt = `
                Bạn là Trợ lý chuyên gia của Hệ thống BookingCare. 
                Bạn đang hỗ trợ người dùng trên nền tảng đặt lịch khám bệnh trực tuyến mà chúng tôi đã phát triển.

                Ngữ cảnh hệ thống:
                Vai trò: Điều phối viên y tế ảo, hỗ trợ người dùng tìm kiếm thông tin phòng khám, 
                bác sĩ và cẩm nang sức khỏe (Handbooks).
                Ngôn ngữ phản hồi: ${systemLang} (Luôn ưu tiên ngôn ngữ này để phản hồi).
                Cơ sở dữ liệu: Dựa vào các thông tin chuyên khoa, handbook và dữ liệu 
                bác sĩ trên hệ thống để đưa ra chỉ dẫn.

                Nhiệm vụ cụ thể:
                Tiếp nhận câu hỏi của người dùng và phân tích triệu chứng để gợi ý đúng chuyên khoa.
                Hướng dẫn người dùng các bước đặt lịch hoặc xem bài viết cẩm nang liên quan.
                Phong cách giao tiếp: Chuyên nghiệp, tối giản, ngôn từ lịch sự và đáng tin cậy.
                Lưu ý kỹ thuật: Luôn nhắc nhở người dùng rằng thông tin này hỗ trợ việc đặt lịch,
                không thay thế hoàn toàn chẩn đoán lâm sàng từ bác sĩ.
                
                HƯỚNG DẪN QUAN TRỌNG:
                1. Hãy tự nhận diện ngôn ngữ mà người dùng đang sử dụng.
                2. Phản hồi bằng chính ngôn ngữ đó.
                3. Nội dung trả lời phải lịch sự, ngắn gọn và luôn khuyên bệnh nhân đi khám bác sĩ.
            `;

            const finalQuery = history.length === 0 ? `${systemPrompt}\n\nUser: ${userQuery}` : userQuery;

            if (io && userId) {
                io.to(`user_room_${userId}`).emit('ai_typing_start', { sessionId });

                const result = await chat.sendMessageStream(finalQuery);
                let fullResponseText = '';

                for await (const chunk of result.stream) {
                    const chunkText = chunk.text();
                    fullResponseText += chunkText;

                    io.to(`user_room_${userId}`).emit('ai_response_chunk', {
                        sessionId,
                        chunk: chunkText,
                        isDone: false
                    });
                }

                io.to(`user_room_${userId}`).emit('ai_response_chunk', {
                    sessionId,
                    chunk: '',
                    isDone: true
                });

                return fullResponseText;
            } else {
                const result = await chat.sendMessage(finalQuery);
                const response = await result.response;
                return response.text();
            }

        } catch (error) {
            console.error(`>>> Lỗi Gemini (Lần ${i + 1}):`, error.message);

            if (error.message.includes("503") && i < retries - 1) {
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }

            return "Lỗi từ Gemini: " + error.message;
        }
    }
}

export default {
    saveMessage,
    getChatSessions,
    getChatHistory,
    handleChatWithAI
};
