import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import './ResilienceBanner.scss';

class ResilienceBanner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            message: '',
            type: 'warning' // 'warning', 'success', 'error'
        };
    }

    componentDidMount() {
        window.addEventListener('online', this.handleOnline);
        window.addEventListener('offline', this.handleOffline);
    }

    componentWillUnmount() {
        window.removeEventListener('online', this.handleOnline);
        window.removeEventListener('offline', this.handleOffline);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.offlineQueueLength !== this.props.offlineQueueLength && this.props.offlineQueueLength > 0) {
            this.showBanner(
                this.props.language === 'vi' 
                    ? `Đang chờ kết nối... ${this.props.offlineQueueLength} tin nhắn chưa gửi.` 
                    : `Waiting for connection... ${this.props.offlineQueueLength} unsent messages.`,
                'warning'
            );
        }
    }

    handleOnline = () => {
        this.props.setNetworkStatus(true);
        this.showBanner(
            this.props.language === 'vi' ? 'Đã khôi phục kết nối. Đang đồng bộ...' : 'Connection restored. Syncing...',
            'success'
        );
        this.props.flushOfflineQueue();
        
        setTimeout(() => {
            if (this.props.offlineQueueLength === 0) {
                this.setState({ isVisible: false });
            }
        }, 3000);
    };

    handleOffline = () => {
        this.props.setNetworkStatus(false);
        this.showBanner(
            this.props.language === 'vi' ? 'Mất kết nối internet. Hệ thống đang chạy ở chế độ ngoại tuyến.' : 'No internet connection. System running in offline mode.',
            'warning'
        );
    };

    showBanner = (message, type) => {
        this.setState({
            message,
            type,
            isVisible: true
        });
    };

    render() {
        const { isVisible, message, type } = this.state;
        const { isOnline } = this.props;

        if (!isVisible && isOnline) return null;

        return (
            <div className={`resilience-banner ${type} ${isVisible ? 'slide-down' : 'slide-up'}`}>
                <div className="banner-content">
                    {type === 'warning' && <i className="fas fa-exclamation-triangle"></i>}
                    {type === 'success' && <i className="fas fa-check-circle"></i>}
                    <span className="banner-text">{message}</span>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isOnline: state.socket.isOnline,
    offlineQueueLength: state.socket.offlineQueue.length,
    language: state.app.language
});

const mapDispatchToProps = dispatch => ({
    setNetworkStatus: (isOnline) => dispatch(actions.setNetworkStatus(isOnline)),
    flushOfflineQueue: () => dispatch(actions.flushOfflineQueue())
});

export default connect(mapStateToProps, mapDispatchToProps)(ResilienceBanner);
