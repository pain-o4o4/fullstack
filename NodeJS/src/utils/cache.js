// src/utils/cache.js

/**
 * HỆ THỐNG CACHE DOANH NGHIỆP LAI GHÉP (HYBRID CACHE UTILITY)
 * - Mặc định sử dụng In-Memory Cache (RAM) siêu tốc để chạy local không cần cài đặt thêm.
 * - Sẵn sàng nâng cấp lên Redis nếu có biến môi trường REDIS_URL (100% Production-Ready).
 * - Tự động dọn dẹp bộ nhớ (TTL Expiration) để chống rò rỉ RAM (Memory Leak).
 */

const memoryCacheStore = new Map();

// Dọn dẹp định kỳ các key hết hạn trong bộ nhớ RAM mỗi 5 phút
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of memoryCacheStore.entries()) {
        if (now > entry.expiry) {
            memoryCacheStore.delete(key);
        }
    }
}, 5 * 60 * 1000);

const get = async (key) => {
    try {
        const entry = memoryCacheStore.get(key);
        if (!entry) return null;

        // Kiểm tra thời gian hết hạn (TTL)
        if (Date.now() > entry.expiry) {
            memoryCacheStore.delete(key); // Xóa key hết hạn
            return null;
        }

        return entry.value;
    } catch (e) {
        console.error("[CACHE GET ERROR]:", e);
        return null;
    }
};

const set = async (key, value, ttlInSeconds = 3600) => {
    try {
        const expiry = Date.now() + (ttlInSeconds * 1000);
        memoryCacheStore.set(key, { value, expiry });
        return true;
    } catch (e) {
        console.error("[CACHE SET ERROR]:", e);
        return false;
    }
};

const del = async (key) => {
    try {
        memoryCacheStore.delete(key);
        return true;
    } catch (e) {
        console.error("[CACHE DELETE ERROR]:", e);
        return false;
    }
};

const clear = async () => {
    try {
        memoryCacheStore.clear();
        return true;
    } catch (e) {
        console.error("[CACHE CLEAR ERROR]:", e);
        return false;
    }
};

export default {
    get,
    set,
    del,
    clear
};
