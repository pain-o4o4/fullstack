import actionTypes from './actionTypes';
import { getChatSessions, getChatHistory } from '../../services/chatbotService';

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

export const fetchSessionsStart = (userId) => {
    return async (dispatch, getState) => {
        try {
            let res = await getChatSessions(userId);
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_CHAT_SESSIONS_SUCCESS,
                    data: res.data
                });
            } else {
                dispatch({ type: actionTypes.FETCH_CHAT_SESSIONS_FAIL });
            }
        } catch (e) {
            console.log(e);
            dispatch({ type: actionTypes.FETCH_CHAT_SESSIONS_FAIL });
        }
    }
}

export const fetchHistoryStart = (userId, sessionId) => {
    return async (dispatch, getState) => {
        try {
            let res = await getChatHistory(userId, sessionId);
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_CHAT_HISTORY_SUCCESS,
                    data: res.data
                });
            } else {
                dispatch({ type: actionTypes.FETCH_CHAT_HISTORY_FAIL });
            }
        } catch (e) {
            console.log(e);
            dispatch({ type: actionTypes.FETCH_CHAT_HISTORY_FAIL });
        }
    }
}
