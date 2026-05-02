import { io } from 'socket.io-client';

let socketInstance = null;
let currentSocketToken = '';

const normalizeToken = (token) => {
    const rawToken = `${token || ''}`.trim();
    if (!rawToken) return '';
    return rawToken.replace(/^Bearer\s+/i, '').trim();
};

export const getSocketClient = (authToken) => {
    const nextToken = normalizeToken(authToken);

    if (socketInstance && currentSocketToken === nextToken) {
        return socketInstance;
    }

    if (socketInstance) {
        socketInstance.removeAllListeners();
        socketInstance.disconnect();
        socketInstance = null;
    }

    currentSocketToken = nextToken;
    socketInstance = io(process.env.REACT_APP_BACKEND_URL, {
        autoConnect: false,
        transports: ['websocket', 'polling'],
        withCredentials: true,
        forceNew: true,
        auth: {
            token: `Bearer ${nextToken}`
        }
    });

    return socketInstance;
};

export const updateSocketAuth = (authToken) => {
    if (!socketInstance) return null;
    currentSocketToken = normalizeToken(authToken);
    socketInstance.auth = { token: `Bearer ${currentSocketToken}` };
    return socketInstance;
};

export const destroySocketClient = () => {
    if (!socketInstance) return;
    socketInstance.removeAllListeners();
    socketInstance.disconnect();
    socketInstance = null;
    currentSocketToken = '';
};

export default getSocketClient;
{/*
1. Singleton là gì? (Khái niệm "Độc bản")
Singleton là một mẫu thiết kế (Design Pattern) nhằm đảm bảo rằng: 
Một Class/Đối tượng chỉ có duy nhất một thực thể (Instance) được 
tạo ra trong suốt vòng đời của ứng dụng.

Hãy tưởng tượng trong nhà bạn:

Không phải Singleton: Mỗi phòng có một cái đồng hồ riêng. Phòng 
khách chạy nhanh, phòng ngủ chạy chậm, chúng không đồng nhất.

Singleton: Cả nhà chỉ có duy nhất một cái đồng hồ chủ treo ở giữa 
nhà. Tất cả các phòng đều nhìn vào đúng cái đồng hồ đó để biết giờ. 
Dù bạn ở đâu, giờ giấc luôn là một.

2. Tại sao client.js phải dùng Singleton?
Trong ứng dụng BookingCare, nếu bạn không dùng Singleton mà mỗi lần 
cần Chat hay Thông báo bạn lại tạo một kết nối mới (new socket), 
chuyện gì sẽ xảy ra?

Lãng phí tài nguyên: Server phải gồng gánh hàng chục kết nối thừa 
thãi từ cùng một người dùng.

Loạn tin nhắn: Tin nhắn từ bác sĩ có thể bay vào "đường ống 1" nhưng 
bạn đang lắng nghe ở "đường ống 2". Kết quả là bạn không nhận được gì cả.

Rò rỉ bộ nhớ: Các kết nối cũ không bị ngắt sẽ làm trình duyệt của người dùng bị lag.

3. Singleton trong code của bạn hoạt động thế nào?
Hãy nhìn lại logic trong file client.js mà bạn đã đọc:

JavaScript
let socketInstance = null; // Đây là "cái đồng hồ duy nhất" của chúng ta

export const getSocketClient = (authToken) => {
    // 1. KIỂM TRA: Nếu đã có máy rồi, trả về máy cũ ngay
    if (socketInstance) {
        return socketInstance; 
    }

    // 2. KHỞI TẠO: Nếu chưa có (lần đầu tiên), mới tạo máy mới
    socketInstance = io(process.env.REACT_APP_BACKEND_URL, { ... });

    return socketInstance;
};
Cơ chế:

Lần đầu gọi getSocketClient: Nó thấy socketInstance đang là null -> Nó tạo mới.

Lần thứ 2, 3... gọi getSocketClient: Nó thấy socketInstance đã có giá trị rồi 
-> Nó không tạo thêm mà chỉ đưa đúng cái cũ cho bạn dùng.

4. Singleton và Class Component của bạn
Vì bạn dùng React Class, Singleton cực kỳ hữu dụng:

Khi bạn ở trang Dashboard (Class A), bạn gọi getSocketClient để lấy kết nối.

Khi bạn chuyển sang trang Lịch khám (Class B), bạn lại gọi getSocketClient.

Nhờ Singleton, cả hai trang này đều đang dùng chung một "sợi dây" duy nhất nối đến 
Server. Khi Server gửi thông báo, dù bạn đang ở Class nào, bạn cũng nhận được ngay
lập tức vì tất cả đều dùng chung một nguồn.
        
        
Singleton = Duy nhất 1.

Mục tiêu: Tiết kiệm và đồng bộ.

Trong Socket: Đảm bảo từ lúc Đăng nhập đến lúc Đăng xuất, bạn chỉ có đúng 1 đường dây liên lạc với Server.       
*/ }