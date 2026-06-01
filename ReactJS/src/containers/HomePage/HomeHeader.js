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
import MobileSidebar from './MobileSidebar';

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
        if (routeMap[type]) {
            if (type === 'HOME') {
                window.location.href = routeMap[type];
            } else {
                navigate(routeMap[type]);
            }
        }
        else window.location.href = '/home';
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

                <MobileSidebar
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