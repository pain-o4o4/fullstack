import aiService from "../services/aiService";

let postChatWithAI = async (req, res) => {
    try {
        var { userQuery, language } = req.body;
        let response = await aiService.handleChatWithAI(userQuery, language);
        return res.status(200).json({
            errCode: 0,
            data: response
        });
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: language === 'en' ? 'Error from AI Server...' : 'Lỗi từ phía Server AI...'
        });
    }
}

export default {
    postChatWithAI
}
