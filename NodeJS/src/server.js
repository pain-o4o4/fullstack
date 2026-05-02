import express from 'express';
import bodyParser from 'body-parser';
import configViewEngine from './config/viewEngine';
import initWebRoutes from './route/web';
import os from 'os';
import connectDB from '../config/connectDB';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import initSocket from './socket.js';

require('dotenv').config();

// 1. Express app được tạo ra --- Express - App
// 2. HTTP server được tạo từ Express --- Server - Express
// 3. Socket.io được gắn vào HTTP server --- Socket - Server
// 4. `io` được lưu lại để controller/service có thể dùng sau --- io - Server - App
const app = express();
app.use(cookieParser());
app.use(cors({
    origin: process.env.URL_REACT,
    credentials: true
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

configViewEngine(app);
initWebRoutes(app);
connectDB();

const server = http.createServer(app);
const io = initSocket(server);
app.set('io', io);

const port = process.env.PORT || 2004;
server.listen(port, '0.0.0.0', () => {
    const interfaces = os.networkInterfaces();
    const network = Object.values(interfaces)
        .flat()
        .find(i => i.family === 'IPv4' && !i.internal)?.address || 'localhost';

    console.log(`
=========================================
Server running:
Local:   http://localhost:${port}
Network: http://${network}:${port}
Socket.io: Enabled
=========================================
`);
});
