import actionTypes from './actionTypes';
import {
    getAllCodeService, createNewUsersService,
    getAllUsers, deleteUserService, editUserService,
    getTopDoctorHomeService, getAllDoctorsService,
    postInforDoctorService, getDetailDoctorByIdService,
    getAllSpecialtyService, getAllClinicService,
    getDetailClinicByIdService, getDetailSpecialtyByIdService,
    getAllAppointmentsByIdService, getAllHandbookService,
    getDetailHandbookByIdService, postChatWithAIService,
    getHistoryAppointmentByIdService
} from '../../services/userService';
import { toast } from 'react-toastify';
import { LANGUAGES } from '../../utils';

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
            // let res = await getTopDoctorHomeService('100');
            console.log('res1', res)
            console.log('>>> CMM check res từ API:', res); // DÒNG NÀY ĐỂ DEBUG
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

export const editUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await editUserService(data);
            console.log('res editUserService', res)
            console.log('>>> Check action type:', actionTypes.EDIT_USER_SUCCESS);
            if (res && res.errCode === 0) {
                toast.success('editUserSuccess user succeed!');
                dispatch(editUserSuccess());
                dispatch(fetchAllUserStart());
            } else {
                dispatch(editUserFail());
                toast.error('editUserFail user fail!');
            }
        } catch (e) {
            dispatch(editUserFail());
            console.log('editUserFail error: ', e);
            toast.error('editUserFail user fail!');
        }
    };
};

export const editUserSuccess = () => ({
    type: actionTypes.EDIT_USER_SUCCESS,
    // data: data
});
export const editUserFail = () => ({
    type: actionTypes.EDIT_USER_FAIL
})
// export const editUserbtn = (user) => ({
//     type: actionTypes.EDIT_USER,
//     user: user
// })
export const fetchTopDoctor = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getTopDoctorHomeService('10');
            // console.log('res data from service (action)', res)
            console.log('>>> CMM check res từ API:', res); // DÒNG NÀY ĐỂ DEBUG
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTOR_SUCCESS,
                    dataDoctors: res.data
                });
            } else {
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTOR_FAIL
                });
            }
        } catch (e) {
            console.log('fetchGenderStart error: ', e);
        }
    };
}
export const fetchAllDoctors = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllDoctorsService();
            console.log('>>> CMM check res từ API:', res);

            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTORS_SUCCESS,
                    dataDoctors: res.data
                });
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTORS_FAIL
                });
            }
        } catch (e) {
            console.error('fetchAllDoctors error:', e);
            dispatch({
                type: actionTypes.FETCH_ALL_DOCTORS_FAIL
            });
        }
    }
}
export const saveDetailDoctor = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await postInforDoctorService(data);
            console.log('>>> CMM check res từ API:', res);

            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.POST_DETAIL_DOCTORS_SUCCESS,
                });
                toast.success('Update detail doctor succeed!');
                dispatch(fetchAllDoctors());
                dispatch(fecthAllSpecialties())
            } else {
                dispatch({
                    type: actionTypes.POST_DETAIL_DOCTORS_FAIL
                });
                toast.error('Update detail doctor fail!');
            }
        } catch (e) {
            console.error('saveDetailDoctors error:', e);
            toast.error('Update detail doctor fail!');
            dispatch({
                type: actionTypes.POST_DETAIL_DOCTORS_FAIL
            });
        }
    }
}

export const getDetailDoctor = (id) => {
    return async (dispatch, getState) => {
        try {
            let res = await getDetailDoctorByIdService(id);
            console.log('>>> CMM check res từ API:', res);
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.GET_DETAIL_DOCTOR_SUCCESS,
                    detailDoctor: res.data
                });
            } else {
                dispatch({
                    type: actionTypes.GET_DETAIL_DOCTOR_FAIL
                });
            }
        } catch (e) {
            console.error('getDetailDoctors error:', e);
            dispatch({
                type: actionTypes.GET_DETAIL_DOCTOR_FAIL
            });
        }
    }
}

