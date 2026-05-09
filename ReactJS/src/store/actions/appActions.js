import actionTypes from './actionTypes';

export const appStartUpComplete = () => ({
    type: actionTypes.APP_START_UP_COMPLETE
});

export const setContentOfConfirmModal = (contentOfConfirmModal) => ({
    type: actionTypes.SET_CONTENT_OF_CONFIRM_MODAL,
    contentOfConfirmModal: contentOfConfirmModal
});
export const changeLanguageApp = (language) => ({
    type: actionTypes.CHANGE_LANGUAGE,
    language
})

export const toggleChat = () => ({
    type: actionTypes.TOGGLE_CHAT
})

export const openChatWithTab = (tab) => ({
    type: actionTypes.OPEN_CHAT_WITH_TAB,
    tab
})