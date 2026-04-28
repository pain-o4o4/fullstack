import { GoogleGenerativeAI } from "@google/generative-ai";
require('dotenv').config();

const handleChatWithAI = async (userQuery, language = 'vi') => {
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
            const prompt = `
                Bạn là trợ lý ảo y tế chuyên nghiệp của BookingCare. 
                Ngôn ngữ giao diện hiện tại của người dùng: ${systemLang}.
                Câu hỏi của người dùng: "${userQuery}"
                
                HƯỚNG DẪN QUAN TRỌNG:
                1. Hãy tự nhận diện ngôn ngữ mà người dùng đang sử dụng trong câu hỏi.
                2. Phản hồi bằng chính ngôn ngữ đó để đảm bảo sự thân thiện và dễ hiểu.
                3. Nếu câu hỏi quá ngắn hoặc không rõ ngôn ngữ, hãy sử dụng ${systemLang}.
                4. Nội dung trả lời phải lịch sự, ngắn gọn và luôn khuyên bệnh nhân đi khám bác sĩ để có kết quả chính xác nhất.
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();

        } catch (error) {
            console.error(`>>> Lỗi Gemini (Lần ${i + 1}):`, error.message);

            if (error.message.includes("503") && i < retries - 1) {
                console.log(`>>> Đang thử lại sau ${delay / 1000} giây...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }

            return language === 'en' ? "The AI system is currently busy processing many requests. Please try again later!" : "Hiện tại hệ thống AI đang bận xử lý nhiều yêu cầu. Bạn vui lòng thử lại sau ít phút nhé!";
        }
    }
}

export default {
    handleChatWithAI
};
