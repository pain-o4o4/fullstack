import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../utils/constant';
import './HomeHeader.scss';
import * as actions from "../../store/actions";
import { path } from '../../utils/constant';
import { withRouter } from '../../components/Navigator';
import UserMenuPopup from '../HomePage/SubMenuForUser/UserMenuPopup';
import backgroundBanner from '../../assets/images/backgroundBanner.avif';
import GlobalSearch from '../../components/GlobalSearch/GlobalSearch';
import DoctorChat from './ChatComponents/DoctorChat';
import bannerService from '../../assets/images/bannerService.png';
import { stopTimer } from '../../auth/TokenRefreshManager';
import axios from 'axios';


class MobileSidebarInternal extends Component {
    handleLogout = () => {
        stopTimer();
        localStorage.removeItem('token');
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/logout`, {}, { withCredentials: true }).catch(() => { });
        this.props.processLogout();
        this.props.onClose();
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
                            <li className="sidebar-item" onClick={() => { handleViewList('HOME'); onClose(); }}>
                                <i className="fas fa-home"></i>
                                <FormattedMessage id="homeheader.home" />
                            </li>
                            <li className="sidebar-item" onClick={() => { handleViewList('SELECT_SERVICE'); onClose(); }}>
                                <i className="fas fa-calendar-alt"></i>
                                <FormattedMessage id="homeheader.booking" />
                            </li>
                            <li className="sidebar-item" onClick={() => { handleViewList('HANDBOOK'); onClose(); }}>
                                <i className="fas fa-book"></i>
                                <FormattedMessage id="homeheader.handbook-nav" />
                            </li>

                            <li className="menu-group-label">Cá nhân</li>
                            {isLoggedIn && (
                                <React.Fragment>
                                    <li className="sidebar-item" onClick={() => { handleViewList('SETTINGS'); onClose(); }}>
                                        <i className="fas fa-user-cog"></i>
                                        <span>Chỉnh sửa thông tin</span>
                                    </li>
                                    {userInfo?.roleId !== 'R2' && (
                                        <React.Fragment>
                                            <li className="sidebar-item" onClick={() => { handleViewList('MY_BOOKING'); onClose(); }}>
                                                <i className="fas fa-calendar-check"></i>
                                                <span>Lịch khám của tôi</span>
                                            </li>
                                            <li className="sidebar-item" onClick={() => { handleViewList('BOOKING_HISTORY'); onClose(); }}>
                                                <i className="fas fa-history"></i>
                                                <span>Lịch sử khám</span>
                                            </li>
                                        </React.Fragment>
                                    )}
                                </React.Fragment>
                            )}


                            <li className="menu-group-label">Thông tin</li>
                            <li className="sidebar-item" onClick={() => { handleViewList('PRIVACY_POLICY'); onClose(); }}>
                                <i className="fas fa-user-shield"></i>
                                <span>Chính sách bảo mật</span>
                            </li>
                            <li className="sidebar-item" onClick={() => { handleViewList('TERMS_OF_USE'); onClose(); }}>
                                <i className="fas fa-file-contract"></i>
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

                    <div className="sidebar-footer">
                        <div className="lang-switch">
                            <span className={language === LANGUAGES.VI ? 'active' : ''} onClick={() => this.props.changeLanguage(LANGUAGES.VI)}>VN</span>
                            <span className="divider">|</span>
                            <span className={language === LANGUAGES.EN ? 'active' : ''} onClick={() => this.props.changeLanguage(LANGUAGES.EN)}>EN</span>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

// Kết nối Redux cho Sidebar
const SidebarConnected = connect(
    state => ({ language: state.app.language }),
    dispatch => ({
        changeLanguage: (lang) => dispatch(actions.changeLanguageApp(lang)),
        processLogout: () => dispatch(actions.processLogout()),
        openChatWithTab: (tab) => dispatch(actions.openChatWithTab(tab)),
    })
)(MobileSidebarInternal);

class HomeHeader extends Component {
    constructor(props) {
        super(props);
        this.wrapperRef = React.createRef();
        this.state = {
            isOpenUserMenu: false,
            isOpenSearch: false,
            isOpenDoctorChat: false,
            isOpenSidebar: false,
        }
    }

    toggleSidebar = () => {
        const nextState = !this.state.isOpenSidebar;
        this.setState({ isOpenSidebar: nextState, isOpenSearch: false });
        document.body.style.overflow = nextState ? 'hidden' : 'unset';
    }

    toggleSearch = (isOpen) => {
        this.setState({ isOpenSearch: isOpen, isOpenSidebar: false });
        if (window.innerWidth <= 768) {
            document.body.style.overflow = isOpen ? 'hidden' : 'unset';
        }
    }

    toggleUserMenu = () => {
        this.setState({ isOpenUserMenu: !this.state.isOpenUserMenu });
    }

    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
        document.addEventListener('keydown', this.handleGlobalKeyDown);
    }

    componentDidUpdate(prevProps, prevState) {
        const isOverlayOpen = this.state.isOpenSidebar || this.state.isOpenSearch || this.props.isOpenDoctorChat;
        if (isOverlayOpen) {
            document.body.classList.add('overlay-open');
        } else {
            document.body.classList.remove('overlay-open');
        }
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
        document.removeEventListener('keydown', this.handleGlobalKeyDown);
        document.body.style.overflow = 'unset';
        document.body.classList.remove('overlay-open');
    }

    handleGlobalKeyDown = (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
            event.preventDefault();
            this.setState({ isOpenSearch: true });
        }
    }

    handleClickOutside = (event) => {
        if (this.wrapperRef && this.wrapperRef.current && !this.wrapperRef.current.contains(event.target)) {
            this.setState({ isOpenUserMenu: false });
        }
    }

    handleViewList = (type) => {
        const { navigate, isLoggedIn, userInfo } = this.props;
        if (type === 'LOGIN') {
            if (!isLoggedIn) {
                this.props.navigate(path.LOGIN);
            } else {
                if (userInfo?.roleId === 'R1') navigate('/system/user-manage');
                else if (userInfo?.roleId === 'R2') navigate('/doctor/manage-schedule');
                else navigate('/home');
            }
            return;
        }
        const routeMap = {
            SPECIALTY: path.ALL_SPECIALTY,
            CLINIC: path.ALL_CLINIC,
            PHYSICIAN: path.ALL_DOCTOR,
            HANDBOOK: path.ALL_HANDBOOK,

            HOME: path.HOMEPAGE,
            REGISTER: path.REGISTER,
            PROCESS_BOOKING: path.PROCESS_BOOKING,
            SETTINGS: path.SETTINGS,
            MY_BOOKING: path.MY_BOOKING,
            BOOKING_HISTORY: path.BOOKING_HISTORY,
            SELECT_SERVICE: path.SELECT_SERVICE,

            AI_SUPPORT: path.AI_SUPPORT,
            PRIVACY_POLICY: path.PRIVACY_POLICY,
            TERMS_OF_USE: path.TERMS_OF_USE,
        };
        if (routeMap[type]) navigate(routeMap[type]);
        else this.props.navigate('/home');
    }



    render() {
        let { isLoggedIn, userInfo } = this.props;
        let { isOpenUserMenu, isOpenSearch } = this.state;
        let imageBase64 = userInfo && userInfo.image ? userInfo.image : '';

        return (
            <React.Fragment>
                <div className="hm-header">
                    <div className="hm-header-pill">
                        <div className="hm-header-logo" onClick={() => this.handleViewList('HOME')}>
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

                        {isOpenSearch ? (
                            <GlobalSearch isOpen={isOpenSearch} onClose={() => this.toggleSearch(false)} />
                        ) : (
                            <div className="hm-header-nav">
                                <div className="hm-nav-list">
                                    <div className="hm-nav-item" onClick={() => this.handleViewList('HOME')}><span className="nav-link"><FormattedMessage id="homeheader.home" /></span></div>
                                    <div className="hm-nav-item" onClick={() => this.handleViewList('SELECT_SERVICE')}><span className="nav-link"><FormattedMessage id="homeheader.booking" /></span></div>
                                    <div className="hm-nav-item" onClick={() => this.handleViewList('PROCESS_BOOKING')}><span className="nav-link"><FormattedMessage id="homeheader.process-booking" /></span></div>
                                    <div className="hm-nav-item" onClick={() => this.handleViewList('HANDBOOK')}><span className="nav-link"><FormattedMessage id="homeheader.handbook-nav" /></span></div>
                                </div>
                            </div>
                        )}

                        <div className="hm-header-actions">
                            
                            {!isOpenSearch && (
                                <div className="nav-sign-in search-trigger" onClick={() => this.toggleSearch(true)}>
                                    <i className="fas fa-search search-icon"></i>
                                </div>
                            )}

                            <button id="btn-chat-doctor" className="hm-chat-doctor-btn" onClick={() => this.props.toggleChat()}>
                                <i className="far fa-comments"></i>
                                <span>Chat </span>
                                {this.props.totalUnreadCount > 0 && <span className="chat-badge-count">{this.props.totalUnreadCount}</span>}
                            </button>

                            <div className="user-menu-wrapper" ref={this.wrapperRef}>
                                <div className="mobile-sidebar-trigger" onClick={this.toggleSidebar}><i className="fas fa-bars"></i></div>
                                {!isLoggedIn ? (
                                    <div className="nav-sign-in desktop-only" onClick={() => this.handleViewList('LOGIN')}><i className="fas fa-user-circle auth-icon"></i><FormattedMessage id="homeheader.login" /></div>
                                ) : (
                                    <div className="nav-sign-in desktop-only" onClick={() => this.toggleUserMenu()}>{imageBase64 ? <img src={imageBase64} className="user-avatar" alt="Avatar" /> : <i className="fas fa-user-circle auth-icon"></i>}</div>
                                )}
                                {isOpenUserMenu && <UserMenuPopup handleViewList={this.handleViewList} />}
                            </div>
                        </div>
                    </div>
                </div>

                {this.props.isShowBanner === true && (
                    <div className="hm-hero" id="strona-glowna">
                        <div className="hm-hero-bg">
                            <div className="hero-bg-image" style={{ backgroundImage: `url(${bannerService})` }}></div>
                            <div className="hero-bg-overlay"></div>
                        </div>
                        <div className="hm-hero-inner">
                            <div className="hm-hero-text">
                                <div className="hero-badge"><span className="badge-dot"></span>Nền tảng Y tế Số #1 Việt Nam</div>
                                <h1 className="hero-headline">Chăm sóc sức khỏe<span className="hero-accent"> thông minh</span></h1>

                                <div className="hero-search-wrapper">
                                    <GlobalSearch isHero={true} />
                                </div>

                                <div className="hero-actions">
                                    <a href="tel:0966226404" className="call-button">
                                        <i className="fas fa-phone-alt"></i>
                                        Liên hệ ngay
                                    </a>
                                    <div className="hero-quick-tags">
                                        <span>Tìm kiếm nhanh:</span>
                                        <button onClick={() => this.handleViewList('SPECIALTY')}>Chuyên khoa</button>
                                        <button onClick={() => this.handleViewList('PHYSICIAN')}>Bác sĩ</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <DoctorChat isOpen={this.props.isOpenDoctorChat} onClose={() => this.props.toggleChat()} />

                <SidebarConnected
                    isOpen={this.state.isOpenSidebar}
                    onClose={this.toggleSidebar}
                    userInfo={userInfo}
                    isLoggedIn={isLoggedIn}
                    imageBase64={imageBase64}
                    handleViewList={this.handleViewList}
                />

                
                {(!isOpenSearch && !this.state.isOpenSidebar && !this.props.isOpenDoctorChat) && (
                    <div className="hm-bottom-nav">
                        <div className={`nav-item ${!isOpenSearch ? 'active' : ''}`} onClick={() => { this.handleViewList('HOME'); this.toggleSearch(false); }}>
                            <i className="fas fa-home"></i>
                            <span>Trang chủ</span>
                        </div>
                        <div className={`nav-item ${isOpenSearch ? 'active' : ''}`} onClick={() => this.toggleSearch(true)}>
                            <i className="fas fa-search"></i>
                            <span>Tìm kiếm</span>
                        </div>
                        <div className="nav-item chat-item" onClick={() => this.props.toggleChat()}>
                            <div className="icon-wrapper">
                                <i className="fas fa-comment-medical"></i>
                                {this.props.totalUnreadCount > 0 && <span className="badge">{this.props.totalUnreadCount}</span>}
                            </div>
                            <span>Hỗ trợ</span>
                        </div>
                        <div className="nav-item" onClick={this.toggleSidebar}>
                            {isLoggedIn && imageBase64 ? (
                                <img src={imageBase64} className="user-avatar-nav" alt="Profile" />
                            ) : (
                                <i className="fas fa-user-circle"></i>
                            )}
                            <span>Cá nhân</span>
                        </div>
                    </div>
                )}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
    userInfo: state.user.userInfo,
    isOpenDoctorChat: state.app.isOpenDoctorChat,
    totalUnreadCount: state.socket.totalUnreadCount
});

const mapDispatchToProps = dispatch => ({
    changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language)),
    toggleChat: () => dispatch(actions.toggleChat()),
    openChatWithTab: (tab) => dispatch(actions.openChatWithTab(tab)),
    processLogout: () => dispatch(actions.processLogout())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));