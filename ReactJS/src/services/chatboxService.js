import axios from '../auth/axiosInstance';

export const postChatWithAIService = (data) => {
    return axios.post('/api/chat-with-ai', data);
}
export const sendMessageApi = (data) => {
    return axios.post('/api/send-message', data);
}
export const getMessagesApi = (senderId, receiverId) => {
    return axios.get(`/api/get-messages?senderId=${senderId}&receiverId=${receiverId}`);
}
export const getChatHistorySidebarApi = (userId) => {
    return axios.get(`/api/get-chat-history-sidebar?userId=${userId}`);
}
export const searchUsersForChatApi = (userId, query) => {
    return axios.get(`/api/search-users-for-chat?userId=${userId}&query=${query}`);
}
export const deleteConversationApi = (data) => {
    return axios.post('/api/delete-conversation', data);
}
export const markMessagesAsReadApi = (data) => {
    return axios.post('/api/mark-messages-as-read', data);
}
export const getQuickRepliesApi = (doctorId) => {
    return axios.get(`/api/get-quick-replies?doctorId=${doctorId}`);
}
export const saveQuickReplyApi = (data) => {
    return axios.post('/api/save-quick-reply', data);
}
export const deleteQuickReplyApi = (id) => {
    return axios.delete('/api/delete-quick-reply', { data: { id } });
}
export const updateMessageReactionApi = (data) => {
    return axios.post('/api/update-reaction', data);
}
export const getAllGlobalQuickRepliesApi = () => {
    return axios.get('/api/get-all-global-quick-replies');
}
export const saveGlobalQuickReplyApi = (data) => {
    return axios.post('/api/save-global-quick-reply', data);
}
