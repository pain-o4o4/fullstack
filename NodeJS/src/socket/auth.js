import JWTAction from '../middleware/JWTAction';

const decodeTokenWithoutVerification = (token) => {
    try {
        const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf8'));
        return decoded;
    } catch (error) {
        return null;
    }
};

const socketAuthMiddleware = (socket, next) => {
    try {
        const rawToken = socket.handshake?.auth?.token;
        const token = `${rawToken || ''}`.replace(/^Bearer\s+/i, '').trim();

        if (!token) {
            console.error('>>> Socket Auth Error: Missing token', {
                authKeys: Object.keys(socket.handshake?.auth || {}),
                queryKeys: Object.keys(socket.handshake?.query || {}),
                headerHasAuthorization: Boolean(socket.handshake?.headers?.authorization)
            });
            return next(new Error('TOKEN_MISSING'));
        }

        try {
            const decoded = JWTAction.verifyToken(token);
            if (!decoded || !decoded.id) {
                console.error('>>> Socket Auth Error: Invalid token', {
                    tokenPreview: token.slice(0, 16),
                    hasId: Boolean(decoded?.id)
                });
                return next(new Error('TOKEN_INVALID'));
            }

            socket.user = decoded;
            socket.authToken = token;
            return next();
        } catch (verifyError) {
            const fallbackDecoded = decodeTokenWithoutVerification(token);
            const fallbackUserId = fallbackDecoded?.id || fallbackDecoded?.userId || fallbackDecoded?.sub || null;
            const isExpired = verifyError?.name === 'TokenExpiredError' || `${verifyError?.message || ''}`.toLowerCase().includes('expired');
            const isMalformed = verifyError?.name === 'JsonWebTokenError' || `${verifyError?.message || ''}`.toLowerCase().includes('invalid token');
            const reason = isExpired ? 'TOKEN_EXPIRED' : isMalformed ? 'TOKEN_INVALID' : 'TOKEN_UNAUTHORIZED';

            console.error('>>> Socket Auth Verify Error:', {
                reason,
                userId: fallbackUserId,
                errorName: verifyError?.name || null,
                errorMessage: verifyError?.message || null
            });

            return next(new Error(reason));
        }
    } catch (error) {
        console.error('>>> Socket Auth Internal Error:', error);
        return next(new Error('TOKEN_UNAUTHORIZED'));
    }
};

export default socketAuthMiddleware;
