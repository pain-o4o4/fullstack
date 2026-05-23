// import actionTypes from "../actions/actionTypes";

// const initialState = {
//     email: "",
//     registrationSessionToken: "",
//     draftData: null,
//     isOtpStep: false
// };

// const registerReducer = (state = initialState, action = {}) => {
//     switch (action.type) {
//         case actionTypes.REGISTER_SET_SESSION:
//         case actionTypes.REGISTER_INITIATE_SUCCESS:
//             return {
//                 ...state,
//                 email: action.payload.email,
//                 registrationSessionToken: action.payload.registrationSessionToken || "",
//                 draftData: action.payload.draftData || null,
//                 isOtpStep: true
//             };
//         case actionTypes.REGISTER_CLEAR_SESSION:
//         case actionTypes.REGISTER_INITIATE_FAIL:
//             return {
//                 ...initialState
//             };
//         default:
//             return state;
//     }
// };

// export default registerReducer;
