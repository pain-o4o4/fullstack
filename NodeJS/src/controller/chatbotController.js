import chatbotService from "../services/chatbotService";

const handleGetChatSessions = async (req, res) => {
    try {
        let userId = req.query.userId;
        if (!userId) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }
        let data = await chatbotService.getChatSessions(userId);
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

const handleGetChatHistory = async (req, res) => {
    try {
        let userId = req.query.userId;
        let sessionId = req.query.sessionId;
        if (!userId || !sessionId) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }
        let data = await chatbotService.getChatHistory(userId, sessionId);
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

const handleSaveMessage = async (req, res) => {
    try {
        let data = await chatbotService.saveMessage(req.body);
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

const handleChatWithAI = async (req, res) => {
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
        let response = await chatbotService.handleChatWithAI(userQuery, language, history, io, userId, sessionId);

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
};

export default {
    handleGetChatSessions,
    handleGetChatHistory,
    handleSaveMessage,
    handleChatWithAI
};
