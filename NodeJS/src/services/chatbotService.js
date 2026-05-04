import db from "../../models/index";

const saveMessage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(">>> db keys:", Object.keys(db));
            if (!data.userId || !data.sessionId || !data.role || !data.content) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                });
            } else {
                if (!db.Chatbot) {
                    throw new Error("Chatbot model is not defined in db. Available: " + Object.keys(db).join(', '));
                }
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
                // Lấy các sessionId duy nhất và tin nhắn cuối cùng để làm tiêu đề
                let sessions = await db.Chatbot.findAll({
                    where: { userId: userId },
                    attributes: ['sessionId', 'createdAt', 'content'],
                    order: [['createdAt', 'DESC']],
                });

                // Nhóm theo sessionId (lấy cái mới nhất)
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
                errMessage: 'Error from service: ' + e.message + (db.Chatbot ? ' (Model exists)' : ' (Model undefined)')
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
                errMessage: 'Error from service: ' + e.message + (db.Chatbot ? ' (Model exists)' : ' (Model undefined)')
            });
        }
    });
};

export default {
    saveMessage,
    getChatSessions,
    getChatHistory
};
