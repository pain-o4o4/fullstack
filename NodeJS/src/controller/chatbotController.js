import chatbotService from "../services/chatbotService";

const handleGetChatSessions = async (req, res) => {
    console.log(">>> Enter handleGetChatSessions, userId:", req.query.userId);
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
    console.log(">>> Enter handleGetChatHistory, userId:", req.query.userId, "sessionId:", req.query.sessionId);
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

export default {
    handleGetChatSessions,
    handleGetChatHistory,
    handleSaveMessage
};
