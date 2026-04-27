import jwt from "jsonwebtoken";
require("dotenv").config();

const createJWT = (payload) => {
    let key = process.env.JWT_SECRET;
    let token = null;
    try {
        token = jwt.sign(payload, key, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });
    } catch (e) {
        console.log(e);
    }
    return token;
};

const verifyToken = (token) => {
    let key = process.env.JWT_SECRET;
    let data = null;
    try {
        data = jwt.verify(token, key);
    } catch (e) {
        // console.log(e);
    }
    return data;
};

// REFRESH TOKEN FUNCTIONS

const createRefreshToken = (payload) => {
    let key = process.env.JWT_REFRESH_SECRET;
    let token = null;
    try {
        token = jwt.sign(payload, key, {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
        });
    } catch (e) {
        console.log(e);
    }
    return token;
};

const verifyRefreshToken = (token) => {
    let key = process.env.JWT_REFRESH_SECRET;
    let data = null;
    try {
        data = jwt.verify(token, key);
    } catch (e) {
        // console.log(e);
    }
    return data;
};

export default {
    createJWT,
    verifyToken,
    createRefreshToken,
    verifyRefreshToken
};
