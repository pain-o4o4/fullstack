import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../utils/constant';
import './HomeHeader.scss';
import { changeLanguageApp } from "../../store/actions";
import { path } from '../../utils/constant';
import { withRouter } from '../../components/Navigator';
import UserMenuPopup from '../HomePage/SubMenuForUser/UserMenuPopup';
import backgroundBanner from '../../assets/images/backgroundBanner.avif';
import GlobalSearch from '../../components/GlobalSearch/GlobalSearch';

class HomeHeader extends Component {
    constructor(props) {
        super(props);
        this.wrapperRef = React.createRef();
        this.state = {
            isOpenUserMenu: false,
            isOpenSearch: false,
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

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
        document.removeEventListener('keydown', this.handleGlobalKeyDown);
    }

    handleGlobalKeyDown = (event) => {
        // Ctrl+K or Cmd+K
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
                if (userInfo && userInfo.roleId === 'R1') {
                    navigate('/system/user-manage');
                } else if (userInfo && userInfo.roleId === 'R2') {
                    navigate('/doctor/manage-schedule');
                } else {
                    navigate('/home');
                }
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
            SETTINGS: path.SETTINGS,
            MY_BOOKING: path.MY_BOOKING,
            BOOKING_HISTORY: path.BOOKING_HISTORY,
            SELECT_SERVICE: path.SELECT_SERVICE,
        };

        if (routeMap[type]) {
            navigate(routeMap[type]);
        } else {
            this.props.navigate('/home');
        }
    }

    decodeBase64Buffer = (imgObj) => {
        if (imgObj && imgObj.data) {
            let bytes = new Uint8Array(imgObj.data);
            let binary = '';
            for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return binary;
        } else if (typeof imgObj === 'string') {
            return imgObj;
        }
        return '';
    };

    render() {
        let { isLoggedIn, userInfo } = this.props;
        let { isOpenUserMenu, isOpenSearch } = this.state;

        let imageBase64 = '';
        if (userInfo && userInfo.image) {
            imageBase64 = this.decodeBase64Buffer(userInfo.image);
        }

        return (
            <React.Fragment>
                <header className="hm-header">
                    <div className="hm-header-pill">
                        {/* Logo */}
                        <div className="hm-header-logo" onClick={() => this.handleViewList('HOME')}>
                            <div className="logo-icon">
                                <span className="logo-dot dot-1"></span>
                                <span className="logo-dot dot-2"></span>
                                <span className="logo-dot dot-3"></span>
                            </div>
                            <span className="brand-name">BookingCare</span>
                        </div>

                        {isOpenSearch ? (
                            <GlobalSearch
                                isOpen={isOpenSearch}
                                onClose={() => this.setState({ isOpenSearch: false })}
                            />
                        ) : (
                            <nav className="hm-header-nav">
                                <ul className="hm-nav-list">
                                    <li className="hm-nav-item" onClick={() => this.handleViewList('HOME')}>
                                        <span className="nav-link">
                                            <FormattedMessage id="homeheader.home" />
                                        </span>
                                    </li>

                                    {/* Đặt lịch - Normal link */}
                                    <li className="hm-nav-item" onClick={() => this.handleViewList('SELECT_SERVICE')}>
                                        <span className="nav-link">
                                            <FormattedMessage id="homeheader.booking" />
                                        </span>
                                    </li>

                                    <li className="hm-nav-item" onClick={() => this.handleViewList('HANDBOOK')}>
                                        <span className="nav-link">
                                            <FormattedMessage id="homeheader.handbook-nav" />
                                        </span>
                                    </li>

                                    {/* Removed search trigger from here */}
                                </ul>
                            </nav>
                        )}

                        {/* Right Actions */}
                        <div className="hm-header-actions">
                            {!isOpenSearch && (
                                <div className="nav-sign-in search-trigger" onClick={() => this.setState({ isOpenSearch: true })} style={{ padding: '9px', borderRadius: '50%' }}>
                                    <i className="fas fa-search" style={{ fontSize: '16px', opacity: 0.7 }}></i>
                                </div>
                            )}

                            <div className="user-menu-wrapper" ref={this.wrapperRef}>
                                {!isLoggedIn ? (
                                    <div className="nav-sign-in" onClick={() => this.handleViewList('LOGIN')}>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
                                            <path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                        <FormattedMessage id="homeheader.login" />
                                    </div>
                                ) : (
                                    <div className="nav-sign-in" onClick={() => this.toggleUserMenu()}>
                                        {imageBase64 ? (
                                            <img src={imageBase64} className="user-avatar" alt="Avatar" />
                                        ) : (
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
                                                <path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            </svg>
                                        )}
                                        {/* {userInfo && userInfo.firstName ? userInfo.firstName : <FormattedMessage id="homeheader.account" />} */}
                                    </div>
                                )}
                                {isOpenUserMenu && (
                                    <UserMenuPopup handleViewList={this.handleViewList} />
                                )}
                            </div>

                            <div className="hm-cta-btn" onClick={() => this.props.navigate('/ai-support')}>
                                <FormattedMessage id="homeheader.ai-support" />
                            </div>
                        </div>
                    </div>
                </header>

                {this.props.isShowBanner === true && (
                    <section className="hm-hero" id="strona-glowna">
                        <div className="hm-hero-content">
                            <div className="hm-hero-title">
                                <FormattedMessage id="homeheader.hero-title-1" /> <br />
                                <em><span className="hero-strong"><FormattedMessage id="homeheader.hero-title-2" /></span></em> <br />
                                <FormattedMessage id="homeheader.hero-title-3" /> <br />
                                <em><span className="hero-strong"><FormattedMessage id="homeheader.hero-title-4" /></span></em>
                            </div>
                            <div className="hm-hero-description">
                                <FormattedMessage id="homeheader.hero-desc" />
                            </div>
                            <div className="hm-hero-button">
                                <div className="hm-button" onClick={() => this.props.navigate('/ai-support')}>
                                    <FormattedMessage id="homeheader.ai-support" />
                                </div>
                            </div>
                        </div>
                        <div className="hm-hero-animation">
                            <div className="hero-bg-placeholder"
                                style={{
                                    backgroundImage: `url(${backgroundBanner})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            ></div>
                        </div>
                    </section>
                )}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));