export const fetchAllHandbooks = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllHandbookService();
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_HANDBOOKS_SUCCESS,
                    dataHandbooks: res.data
                });
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALL_HANDBOOKS_FAILED
                });
            }
        } catch (e) {
            console.log('fetchAllHandbooks error: ', e);
            dispatch({
                type: actionTypes.FETCH_ALL_HANDBOOKS_FAILED
            });
        }
    };
};
export const fetchAllScheduleTime = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService('TIME');
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS,
                    dataTime: res.data
                });
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAIL
                });
            }
        } catch (e) {
            console.log('fetchALLScheduleTime error: ', e);
        }
    };
}
export const getRequiredDoctorInfor = () => {
    return async (dispatch, getState) => {
        dispatch({
            type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_START
        });
        try {
            let resPrice = await getAllCodeService('PRICE');
            let resPayment = await getAllCodeService('PAYMENT');
            let resProvince = await getAllCodeService('PROVINCE');
            let resSpecialty = await getAllSpecialtyService();
            let resClinic = await getAllClinicService();

            if (resPrice && resPrice.errCode === 0
                && resPayment && resPayment.errCode === 0
                && resProvince && resProvince.errCode === 0
                && resSpecialty && resSpecialty.errCode === 0
                && resClinic && resClinic.errCode === 0
            ) {
                let data = {
                    resPrice: resPrice.data,
                    resPayment: resPayment.data,
                    resProvince: resProvince.data,
                    resSpecialty: resSpecialty.data,
                    resClinic: resClinic.data
                };
                dispatch(fetchRequiredDoctorInforSuccess(data));
            } else {
                dispatch(fetchRequiredDoctorInforFail());
            }
        } catch (e) {
            dispatch(fetchRequiredDoctorInforFail());
            console.log('fetchRequiredDoctorInfor error: ', e);
        }

    };
};

export const fetchRequiredDoctorInforSuccess = (allRequiredData) => ({
    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_SUCCESS,
    data: allRequiredData
});

export const fetchRequiredDoctorInforFail = () => ({
    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_FAIL
});
export const fecthAllSpecialties = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllSpecialtyService();
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_SPECIALTY_SUCCESS,
                    data: res.data
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALL_SPECIALTY_FAIL
                })
            }
        } catch (e) {
            console.log('fetchSpecialty error: ', e);
            dispatch({
                type: actionTypes.FETCH_ALL_SPECIALTY_FAIL
            })
        }
    }
}
export const fecthAllClinics = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllClinicService();
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_CLINICS_SUCCESS,
                    data: res.data
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALL_CLINICS_FAILED
                })
            }
        } catch (e) {
            console.log('fetchSpecialty error: ', e);
            dispatch({
                type: actionTypes.FETCH_ALL_CLINICS_FAILED
            })
        }
    }
}
export const getDetailSpecialtyById = (id) => {
    return async (dispatch, getState) => {
        try {
            let res = await getDetailSpecialtyByIdService(id);
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_DETAIL_SPECIALTY_SUCCESS,
                    data: res.data
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_DETAIL_SPECIALTY_FAILD,
                })
            }
        } catch (e) {
            console.log('FETCH_DETAIL_SPECIALTY_FAILD: ', e)
            dispatch({
                type: actionTypes.FETCH_DETAIL_SPECIALTY_FAILD,
            })
        }
    }
}
export const getDetailClinicById = (id) => {
    return async (dispatch, getState) => {
        try {
            let res = await getDetailClinicByIdService(id);
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_DETAIL_CLINIC_SUCCESS,
                    data: res.data
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_DETAIL_CLINIC_FAILD,
                })
            }
        } catch (e) {
            console.log('FETCH_DETAIL_CLINIC_FAILD: ', e)
            dispatch({
                type: actionTypes.FETCH_DETAIL_CLINIC_FAILD,
            })
        }
    }
}
export const getAllAppointmentsById = (id) => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllAppointmentsByIdService(id);
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.GET_ALL_APPOINTMENTS_BY_ID_SUCCESS,
                    data: res.data
                })
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_APPOINTMENTS_BY_ID_FAILD,
                })
            }
        } catch (e) {
            console.log('GET_ALL_APPOINTMENTS_BY_ID_FAILD: ', e)
            dispatch({
                type: actionTypes.GET_ALL_APPOINTMENTS_BY_ID_FAILD,
            })
        }
    }
}

