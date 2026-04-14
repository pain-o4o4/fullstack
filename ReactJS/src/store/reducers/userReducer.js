import actionTypes from '../actions/actionTypes';

const initialState = {
    isLoggedIn: false,
    userInfo: null,

}

// Đổi tên từ appReducer thành userReducer ở đây
const userReducer = (state = initialState, action) => {
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
            return {
                ...state,
                isLoggedIn: false,
                userInfo: null
            };
        default:
            return state;
    }
}

export default userReducer;