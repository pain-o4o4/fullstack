import { Server } from 'socket.io';
import socketAuthMiddleware from './socket/auth';
import registerSocketHandlers from './socket';

let ioInstance = null;
// - server.js gọi `initSocket(server)`
// - socket.js tạo `new Server(...)`
// - socket.js gắn middleware auth
// - socket.js đăng ký sự kiện `connection`
export const initSocket = (httpServer) => {
    if (ioInstance) {
        return ioInstance;
    }

    ioInstance = new Server(httpServer, {
        cors: {
            origin: process.env.URL_REACT,
            methods: ['GET', 'POST'],
            credentials: true
        },
        pingTimeout: 60000,
        transports: ['websocket', 'polling']
    });

    ioInstance.use((socket, next) => {
        try {
            return socketAuthMiddleware(socket, next);
        } catch (error) {
            console.error('>>> Socket middleware error:', error);
            return next(new Error('Unauthorized'));
        }
    });

    ioInstance.on('connection', (socket) => {
        registerSocketHandlers(ioInstance, socket);
    });

    return ioInstance;
};

export const getIO = () => ioInstance;

export default initSocket;
