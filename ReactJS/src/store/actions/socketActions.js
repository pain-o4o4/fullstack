import actionTypes from './actionTypes';
import { processLogout } from './userActions';
import { sendMessageApi } from '../../services/userService';
import { v4 as uuidv4 } from 'uuid';

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

export const updateUnreadCount = (count) => ({
    type: actionTypes.UPDATE_UNREAD_COUNT,
    count
});

export const socketTokenExpired = () => (dispatch) => {
    dispatch(socketDisconnect());
    dispatch(socketSetInstance(null));
    dispatch(notificationClear());
    dispatch(processLogout());
};

export const setNetworkStatus = (isOnline) => ({
    type: actionTypes.SET_NETWORK_STATUS,
    isOnline
});

export const addOfflineMessage = (message) => ({
    type: actionTypes.OFFLINE_MESSAGE_QUEUE_ADD,
    message
});

export const removeOfflineMessage = (tempId) => ({
    type: actionTypes.OFFLINE_MESSAGE_QUEUE_REMOVE,
    tempId
});

export const clearOfflineQueue = () => ({
    type: actionTypes.OFFLINE_MESSAGE_QUEUE_CLEAR
});

export const sendMessageResilient = (data) => async (dispatch, getState) => {
    const { socket: socketState } = getState();
    const isOnline = navigator.onLine;
    const tempId = data.tempId || uuidv4();

    const messageData = {
        ...data,
        tempId,
        createdAt: new Date().toISOString(),
        idempotencyKey: tempId // Use tempId as idempotency key
    };

    if (!isOnline) {
        dispatch(addOfflineMessage(messageData));
        return { offline: true, tempId };
    }

    try {
        let res = await sendMessageApi(messageData);
        if (res && res.errCode === 0) {
            return { success: true, data: res.data };
        } else {
            // If API fails but we are online, maybe server error or timeout
            // For now, let's also queue it if it's a network-related failure
            dispatch(addOfflineMessage(messageData));
            return { offline: true, tempId };
        }
    } catch (error) {
        dispatch(addOfflineMessage(messageData));
        return { offline: true, tempId };
    }
};

export const flushOfflineQueue = () => async (dispatch, getState) => {
    const { socket: socketState } = getState();
    const { offlineQueue } = socketState;

    if (offlineQueue.length === 0) return;

    // Process queue sequentially
    for (const msg of offlineQueue) {
        try {
            let res = await sendMessageApi(msg);
            if (res && res.errCode === 0) {
                dispatch(removeOfflineMessage(msg.tempId));
            }
        } catch (error) {
            console.error("Failed to flush message:", msg.tempId, error);
            // Keep in queue for next try
        }
    }
};
