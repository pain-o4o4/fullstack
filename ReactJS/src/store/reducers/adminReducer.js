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
    allHandbooks: [],
    detailHandbook: {},
    detailClinic: {},
    detailSpecialty: {},
    detailAppointment: [],
    bookingData: {},
    chatHistory: JSON.parse(localStorage.getItem('CHAT_HISTORY')) || []
}

const adminReducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case actionTypes.FETCH_GENDER_START:
            return {
                ...state,
                isLoadingGender: true
            }
        case actionTypes.FETCH_GENDER_SUCCESS:
            return {
                ...state,
                genders: action.data,
                isLoadingGender: false
            }
        case actionTypes.FETCH_GENDER_FAIL:
            return {
                ...state,
                isLoadingGender: false,
                genders: []
            }

        case actionTypes.FETCH_POSITION_START:
            return { ...state }
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
            return { ...state }
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

        // BUG FIX: removed duplicate CREATE_USER_SUCCESS/FAIL blocks.
        // Previously the second block (lines 106-115) for editUser was dead
        // code because JS switch already matched the first CREATE_USER_SUCCESS.
        case actionTypes.CREATE_USER_SUCCESS:
            return {
                ...state,
                editUser: action.data || []
            }
        case actionTypes.CREATE_USER_FAIL:
            return {
                ...state,
                editUser: []
            }

        // BUG FIX: action dispatches FETCH_ALL_USERS_FAIL but reducer was
        // listening for FETCH_ALL_USERS_FAILED (typo), so failure case never fired.
        case actionTypes.FETCH_ALL_USERS_SUCCESS:
            return {
                ...state,
                users: action.users
            }
        case actionTypes.FETCH_ALL_USERS_FAIL:
        case actionTypes.FETCH_ALL_USERS_FAILED:
            return {
                ...state,
                users: []
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

        // BUG FIX: was directly mutating state (state.detailClinic = action.data)
        // so React saw the same object reference and didn't re-render.
        case actionTypes.FETCH_DETAIL_CLINIC_SUCCESS:
            return {
                ...state,
                detailClinic: action.data
            }
        case actionTypes.FETCH_DETAIL_CLINIC_FAILD:
            return {
                ...state,
                detailClinic: {}
            }

        // BUG FIX: same direct mutation bug for detailSpecialty
        case actionTypes.FETCH_DETAIL_SPECIALTY_SUCCESS:
            return {
                ...state,
                detailSpecialty: action.data
            }
        case actionTypes.FETCH_DETAIL_SPECIALTY_FAILD:
            return {
                ...state,
                detailSpecialty: {}
            }

        case actionTypes.FETCH_ALL_CLINICS_SUCCESS:
            return {
                ...state,
                allClinics: action.data,
                allClinicsLoaded: true
            }
        case actionTypes.FETCH_ALL_CLINICS_FAILED:
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

        case actionTypes.SAVE_BOOKING_DATA_SUCCESS:
            return {
                ...state,
                bookingData: action.data
            }
        case actionTypes.SAVE_BOOKING_DATA_FAILD:
            return {
                ...state,
                bookingData: {}
            }

        case actionTypes.FETCH_ALL_HANDBOOKS_SUCCESS:
            return {
                ...state,
                allHandbooks: action.dataHandbooks
            }
        case actionTypes.FETCH_ALL_HANDBOOKS_FAILED:
            return {
                ...state,
                allHandbooks: []
            }

        case actionTypes.FETCH_DETAIL_HANDBOOK_SUCCESS:
            return {
                ...state,
                detailHandbook: action.dataHandbook
            }
        case actionTypes.FETCH_DETAIL_HANDBOOK_FAILED:
            return {
                ...state,
                detailHandbook: {}
            }

        case actionTypes.UPDATE_CHAT_HISTORY:
            return {
                ...state,
                chatHistory: action.data
            }
        case actionTypes.CLEAR_CHAT_HISTORY:
            return {
                ...state,
                chatHistory: []
            }
        case actionTypes.POST_CHAT_WITH_AI_FAIL:
            return {
                ...state
            }

        default:
            return state;
    }
}

export default adminReducer;