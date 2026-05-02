import actionTypes from './actionTypes';

export const updateChatHistory = (data) => ({
    type: actionTypes.UPDATE_CHAT_HISTORY,
    data
});

export const clearChatHistoryAction = () => ({
    type: actionTypes.CLEAR_CHAT_HISTORY
});

export const postChatWithAIFail = (message) => ({
    type: actionTypes.POST_CHAT_WITH_AI_FAIL,
    message
});

export const chatAiResponseStart = () => ({
    type: actionTypes.CHAT_AI_RESPONSE_START
});

export const chatAiResponseChunk = (chunk) => ({
    type: actionTypes.CHAT_AI_RESPONSE_CHUNK,
    chunk
});

export const chatAiResponseDone = (fullResponse) => ({
    type: actionTypes.CHAT_AI_RESPONSE_DONE,
    fullResponse
});

export const chatAiSetTyping = (isTyping) => ({
    type: actionTypes.CHAT_AI_SET_TYPING,
    isTyping
});
