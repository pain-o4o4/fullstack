import aiService from "../services/aiService";
import chatbotService from "../services/chatbotService";

let postChatWithAI = async (req, res) => {
    try {
        let { userQuery, language, userId, sessionId } = req.body;
        if (!userQuery || !sessionId) {
            return res.status(200).json({
                errCode: 1,
                message: 'Missing required parameters'
            });
        }

        const isGuest = !userId || (typeof userId === 'string' && userId.startsWith('guest_'));

        // 1. Lấy lịch sử chat cũ của session này để AI có ngữ cảnh
        let historyData = !isGuest ? await chatbotService.getChatHistory(userId, sessionId) : { errCode: -1 };
        let history = [];
        if (historyData.errCode === 0) {
            history = historyData.data.map(item => ({
                role: item.role,
                content: item.content
            }));
        }

        // 2. Lưu tin nhắn của người dùng vào DB trước (Chỉ lưu nếu không phải guest)
        if (!isGuest) {
            await chatbotService.saveMessage({
                userId,
                sessionId,
                role: 'user',
                content: userQuery
            });
        }

        // 3. Gọi AI xử lý (kèm lịch sử và io để streaming)
        let io = req.app.get('io');
        let response = await aiService.handleChatWithAI(userQuery, language, history, io, userId, sessionId);

        // 4. Lưu phản hồi của AI vào DB (Chỉ lưu nếu không phải guest)
        if (!isGuest) {
            await chatbotService.saveMessage({
                userId,
                sessionId,
                role: 'assistant',
                content: response
            });
        }

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
