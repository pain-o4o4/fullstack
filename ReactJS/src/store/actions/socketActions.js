import actionTypes from './actionTypes';
import { processLogout } from './userActions';

export const socketConnect = () => ({
    type: actionTypes.SOCKET_CONNECT
});

export const socketDisconnect = () => ({
    type: actionTypes.SOCKET_DISCONNECT
});

export const socketSetInstance = (socket) => ({
    type: actionTypes.SOCKET_SET_INSTANCE,
    socket
});

export const notificationAdd = (notification) => ({
    type: actionTypes.NOTIFICATION_ADD,
    notification
});

export const notificationClear = () => ({
    type: actionTypes.NOTIFICATION_CLEAR
});

export const userStatusChange = (payload) => ({
    type: actionTypes.USER_STATUS_CHANGE,
    payload
});

export const socketTokenExpired = () => (dispatch) => {
    dispatch(socketDisconnect());
    dispatch(socketSetInstance(null));
    dispatch(notificationClear());
    dispatch(processLogout());
};
