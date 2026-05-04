import { GoogleGenerativeAI } from "@google/generative-ai";
require('dotenv').config();

const handleChatWithAI = async (userQuery, language, history = [], io = null, userId = null, sessionId = null) => {
    let retries = 3;
    let delay = 2000; // 2 giây

    for (let i = 0; i < retries; i++) {
        try {
            const API_KEY = process.env.GOOGLE_API_KEY;
            if (!API_KEY) return language === 'en' ? "System configuration error." : "Lỗi cấu hình hệ thống.";

            const genAI = new GoogleGenerativeAI(API_KEY);
            const modelName = process.env.GOOGLE_MODEL_NAME || "gemini-1.5-flash";
            const model = genAI.getGenerativeModel({ model: modelName });

            const systemLang = language === 'en' ? 'Tiếng Anh (English)' : 'Tiếng Việt (Vietnamese)';

            // Format history for Gemini
            // history: [{ role: 'user', content: '...' }, { role: 'assistant', content: '...' }]
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

            // We combine system prompt with user query for the first message or as instruction
            const finalQuery = history.length === 0 ? `${systemPrompt}\n\nUser: ${userQuery}` : userQuery;

            // Bắt đầu streaming
            if (io && userId) {
                // Báo cho frontend biết AI bắt đầu trả lời
                io.to(`user_room_${userId}`).emit('ai_typing_start', { sessionId });

                const result = await chat.sendMessageStream(finalQuery);
                let fullResponseText = '';

                for await (const chunk of result.stream) {
                    const chunkText = chunk.text();
                    fullResponseText += chunkText;

                    // Phát luồng chunk về frontend
                    io.to(`user_room_${userId}`).emit('ai_response_chunk', {
                        sessionId,
                        chunk: chunkText,
                        isDone: false
                    });
                }

                // Phát tín hiệu hoàn tất
                io.to(`user_room_${userId}`).emit('ai_response_chunk', {
                    sessionId,
                    chunk: '',
                    isDone: true
                });

                return fullResponseText;
            } else {
                // Rơi về chế độ không streaming nếu không có IO (ví dụ test)
                const result = await chat.sendMessage(finalQuery);
                const response = await result.response;
                return response.text();
            }

        } catch (error) {
            console.error(`>>> Lỗi Gemini (Lần ${i + 1}):`, error.message);

            if (error.message.includes("503") && i < retries - 1) {
                console.log(`>>> Đang thử lại sau ${delay / 1000} giây...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }

            return "Lỗi từ Gemini: " + error.message;
        }
    }
}

export default {
    handleChatWithAI
};
