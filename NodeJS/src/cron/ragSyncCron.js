import cron from 'node-cron';
import ragSyncService from '../services/ragSyncService';

// CRON JOB: TỰ ĐỘNG ĐỒNG BỘ VECTORDB (RAG)

const initCronJobs = () => {
    // Cấu hình chạy vào lúc 2:00 sáng mỗi ngày
    // (Giờ server, thường là ít người truy cập nhất)
    // Cú pháp: 'phút giờ ngày tháng thứ'
    cron.schedule('0 2 * * *', async () => {
        console.log(`[CRON JOB] Bắt đầu tự động quét và đồng bộ VectorDB lúc: ${new Date().toLocaleString()}`);
        try {
            // Hàm syncAllToPinecone đã được thiết kế sẵn cơ chế "lũy tiến" 
            // (chỉ quét và đẩy những bản ghi chưa được đồng bộ dựa vào synced_registry.txt)
            // Do đó nó cực kỳ an toàn, không tốn token thừa và không bị lặp dữ liệu.
            const result = await ragSyncService.syncAllToPinecone();
            console.log("[CRON JOB] Kết quả đồng bộ:", result);
        } catch (error) {
            console.error("[CRON JOB] Lỗi trong quá trình đồng bộ tự động:", error);
        }
    });

    console.log("[CRON JOB] Đã khởi tạo tiến trình tự động đồng bộ VectorDB (Lịch: 2:00 AM hàng ngày).");
};

export default initCronJobs;
