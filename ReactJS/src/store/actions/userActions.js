import actionTypes from './actionTypes';
import { toast } from 'react-toastify';

export const addUserSuccess = () => ({
    type: actionTypes.ADD_USER_SUCCESS
})
export const userLoginSuccess = (userInfo) => ({
    type: actionTypes.USER_LOGIN_SUCCESS,
    userInfo: userInfo
})
export const updateUserSuccess = (userInfo) => ({
    type: actionTypes.UPDATE_USER_SUCCESS,
    userInfo: userInfo
})

export const userLoginFail = () => ({
    type: actionTypes.USER_LOGIN_FAIL
})

export const processLogout = () => ({
    type: actionTypes.PROCESS_LOGOUT
})
// các hành động liên quan đến quy trình đăng ký tài khoản
export const setRegisterSession = (payload) => ({
    type: actionTypes.REGISTER_SET_SESSION,
    payload
});

export const registerInitiateSuccess = (payload) => ({
    type: actionTypes.REGISTER_INITIATE_SUCCESS,
    payload
});

export const registerInitiateFail = () => ({
    type: actionTypes.REGISTER_INITIATE_FAIL
});

export const clearRegisterSession = () => ({
    type: actionTypes.REGISTER_CLEAR_SESSION
});

