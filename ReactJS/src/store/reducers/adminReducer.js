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
    allDoctors: [],
    detailDoctor: {},
    allScheduleTime: [],
    allRequiredDoctorInfor: {},
    allClinics: [],
    allClinicsLoaded: false,
    allSpecialties: [],
    detailClinic: {},
    detailSpecialty: {},
    detailAppointment: []
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
        case actionTypes.FETCH_ALL_DOCTORS_SUCCESS:
            return {
                ...state,
                allDoctors: action.dataDoctors
            }
        case actionTypes.FETCH_ALL_DOCTORS_FAIL:
            return {
                ...state,
                allDoctors: []
            }
        case actionTypes.GET_DETAIL_DOCTOR_SUCCESS:
            return {
                ...state,
                detailDoctor: action.detailDoctor
            }
        case actionTypes.GET_DETAIL_DOCTOR_FAIL:
            return {
                ...state,
                detailDoctor: {}
            }
        case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS:
            return {
                ...state,
                allScheduleTime: action.dataTime
            }
        case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAIL:
            return {
                ...state,
                allScheduleTime: []
            }
        case actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_SUCCESS:
            return {
                ...state,
                allRequiredDoctorInfor: action.data
            }
        case actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_FAIL:
            return {
                ...state,
                allRequiredDoctorInfor: []
            }
        case actionTypes.FETCH_ALL_SPECIALTY_SUCCESS:
            return {
                ...state,
                allSpecialties: action.data
            }
        case actionTypes.FETCH_ALL_SPECIALTY_FAIL:
            return {
                ...state,
                allSpecialties: []
            }
        case actionTypes.FETCH_DETAIL_CLINIC_SUCCESS:
            state.detailClinic = action.data;
            return {
                ...state
            }
        case actionTypes.FETCH_DETAIL_CLINIC_FAILD:
            state.detailClinic = {};
            return {
                ...state
            }
        case actionTypes.FETCH_DETAIL_SPECIALTY_SUCCESS:
            state.detailSpecialty = action.data;
            return {
                ...state
            }
        case actionTypes.FETCH_DETAIL_SPECIALTY_FAILD:
            state.detailSpecialty = {};
            return {
                ...state
            }
        case actionTypes.FETCH_ALL_CLINIC_SUCCESS:
            return {
                ...state,
                allClinics: action.data,
                allClinicsLoaded: true
            }
        case actionTypes.FETCH_ALL_CLINIC_FAILD:
            return {
                ...state,
                allClinics: []
            }
        case actionTypes.FETCH_DETAIL_APPOINTMENT_SUCCESS:
            return {
                ...state,
                detailAppointment: action.data

            }
        case actionTypes.FETCH_DETAIL_APPOINTMENT_FAILD:
            return {
                ...state,
                detailAppointment: []
            }
        default:
            return state;
    }
}

export default adminReducer;