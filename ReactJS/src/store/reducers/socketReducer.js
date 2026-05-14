import actionTypes from '../actions/actionTypes';

const initialState = {
    connected: false,
    socket: null,
    notifications: [],
    onlineUsers: [],
    totalUnreadCount: 0,
    lastUpdatedAt: null,
    isOnline: navigator.onLine,
    offlineQueue: []
};

const socketReducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case actionTypes.UPDATE_UNREAD_COUNT:
            return {
                ...state,
                totalUnreadCount: action.count,
                lastUpdatedAt: Date.now()
            };
        case actionTypes.SOCKET_CONNECT:
            return {
                ...state,
                connected: true,
                lastUpdatedAt: Date.now()
            };
        case actionTypes.SOCKET_DISCONNECT:
            return {
                ...state,
                connected: false,
                socket: null,
                lastUpdatedAt: Date.now()
            };
        case actionTypes.SOCKET_SET_INSTANCE:
            return {
                ...state,
                socket: action.socket || null,
                lastUpdatedAt: Date.now()
            };
        case actionTypes.NOTIFICATION_ADD:
            return {
                ...state,
                notifications: [action.notification, ...state.notifications].slice(0, 50),
                lastUpdatedAt: Date.now()
            };
        case actionTypes.NOTIFICATION_CLEAR:
            return {
                ...state,
                notifications: []
            };
        case actionTypes.USER_STATUS_CHANGE:
            return {
                ...state,
                onlineUsers: action.payload?.status === 'online'
                    ? Array.from(new Set([...state.onlineUsers, action.payload.userId]))
                    : state.onlineUsers.filter(userId => userId !== action.payload?.userId),
                lastUpdatedAt: Date.now()
            };
        case actionTypes.SET_NETWORK_STATUS:
            return {
                ...state,
                isOnline: action.isOnline
            };
        case actionTypes.OFFLINE_MESSAGE_QUEUE_ADD:
            return {
                ...state,
                offlineQueue: [...state.offlineQueue, action.message]
            };
        case actionTypes.OFFLINE_MESSAGE_QUEUE_REMOVE:
            return {
                ...state,
                offlineQueue: state.offlineQueue.filter(m => m.tempId !== action.tempId)
            };
        case actionTypes.OFFLINE_MESSAGE_QUEUE_CLEAR:
            return {
                ...state,
                offlineQueue: []
            };
        default:
            return state;
    }
};

export default socketReducer;
