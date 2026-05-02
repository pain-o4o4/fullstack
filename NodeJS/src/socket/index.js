const registerSocketHandlers = (io, socket) => {
    const userId = socket.user?.id;

    if (userId) {
        socket.join(`user_room_${userId}`);
    }

    socket.on('disconnect', () => {
        // placeholder for status updates
    });
};

export default registerSocketHandlers;
