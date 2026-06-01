import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../utils/constant';
import * as actions from "../../store/actions";
import { stopTimer } from '../../auth/TokenRefreshManager';
import { handleLogoutApi } from '../../services/userService';

class MobileSidebar extends Component {
    handleLogout = () => {
        stopTimer();
        localStorage.removeItem('token');
        handleLogoutApi().catch(() => { });
        this.props.processLogout();
        this.props.onClose();
    }

    isPathActive = (type) => {
        const pathName = window.location.pathname;
        if (type === 'HOME') return pathName === '/home' || pathName === '/';
        if (type === 'SELECT_SERVICE') return pathName === '/select-service';
        if (type === 'PROCESS_BOOKING') return pathName === '/process-booking';
        if (type === 'HANDBOOK') return pathName.includes('handbook') || pathName.includes('all-handbook');
        if (type === 'SETTINGS') return pathName === '/settings';
        if (type === 'MY_BOOKING') return pathName === '/my-booking';
        if (type === 'BOOKING_HISTORY') return pathName === '/booking-history';
        if (type === 'PRIVACY_POLICY') return pathName === '/privacy-policy';
        if (type === 'TERMS_OF_USE') return pathName === '/terms-of-use';
        if (type === 'AI_SUPPORT') return pathName === '/ai-support';
        return false;
    }

    render() {
        const { isOpen, onClose, userInfo, isLoggedIn, language, imageBase64, handleViewList } = this.props;

        return (
            <React.Fragment>
                <div className={`hm-mobile-sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
                <div className={`hm-mobile-sidebar ${isOpen ? 'open' : ''}`}>
                    <div className="sidebar-header">
                        <div className="sidebar-logo" onClick={() => { handleViewList('HOME'); onClose(); }}>
                            <div className="logo-icon">
                                <span className="logo-dot dot-1"></span>
                                <span className="logo-dot dot-2"></span>
                                <span className="logo-dot dot-3"></span>
                            </div>
                            <div className="brand-wrapper">
                                <span className="brand-name">BookingCare</span>
                                <span className="brand-sub">Đặt lịch khám bệnh</span>
                            </div>
                        </div>
                        <div className="close-sidebar-wrapper" onClick={onClose}>
                            <i className="fas fa-times"></i>
                        </div>
                    </div>

                    <div className="sidebar-content">
                        <div className="sidebar-profile-section">
                            {isLoggedIn ? (
                                <div className="user-profile-card">
                                    <div className="avatar-wrapper">
                                        {imageBase64 ? (
                                            <img src={imageBase64} alt="Avatar" />
                                        ) : (
                                            <i className="fas fa-user-circle"></i>
                                        )}
                                    </div>
                                    <div className="user-info">
                                        <div className="name">{userInfo?.firstName} {userInfo?.lastName}</div>
                                        <div className="email">{userInfo?.email}</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="login-prompt-card" onClick={() => { handleViewList('LOGIN'); onClose(); }}>
                                    <div className="avatar-wrapper">
                                        <i className="fas fa-user-circle"></i>
                                    </div>
                                    <div className="user-info">
                                        <div className="name">Khách hàng</div>
                                        <div className="email">Đăng nhập để nhận thêm ưu đãi</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <ul className="sidebar-menu">
                            <li className="menu-group-label">Chính</li>
                            <li className={`sidebar-item ${this.isPathActive('HOME') ? 'active' : ''}`} onClick={() => { handleViewList('HOME'); onClose(); }}>
                                <FormattedMessage id="homeheader.home" />
                            </li>
                            <li className={`sidebar-item ${this.isPathActive('SELECT_SERVICE') ? 'active' : ''}`} onClick={() => { handleViewList('SELECT_SERVICE'); onClose(); }}>
                                <FormattedMessage id="homeheader.booking" />
                            </li>
                            <li className={`sidebar-item ${this.isPathActive('PROCESS_BOOKING') ? 'active' : ''}`} onClick={() => { handleViewList('PROCESS_BOOKING'); onClose(); }}>
                                <FormattedMessage id="homeheader.process-booking" />
                            </li>
                            <li className={`sidebar-item ${this.isPathActive('HANDBOOK') ? 'active' : ''}`} onClick={() => { handleViewList('HANDBOOK'); onClose(); }}>
                                <FormattedMessage id="homeheader.handbook-nav" />
                            </li>

                            <li className="menu-group-label">Cá nhân</li>
                            {isLoggedIn && (
                                <React.Fragment>
                                    <li className={`sidebar-item ${this.isPathActive('SETTINGS') ? 'active' : ''}`} onClick={() => { handleViewList('SETTINGS'); onClose(); }}>
                                        <span>Chỉnh sửa thông tin</span>
                                    </li>
                                    <li className={`sidebar-item ${this.isPathActive('AI_SUPPORT') ? 'active' : ''}`} onClick={() => { handleViewList('AI_SUPPORT'); onClose(); }}>
                                        <span>Trợ lý AI</span>
                                    </li>
                                    {userInfo?.roleId !== 'R2' && (
                                        <React.Fragment>
                                            <li className={`sidebar-item ${this.isPathActive('MY_BOOKING') ? 'active' : ''}`} onClick={() => { handleViewList('MY_BOOKING'); onClose(); }}>
                                                <span>Lịch khám của tôi</span>
                                            </li>
                                            <li className={`sidebar-item ${this.isPathActive('BOOKING_HISTORY') ? 'active' : ''}`} onClick={() => { handleViewList('BOOKING_HISTORY'); onClose(); }}>
                                                <span>Lịch sử khám</span>
                                            </li>
                                        </React.Fragment>
                                    )}
                                </React.Fragment>
                            )}

                            <li className="menu-group-label">Thông tin</li>
                            <li className={`sidebar-item ${this.isPathActive('PRIVACY_POLICY') ? 'active' : ''}`} onClick={() => { handleViewList('PRIVACY_POLICY'); onClose(); }}>
                                <span>Chính sách bảo mật</span>
                            </li>
                            <li className={`sidebar-item ${this.isPathActive('TERMS_OF_USE') ? 'active' : ''}`} onClick={() => { handleViewList('TERMS_OF_USE'); onClose(); }}>
                                <span>Điều khoản sử dụng</span>
                            </li>

                            <div className="sidebar-actions">
                                {isLoggedIn ? (
                                    <button className="logout-btn" onClick={this.handleLogout}>
                                        <i className="fas fa-sign-out-alt"></i>
                                        <span>Đăng xuất</span>
                                    </button>
                                ) : (
                                    <button className="login-btn" onClick={() => { handleViewList('LOGIN'); onClose(); }}>
                                        <i className="fas fa-sign-in-alt"></i>
                                        <span>Đăng nhập</span>
                                    </button>
                                )}
                            </div>
                        </ul>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

// Kết nối Redux cho Sidebar
const mapStateToProps = state => ({
    language: state.app.language
});

const mapDispatchToProps = dispatch => ({
    changeLanguage: (lang) => dispatch(actions.changeLanguageApp(lang)),
    processLogout: () => dispatch(actions.processLogout()),
    openChatWithTab: (tab) => dispatch(actions.openChatWithTab(tab)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MobileSidebar);
