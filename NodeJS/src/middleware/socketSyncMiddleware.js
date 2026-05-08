import { getIO } from '../socket';

/**
 * Global WebSocket Sync Middleware
 * Theo dõi tất cả các requests có khả năng thay đổi dữ liệu (POST, PUT, DELETE)
 * Nếu thành công (errCode === 0), phát sự kiện 'system_data_changed' qua Socket.IO.
 */
const socketSyncMiddleware = (req, res, next) => {
    // Lưu lại hàm res.json gốc
    const originalJson = res.json;

    // Ghi đè res.json để "bắt" dữ liệu chuẩn bị gửi về client
    res.json = function (data) {
        // Chỉ xử lý các mutation methods
        if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
            
            // Loại trừ các API liên quan đến Auth / Chat / Search (những API không cần broadcast làm mới giao diện)
            const excludedPaths = ['/login', '/refresh-token', '/logout', '/chat-with-ai', '/save-chat-message', '/payos-webhook'];
            const isExcluded = excludedPaths.some(p => req.path.includes(p));

            if (!isExcluded && data && data.errCode === 0) {
                // Xác định entity dựa trên URL
                let entity = 'SYSTEM';
                const path = req.path.toLowerCase();

                if (path.includes('schedule')) entity = 'SCHEDULE';
                else if (path.includes('booking') || path.includes('appointment')) entity = 'BOOKING';
                else if (path.includes('specialty')) entity = 'SPECIALTY';
                else if (path.includes('clinic')) entity = 'CLINIC';
                else if (path.includes('handbook')) entity = 'HANDBOOK';
                else if (path.includes('user') || path.includes('patient') || path.includes('doctor') || path.includes('register')) entity = 'USER';

                try {
                    const io = getIO();
                    if (io) {
                        io.emit('system_data_changed', {
                            entity: entity,
                            method: req.method,
                            path: req.path,
                            timestamp: Date.now()
                        });
                        console.log(`[Socket] Broadcasted system_data_changed for entity: ${entity} (Path: ${req.path})`);
                    }
                } catch (error) {
                    console.error('[Socket Sync] Error broadcasting data change:', error);
                }
            }
        }

        // Trả quyền xử lý về hàm gốc để gửi response thực sự
        return originalJson.call(this, data);
    };

    next();
};

export default socketSyncMiddleware;
