import aiService from "../services/aiService";
import chatbotService from "../services/chatbotService";

let postChatWithAI = async (req, res) => {
    try {
        let { userQuery, language, userId, sessionId } = req.body;
        if (!userQuery || !userId || !sessionId) {
            return res.status(200).json({
                errCode: 1,
                message: 'Missing required parameters'
            });
        }

        // 1. Lấy lịch sử chat cũ của session này để AI có ngữ cảnh
        let historyData = await chatbotService.getChatHistory(userId, sessionId);
        let history = [];
        if (historyData.errCode === 0) {
            history = historyData.data.map(item => ({
                role: item.role,
                content: item.content
            }));
        }

        // 2. Lưu tin nhắn của người dùng vào DB trước
        await chatbotService.saveMessage({
            userId,
            sessionId,
            role: 'user',
            content: userQuery
        });

        // 3. Gọi AI xử lý (kèm lịch sử và io để streaming)
        let io = req.app.get('io');
        let response = await aiService.handleChatWithAI(userQuery, language, history, io, userId, sessionId);

        // 4. Lưu phản hồi của AI vào DB
        await chatbotService.saveMessage({
            userId,
            sessionId,
            role: 'assistant',
            content: response
        });

        return res.status(200).json({
            errCode: 0,
            data: response
        });
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

export default {
    postChatWithAI
}
