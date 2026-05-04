import axios from '../auth/axiosInstance';

const getChatSessions = (userId) => {
    return axios.get(`/api/get-chat-sessions?userId=${userId}`);
}

const getChatHistory = (userId, sessionId) => {
    return axios.get(`/api/get-chat-history?userId=${userId}&sessionId=${sessionId}`);
}

const saveChatMessage = (data) => {
    return axios.post('/api/save-chat-message', data);
}

export {
    getChatSessions,
    getChatHistory,
    saveChatMessage
};
