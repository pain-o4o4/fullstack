import actionTypes from './actionTypes';
import { getAllCodeService, createNewUsersService, getAllUsers, deleteUserService } from '../../services/userService';
import { toast } from 'react-toastify';
export const fetchGenderStart = () => {
    return async (dispatch, getState) => {
        dispatch({
            type: actionTypes.FETCH_GENDER_START
        });
        try {
            let res = await getAllCodeService('GENDER');

            if (res && res.errCode === 0) {
                dispatch(fetchGenderSuccess(res.data));
            } else {
                dispatch(fetchGenderFail());
            }
        } catch (e) {
            dispatch(fetchGenderFail());
            console.log('fetchGenderStart error: ', e);
        }
    };
};

export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,   // ← Sửa thành SUCCESS
    data: genderData
});

export const fetchGenderFail = () => ({
    type: actionTypes.FETCH_GENDER_FAIL
});

export const fetchPositionSuccess = (positionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: positionData
});

export const fetchPositionFail = () => ({
    type: actionTypes.FETCH_POSITION_FAIL
});

export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData
});
export const fetchRoleFail = () => ({
    type: actionTypes.FETCH_ROLE_FAIL
})
export const fetchPositionStart = () => {
    return async (dispatch, getState) => {
        dispatch({
            type: actionTypes.FETCH_POSITION_START
        });
        try {
            let res = await getAllCodeService('POSITION');

            if (res && res.errCode === 0) {
                dispatch(fetchPositionSuccess(res.data));
            } else {
                dispatch(fetchPositionFail());
            }
        } catch (e) {
            dispatch(fetchPositionFail());
            console.log('fetchGenderStart error: ', e);
        }
    };
};

export const fetchRoleStart = () => {
    return async (dispatch, getState) => {
        dispatch({
            type: actionTypes.FETCH_ROLE_START
        });
        try {
            let res = await getAllCodeService('ROLE');

            if (res && res.errCode === 0) {
                dispatch(fetchRoleSuccess(res.data));
            } else {
                dispatch(fetchRoleFail());
            }
        } catch (e) {
            dispatch(fetchRoleFail());
            console.log('fetchGenderStart error: ', e);
        }
    };
};

export const createNewUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await createNewUsersService(data);
            console.log('res', res)
            if (res && res.errCode === 0) {
                toast.success('Create a new user succeed!');
                dispatch(saveUserSuccess(res.data));
                dispatch(fetchAllUserStart());
            } else {
                dispatch(saveUserFail());
                toast.error('Create a new user fail!');
            }
        } catch (e) {
            dispatch(saveUserFail());
            console.log('fetchGenderStart error: ', e);
            toast.error('Create a new user fail!');
        }
    };
};
export const saveUserSuccess = () => ({
    type: actionTypes.CREATE_USER_SUCCESS
    // data: data
});
export const saveUserFail = () => ({
    type: actionTypes.CREATE_USER_FAIL
})


export const fetchAllUserStart = () => {
    return async (dispatch, getState) => {

        try {
            let res = await getAllUsers('ALL');
            console.log('>>> Duy check res từ API:', res); // DÒNG NÀY ĐỂ DEBUG
            if (res && res.errCode === 0) {
                dispatch(fetchAllUserSuccess(res.users));
            } else {
                dispatch(fetchAllUserFail());

            }
        } catch (e) {
            dispatch(fetchAllUserFail());
            console.log('fetchGenderStart error: ', e);
        }
    };
};

export const fetchAllUserSuccess = (user) => ({
    type: actionTypes.FETCH_ALL_USERS_SUCCESS,
    users: user
});
export const fetchAllUserFail = () => ({
    type: actionTypes.FETCH_ALL_USERS_FAIL
})


export const deleteUser = (userId) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteUserService(userId);
            console.log('res', res)
            if (res && res.errCode === 0) {
                toast.success('Delete user succeed!');
                dispatch(deleteUserSuccess());
                dispatch(fetchAllUserStart());
            } else {
                dispatch(deleteUserFail());
                toast.error('Delete user fail!');
            }
        } catch (e) {
            dispatch(deleteUserFail());
            console.log('deleteUserFail error: ', e);
            toast.error('Delete user fail!');
        }
    };
};
export const deleteUserSuccess = () => ({
    type: actionTypes.DELETE_USER_SUCCESS
    // data: data
});
export const deleteUserFail = () => ({
    type: actionTypes.DELETE_USER_FAIL
})