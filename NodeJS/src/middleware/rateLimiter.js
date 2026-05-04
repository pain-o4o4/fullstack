const rateLimit = require('express-rate-limit');

const searchRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minutes
    max: 60, // Limit each IP to 60 requests per `window` (here, per 1 minute)
    message: { errCode: 429, message: 'Quá nhiều yêu cầu, vui lòng thử lại sau.' },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export { searchRateLimiter };