export const getHistoryAppointmentById = (id) => {
    return async (dispatch, getState) => {
        try {
            let res = await getHistoryAppointmentByIdService(id);
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_HISTORY_APPOINTMENT_SUCCESS,
                    data: res.data
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_HISTORY_APPOINTMENT_FAILED,
                })
            }
        } catch (e) {
            console.log('FETCH_HISTORY_APPOINTMENT_FAILED: ', e)
            dispatch({
                type: actionTypes.FETCH_HISTORY_APPOINTMENT_FAILED,
            })
        }
    }
}

// adminAction.js
// adminAction.js
export const saveBookingData = (data, callback) => {
    return (dispatch) => {
        try {
            dispatch({
                type: actionTypes.SAVE_BOOKING_DATA_SUCCESS,
                data: data
            });
            // Nếu có hàm callback truyền vào thì chạy nó
            if (callback) callback();
        } catch (e) {
            dispatch({ type: actionTypes.SAVE_BOOKING_DATA_FAILD });
        }
    }
}

export const fetchDetailHandbookById = (id) => {
    return async (dispatch, getState) => {
        try {
            let res = await getDetailHandbookByIdService(id);
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_DETAIL_HANDBOOK_SUCCESS,
                    dataHandbook: res.data
                });
            } else {
                dispatch({
                    type: actionTypes.FETCH_DETAIL_HANDBOOK_FAILED
                });
            }
        } catch (e) {
            console.log('fetchDetailHandbookById error: ', e);
            dispatch({
                type: actionTypes.FETCH_DETAIL_HANDBOOK_FAILED
            });
        }
    };
};

export const postChatWithAI = (userQuery) => {
    return async (dispatch, getState) => {
        try {
            let currentHistory = getState().admin.chatHistory || [];
            let newUserMsg = { role: 'user', content: userQuery };
            let updatedHistoryWithUser = [...currentHistory, newUserMsg];

            dispatch({
                type: actionTypes.UPDATE_CHAT_HISTORY,
                data: updatedHistoryWithUser
            });

            const language = getState().app.language;
            let res = await postChatWithAIService({ 
                userQuery: userQuery,
                language: language 
            });
            
            if (res && res.errCode === 0) {
                let newAiMsg = { role: 'assistant', content: res.data };
                let finalHistory = [...updatedHistoryWithUser, newAiMsg];

                localStorage.setItem('CHAT_HISTORY', JSON.stringify(finalHistory));

                dispatch({
                    type: actionTypes.UPDATE_CHAT_HISTORY,
                    data: finalHistory
                });
            } else {
                const language = getState().app.language;
                const errorMsgContent = language === LANGUAGES.VI 
                    ? 'Hệ thống AI đang bận hoặc hết hạn mức. Vui lòng thử lại sau!' 
                    : 'AI system is busy or quota exceeded. Please try again later!';
                    
                let errorMsg = { role: 'assistant', content: errorMsgContent };
                dispatch({
                    type: actionTypes.UPDATE_CHAT_HISTORY,
                    data: [...updatedHistoryWithUser, errorMsg]
                });
            }
        } catch (e) {
            console.log('postChatWithAI error: ', e);
            const language = getState().app.language;
            const errorMsgContent = language === LANGUAGES.VI 
                ? 'Đã có lỗi xảy ra khi kết nối tới AI.' 
                : 'An error occurred while connecting to AI.';

            let errorMsg = { role: 'assistant', content: errorMsgContent };
            dispatch({
                type: actionTypes.UPDATE_CHAT_HISTORY,
                data: [...getState().admin.chatHistory, errorMsg]
            });
        }
    };
};
//fe -> be -> store -> fe (khai bao kho chua cau tra loi chatwithai -khai bao cho no cai thang bao ve kho, cai thang bao ve ma di lay data tu cac xe container )
export const clearChatHistory = () => {
    return (dispatch) => {
        localStorage.removeItem('CHAT_HISTORY');
        dispatch({
            type: actionTypes.CLEAR_CHAT_HISTORY
        });
    };
};