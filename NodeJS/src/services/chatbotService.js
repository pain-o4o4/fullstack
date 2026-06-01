import db from "../../models/index";
import { GoogleGenerativeAI } from "@google/generative-ai";
import searchService from "./searchService";
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
                    content: data.content,
                    deletedByUser: false
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
                    where: {
                        userId: userId,
                        deletedByUser: false
                    },
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
                    where: {
                        userId: userId,
                        sessionId: sessionId,
                        deletedByUser: false
                    },
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
            console.log(">>> [DEBUG] CHATBOT IS USING API KEY:", API_KEY ? API_KEY.substring(0, 10) + "..." : "NULL");
            if (!API_KEY) return language === 'en' ? "System configuration error." : "Lỗi cấu hình hệ thống.";
            const genAI = new GoogleGenerativeAI(API_KEY);
            // Dùng gemini-2.5-flash
            const modelName = "gemini-2.5-flash";
            const tools = [
                {
                    functionDeclarations: [
                        {
                            name: "search_bookingcare_system",
                            description: "Tìm kiếm thông tin Bác sĩ, Phòng khám, Chuyên khoa và Cẩm nang y tế trong hệ thống BookingCare.",
                            parameters: {
                                type: "OBJECT",
                                properties: {
                                    keyword: {
                                        type: "STRING",
                                        description: "Câu hỏi hoặc triệu chứng của người dùng (Ví dụ: 'Tôi hay bị đau đầu chóng mặt', 'Khám dạ dày ở đâu tốt', 'Bác sĩ Thần kinh'). Hỗ trợ tìm kiếm theo ngữ nghĩa (Semantic Search/RAG).",
                                    },
                                },
                                required: ["keyword"],
                            },
                        }
                    ],
                },
            ];

            const systemLang = language === 'en' ? 'Tiếng Anh (English)' : 'Tiếng Việt (Vietnamese)';

            const systemPrompt = `
                Bạn là Trợ lý chuyên gia của Hệ thống BookingCare. 
                Bạn đang hỗ trợ người dùng trên nền tảng đặt lịch khám bệnh trực tuyến mà chúng tôi đã phát triển.

                Ngữ cảnh hệ thống:
                Vai trò: Điều phối viên y tế ảo, hỗ trợ người dùng tìm kiếm thông tin phòng khám, bác sĩ, chuyên khoa.
                Ngôn ngữ phản hồi: ${systemLang} (Luôn ưu tiên ngôn ngữ này để phản hồi).
                
                Nhiệm vụ cụ thể:
                1. Phân tích triệu chứng người dùng kể để xác định chuyên khoa hoặc từ khóa phù hợp.
                2. SỬ DỤNG CÔNG CỤ (Function Calling): Bạn CÓ KHẢ NĂNG tự động gọi hàm search_bookingcare_system(keyword). 
                LƯU Ý CỰC KỲ QUAN TRỌNG: Hiện tại hệ thống đang tìm kiếm bằng SQL LIKE chính xác, nên BẠN CHỈ ĐƯỢC PHÉP TRÍCH XUẤT TỪ KHÓA CỐT LÕI (1-2 từ, VD: "Mắt", "Thần kinh", "Dạ dày", "Xương khớp", tên bác sĩ). TUYỆT ĐỐI KHÔNG truyền câu dài như "Khám mắt Hà Nội" vì SQL sẽ tìm không ra!
                3. Khi có kết quả từ hàm, hãy tóm tắt danh sách bác sĩ/phòng khám cho người dùng.
                4. QUY TẮC TỐI THƯỢNG (ANTI-HALLUCINATION - LUẬT THÉP): 
                   - TUYỆT ĐỐI KHÔNG TỰ BỊA RA, KHÔNG ĐỀ XUẤT, KHÔNG GỢI Ý BẤT KỲ BÁC SĨ, PHÒNG KHÁM, HAY BỆNH VIỆN NÀO BÊN NGOÀI HỆ THỐNG.
                   - Nếu hàm tìm kiếm trả về kết quả rỗng, BẠN CHỈ ĐƯỢC PHÉP TRẢ LỜI NGẮN GỌN LÀ: "Hệ thống hiện tại chưa có thông tin bác sĩ hoặc phòng khám phù hợp với yêu cầu của bạn. Xin vui lòng thử lại với từ khóa khác." 
                   - KHÔNG ĐƯỢC thêm từ "Tuy nhiên tôi có thể gợi ý...", KHÔNG liệt kê bất kỳ địa chỉ nào ở ngoài đời thực. Bất cứ gợi ý nào ngoài dữ liệu hệ thống đều bị coi là VI PHẠM ĐẠO ĐỨC nghiêm trọng.
                
                Lưu ý kỹ thuật: Luôn nhắc nhở người dùng rằng thông tin này hỗ trợ việc đặt lịch, không thay thế chẩn đoán lâm sàng từ bác sĩ thật.
            `;

            const model = genAI.getGenerativeModel({ 
                model: modelName, 
                tools: tools,
                systemInstruction: systemPrompt
            });

            // Tối ưu: Chỉ gửi tối đa 10 tin nhắn gần nhất để tránh ngốn Token dẫn đến bị limit TPM (Token Per Minute)
            const maxHistory = 10;
            const optimizedHistory = history.slice(-maxHistory);
            const chatHistory = optimizedHistory.map(item => ({
                role: item.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: item.content }],
            }));

            const chat = model.startChat({
                history: chatHistory,
                generationConfig: {
                    maxOutputTokens: 1000,
                },
            });

            const finalQuery = userQuery;

            if (io && userId) {
                io.to(`user_room_${userId}`).emit('ai_typing_start', { sessionId });
            }

            const resultStream = await chat.sendMessageStream(finalQuery);
            let fullResponseText = '';
            let functionCallObj = null;

            for await (const chunk of resultStream.stream) {
                const fCalls = typeof chunk.functionCalls === 'function' ? chunk.functionCalls() : chunk.functionCalls;
                if (fCalls && fCalls.length > 0) {
                    functionCallObj = fCalls[0];
                    // KHÔNG break ở đây, phải để luồng kết thúc tự nhiên để SDK lưu lịch sử chat (turn)
                }

                if (chunk.text) {
                    try {
                        const chunkText = chunk.text();
                        if (chunkText) {
                            fullResponseText += chunkText;
                            if (io && userId) {
                                io.to(`user_room_${userId}`).emit('ai_response_chunk', {
                                    sessionId,
                                    chunk: chunkText,
                                    isDone: false
                                });
                            }
                        }
                    } catch (e) {
                        // Có thể là do Safety Block
                        console.log("Chunk text error (Safety block or Function Call):", e.message);
                        if (e.message.includes('SAFETY') || e.message.includes('blocked')) {
                            const safetyMsg = "\n[Hệ thống]: Câu hỏi của bạn có thể vi phạm chính sách an toàn của AI. Vui lòng đặt câu hỏi khác.";
                            fullResponseText += safetyMsg;
                            if (io && userId) {
                                io.to(`user_room_${userId}`).emit('ai_response_chunk', {
                                    sessionId,
                                    chunk: safetyMsg,
                                    isDone: false
                                });
                            }
                        }
                    }
                }
            }

            // ĐỢI luồng kết thúc hoàn toàn để SDK Google cập nhật Lịch sử hội thoại (Lưu ý rất quan trọng)
            await resultStream.response;

            // Nếu AI đòi gọi hàm (Function Calling)
            if (functionCallObj) {
                if (functionCallObj.name === "search_bookingcare_system") {
                    const args = functionCallObj.args;
                    console.log(">>> Gemini tự động gọi hàm tìm kiếm với keyword:", args.keyword);

                    // 1. Chạy API thật của hệ thống
                    let searchRes = await searchService.searchAll(args.keyword);

                    let apiResponse = {
                        result: searchRes.data || "Không tìm thấy kết quả"
                    };

                    // 1.5. Bắn luồng JSON nguyên bản (Raw Data) xuống Frontend để Frontend có thể vẽ giao diện Card
                    if (io && userId && searchRes.errCode === 0) {
                        io.to(`user_room_${userId}`).emit('ai_action_data', {
                            sessionId,
                            action: 'SEARCH_RESULTS',
                            data: searchRes.data
                        });
                        
                        // QUAN TRỌNG: Nối chuỗi JSON ẩn này vào fullResponseText để lưu vào Database.
                        // Khi Frontend fetch lại lịch sử (getChatHistory), nó sẽ tự động parse đoạn này ra để vẽ lại giao diện.
                        const actionPayload = `\n[AI_ACTION_DATA]${JSON.stringify({
                            action: 'SEARCH_RESULTS',
                            data: searchRes.data
                        })}[/AI_ACTION_DATA]`;
                        fullResponseText += actionPayload;
                    }

                    // 2. Trả kết quả (Data) ngược lại cho Gemini, và cho phép Gemini trả lời (stream)
                    const funcStreamResult = await chat.sendMessageStream([{
                        functionResponse: {
                            name: functionCallObj.name,
                            response: apiResponse
                        }
                    }]);

                    for await (const chunk of funcStreamResult.stream) {
                        if (chunk.text) {
                            try {
                                const chunkText = chunk.text();
                                fullResponseText += chunkText;
                                if (io && userId) {
                                    io.to(`user_room_${userId}`).emit('ai_response_chunk', {
                                        sessionId,
                                        chunk: chunkText,
                                        isDone: false
                                    });
                                }
                            } catch (e) {
                                console.log("Inner chunk text error:", e.message);
                            }
                        }
                    }
                }
            }

            if (io && userId) {
                io.to(`user_room_${userId}`).emit('ai_response_chunk', {
                    sessionId,
                    chunk: '',
                    isDone: true
                });
            }

            return fullResponseText;

        } catch (error) {
            console.error(`>>> Lỗi Gemini (Lần ${i + 1}):`, error.message);

            if (error.message.includes("503") || error.message.includes("429") || error.message.includes("Quota")) {
                if (i < retries - 1) {
                    console.log(`>>> [Chatbot] Lỗi API (Quota/503). Đang thử lại...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
            }

            return "Lỗi từ Gemini: " + error.message;
        }
    }
}

const deleteChatSession = (userId, sessionId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId || !sessionId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                });
            } else {
                await db.Chatbot.update({ deletedByUser: true }, {
                    where: { userId: userId, sessionId: sessionId }
                });
                resolve({
                    errCode: 0,
                    errMessage: 'Chat session deleted'
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

export default {
    saveMessage,
    getChatSessions,
    getChatHistory,
    handleChatWithAI,
    deleteChatSession
};
