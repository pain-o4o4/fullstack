// Dùng require thì phải có ngoặc nhọn { PayOS }
const { PayOS } = require('@payos/node');
const fetch = require('node-fetch');

if (!global.fetch) {
    global.fetch = fetch;
}

const payOS = new PayOS(
    process.env.PAYOS_CLIENT_ID,
    process.env.PAYOS_API_KEY,
    process.env.PAYOS_CHECKSUM_KEY
);

// Để dùng được với lệnh "import payOS from..." ở file Service
export default payOS;
