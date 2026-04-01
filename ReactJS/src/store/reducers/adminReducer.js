import { editUser } from '../actions';
import actionTypes from '../actions/actionTypes';

const initialState = {
    isLoadingGender: false,
    genders: [],
    roles: [],
    users: [],
    positions: [],
    topDoctors: [],
    editUser: [],

}

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_GENDER_START:
            {
                // let state = { ...state };
                state.isLoadingGender = true;
                return {
                    ...state
                }
            }
        case actionTypes.FETCH_GENDER_SUCCESS:
            {
                // let state = { ...state };
                state.genders = action.data;
                state.isLoadingGender = false;
                console.log('fetch gender success: ', state)
                return {
                    ...state,
                }
                // started: true
            }
        case actionTypes.FETCH_GENDER_FAIL:
            {
                // let state = { ...state };
                state.isLoadingGender = false;
                state.genders = [];
                console.log('fetch gender fail: ', action)
                return {
                    ...state,

                    // started: true
                }
            }
        case actionTypes.FETCH_POSITION_START:
            return {
                ...state

            }
        case actionTypes.FETCH_POSITION_SUCCESS:
            return {
                ...state,
                positions: action.data
            }
        case actionTypes.FETCH_POSITION_FAIL:
            return {
                ...state,
                positions: []
            }
        case actionTypes.FETCH_ROLE_START:
            return {
                ...state
            }
        case actionTypes.FETCH_ROLE_SUCCESS:
            return {
                ...state,
                roles: action.data
            }
        case actionTypes.FETCH_ROLE_FAIL:
            return {
                ...state,
                roles: []
            }
        case actionTypes.CREATE_USER_SUCCESS:
            state.users = action.users;
            return {
                ...state,

            }
        case actionTypes.CREATE_USER_FAIL:
            state.users = [];
            return {
                ...state
            }
        case actionTypes.FETCH_ALL_USERS_SUCCESS:
            // Nhớ check lại bên adminActions.js xem Duy gửi qua là 'users' hay 'data' nhé
            // Theo như action Duy gửi lúc nãy thì là 'users'
            // state.users = action.users;
            return {
                ...state,
                users: action.users
            }

        case actionTypes.FETCH_ALL_USERS_FAILED:
            // state.users = [];
            return {
                ...state,
                users: []

            }

        // Case Create User của Duy đang hơi bị "lẫn" 
        // case actionTypes.CREATE_USER_SUCCESS:
        //     // Khi tạo thành công, Duy không nên gán state.users = action.users ở đây 
        //     // vì action này thường chỉ trả về thông báo thành công, không trả về cả list.
        //     return {
        //         ...state,
        //     }
        case actionTypes.CREATE_USER_SUCCESS:
            return {
                ...state,
                editUser: action.data
            }
        case actionTypes.CREATE_USER_FAIL:
            return {
                ...state,
                editUser: []
            }
        case actionTypes.FETCH_TOP_DOCTOR_SUCCESS:
            return {
                ...state,
                topDoctors: action.dataDoctors
            }
        case actionTypes.FETCH_TOP_DOCTOR_FAIL:
            return {
                ...state,
                topDoctors: []
            }
        default:
            return state;
    }
}

export default adminReducer;