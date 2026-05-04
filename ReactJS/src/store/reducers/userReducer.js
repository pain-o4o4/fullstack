import actionTypes from '../actions/actionTypes';

const initialState = {
    isLoggedIn: false,
    userInfo: null,
    email: "",
    registrationSessionToken: "",
    draftData: null,
    isOtpStep: false

}

// Đổi tên từ appReducer thành userReducer ở đây
const userReducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case actionTypes.USER_LOGIN_SUCCESS:
            console.log(">>> check action trong Reducer: ", action);
            return {
                ...state,
                isLoggedIn: true,
                userInfo: action.userInfo
            };
        case actionTypes.USER_LOGIN_FAIL:
        case actionTypes.PROCESS_LOGOUT:
            localStorage.removeItem('token');
            // Lưu ý: refreshToken là HttpOnly Cookie, chỉ có thể xóa từ phía Server
            // Việc xóa cookie được xử lý bởi API /api/logout trong axios.js

            return {
                ...state,
                isLoggedIn: false,
                userInfo: null,
                email: '',
                registrationSessionToken: '',
                draftData: null,
                isOtpStep: false,
            };
        case actionTypes.UPDATE_USER_SUCCESS:
            return {
                ...state,
                userInfo: action.userInfo
            };
        case actionTypes.REGISTER_SET_SESSION:
        case actionTypes.REGISTER_INITIATE_SUCCESS:
            return {
                ...state,
                email: action.payload.email,
                registrationSessionToken: action.payload.registrationSessionToken || "",
                draftData: action.payload.draftData || null,
                isOtpStep: true
            };
        case actionTypes.REGISTER_CLEAR_SESSION:
        case actionTypes.REGISTER_INITIATE_FAIL:
            return {
                ...initialState
            };
        default:
            return state;
    }
}

export default userReducer;
