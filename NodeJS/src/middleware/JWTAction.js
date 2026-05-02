import jwt from 'jsonwebtoken';
require('dotenv').config();

const resolveAccessSecret = () => process.env.JWT_SECRET || process.env.JWT_REFRESH_SECRET || '';
const resolveRefreshSecret = () => process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || '';

if (!process.env.JWT_SECRET) {
    console.warn('>>> JWT_SECRET is missing. Using fallback secret for access token verification.');
}
if (!process.env.JWT_REFRESH_SECRET) {
    console.warn('>>> JWT_REFRESH_SECRET is missing. Using fallback secret for refresh token verification.');
}

const createJWT = (payload) => {
    const key = resolveAccessSecret();
    let token = null;
    try {
        token = jwt.sign(payload, key, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });
    } catch (e) {
        console.error('>>> createJWT failed:', e.message);
    }
    return token;
};

const verifyToken = (token) => {
    const key = resolveAccessSecret();
    let data = null;
    try {
        data = jwt.verify(token, key);
    } catch (e) {
        console.error('>>> verifyToken failed:', e.message);
        throw e;
    }
    return data;
};

const createRefreshToken = (payload) => {
    const key = resolveRefreshSecret();
    let token = null;
    try {
        token = jwt.sign(payload, key, {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
        });
    } catch (e) {
        console.error('>>> createRefreshToken failed:', e.message);
    }
    return token;
};

const verifyRefreshToken = (token) => {
    const key = resolveRefreshSecret();
    let data = null;
    try {
        data = jwt.verify(token, key);
    } catch (e) {
        console.error('>>> verifyRefreshToken failed:', e.message);
    }
    return data;
};

export default {
    createJWT,
    verifyToken,
    createRefreshToken,
    verifyRefreshToken
};
