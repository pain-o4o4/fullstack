import actionTypes from '../actions/actionTypes';

const initContentOfConfirmModal = {
    isOpen: false,
    messageId: "",
    handleFunc: null,
    dataFunc: null
}

const initialState = {
    started: true,
    language: 'vi',
    systemMenuPath: '/system/user-manage',
    contentOfConfirmModal: {
        ...initContentOfConfirmModal
    },
    isOpenDoctorChat: false,
    doctorChatTab: 'ALL'
}

const appReducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case actionTypes.APP_START_UP_COMPLETE:
            return {
                ...state,
                started: true
            }
        case actionTypes.SET_CONTENT_OF_CONFIRM_MODAL:
            return {
                ...state,
                contentOfConfirmModal: {
                    ...state.contentOfConfirmModal,
                    ...action.contentOfConfirmModal
                }
            }
        case actionTypes.CHANGE_LANGUAGE:
            console.log(">>> check action: ", action);
            return {
                ...state,
                language: action.language // en, vi
            }
        case actionTypes.TOGGLE_CHAT:
            return {
                ...state,
                isOpenDoctorChat: !state.isOpenDoctorChat
            }
        case actionTypes.OPEN_CHAT_WITH_TAB:
            return {
                ...state,
                isOpenDoctorChat: true,
                doctorChatTab: action.tab
            }
        default:
            return state;
    }
}

export default appReducer;