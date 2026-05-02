export const emitToUserRoom = (io, userId, eventName, payload = {}) => {
    if (!io || !userId) return false;
    io.to(`user_room_${userId}`).emit(eventName, payload);
    return true;
};

export const emitNotification = (io, userId, payload = {}) => {
    return emitToUserRoom(io, userId, 'NEW_NOTIFICATION', payload);
};

export const emitUserOnlineStatus = (io, userId, status = 'online') => {
    if (!io || !userId) return false;
    io.emit('USER_STATUS_CHANGE', { userId, status });
    return true;
};
