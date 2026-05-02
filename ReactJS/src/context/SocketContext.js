import React, { Component, createContext } from 'react';
import { connect } from 'react-redux';
import getSocketClient, { destroySocketClient, updateSocketAuth } from '../socket/client';
import * as actions from '../store/actions';

export const SocketContext = createContext(null);

const decodeJwtPayload = (token) => {
    try {
        const normalized = `${token || ''}`.replace(/^Bearer\s+/i, '').trim();
        if (!normalized) return null;
        const payload = normalized.split('.')[1];
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const json = atob(base64);
        return JSON.parse(json);
    } catch (error) {
        return null;
    }
};

const isTokenExpired = (token) => {
    const decoded = decodeJwtPayload(token);
    if (!decoded?.exp) return false;
    return Date.now() >= decoded.exp * 1000;
};

class SocketProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            socket: null
        };
        this.socketRef = null;
    }

    componentDidMount() {
        this.manageSocketConnection();
    }

    componentDidUpdate(prevProps) {
        // Kiểm tra nếu trạng thái login hoặc token thay đổi thì cập nhật socket
        if (prevProps.isLoggedIn !== this.props.isLoggedIn || prevProps.reduxToken !== this.props.reduxToken) {
            this.manageSocketConnection();
        }
    }

    componentWillUnmount() {
        this.disconnectSocket();
    }

    disconnectSocket = () => {
        if (this.socketRef) {
            this.socketRef.removeAllListeners();
            this.socketRef.disconnect();
            this.socketRef = null;
        }
        destroySocketClient();
        this.setState({ socket: null });
        this.props.socketDisconnect();
        this.props.socketSetInstance(null);
    }

    manageSocketConnection = () => {
        const { isLoggedIn, reduxToken } = this.props;
        const normalizedToken = `${reduxToken || ''}`.replace(/^Bearer\s+/i, '').trim();

        // Nếu không login hoặc không có token -> Ngắt kết nối
        if (!isLoggedIn || !normalizedToken) {
            this.disconnectSocket();
            return;
        }

        // Kiểm tra hết hạn token
        if (isTokenExpired(normalizedToken)) {
            console.warn('[Socket] Token expired. Waiting for new session.');
            this.props.socketTokenExpired();
            this.disconnectSocket();
            return;
        }

        // Khởi tạo hoặc cập nhật socket client
        const client = getSocketClient(normalizedToken);
        this.socketRef = client;
        updateSocketAuth(normalizedToken);

        const handleConnect = () => {
            this.props.socketConnect();
            this.props.socketSetInstance(client);
            console.log('[Socket] Connected:', client.id);
        };

        const handleDisconnect = () => {
            this.props.socketDisconnect();
        };

        const handleConnectError = (error) => {
            const message = `${error?.message || ''}`.toLowerCase();
            console.error('[Socket] Connect error:', error?.message);

            if (message.includes('token_expired') || message.includes('jwt expired')) {
                this.props.socketTokenExpired();
                this.disconnectSocket();
            }
        };

        client.removeAllListeners();
        client.auth = { token: `Bearer ${normalizedToken}` };
        client.on('connect', handleConnect);
        client.on('disconnect', handleDisconnect);
        client.on('connect_error', handleConnectError);

        if (!client.connected) {
            client.connect();
        } else {
            handleConnect();
        }

        this.setState({ socket: client });
    }

    render() {
        return (
            <SocketContext.Provider value={this.state.socket}>
                {this.props.children}
            </SocketContext.Provider>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        reduxToken: state.user.userInfo?.token || ''
    };
};

const mapDispatchToProps = dispatch => {
    return {
        socketConnect: () => dispatch(actions.socketConnect()),
        socketDisconnect: () => dispatch(actions.socketDisconnect()),
        socketSetInstance: (instance) => dispatch(actions.socketSetInstance(instance)),
        socketTokenExpired: () => dispatch(actions.socketTokenExpired()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SocketProvider);
