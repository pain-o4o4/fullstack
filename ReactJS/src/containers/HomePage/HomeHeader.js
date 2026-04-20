import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomeHeader.scss';
import { FormattedMessage } from 'react-intl';
import icon_icons from '../../assets/images/icon_icons.svg';
import search from '../../assets/images/search.svg';
import user_login from '../../assets/images/user_login.svg';
import translate from '../../assets/images/translate.svg';

import ModalSearchHeader from './ModalSearchHeader.js';
import { changeLanguageApp } from "../../store/actions";
import { path } from '../../utils/constant';
import { withRouter } from '../../components/Navigator';
import UserMenuPopup from '../HomePage/SubMenuForUser/UserMenuPopup';
class HomeHeader extends Component {
    constructor(props) {
        super(props);
        this.wrapperRef = React.createRef();
        this.state = {
            isShowSearch: false,
            isOpenUserMenu: false,
        }
    }
    toggleUserMenu = () => {
        this.setState({ isOpenUserMenu: !this.state.isOpenUserMenu });
    }
    toggleShowSearchModal = () => {
        this.setState({
            isShowSearch: !this.state.isShowSearch
        });
    }
    changeLanguage = () => {
        let { language } = this.props;
        let nextLanguage = language === 'vi' ? 'en' : 'vi';
        this.props.changeLanguageAppRedux(nextLanguage);
    }
    // Hàm bật/tắt search
    handleToggleSearch = () => {
        this.setState({
            isShowSearch: true
        });
    }
    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        // Thêm check this.wrapperRef.current để chắc chắn nó đã tồn tại
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
            HOME: path.HOMEPAGE,
            REGISTER: path.REGISTER,
            SETTINGS: path.SETTINGS,
            MY_BOOKING: path.MY_BOOKING,
            BOOKING_HISTORY: path.BOOKING_HISTORY,
        };

        if (routeMap[type]) {
            navigate(routeMap[type]);
        } else {
            this.props.navigate('/home');
        }
    }
    render() {
        console.log(">>> check props: ", this.props.userInfo);
        let { isLoggedIn, userInfo } = this.props;
        return (
            <React.Fragment>

                <div className='home-header-container'>
                    <div className='home-header-content'>
                        <div className='left-content'>
                            <span className='brand-name'
                                onClick={() => this.handleViewList('HOME')}
                            >BookingCare</span>
                        </div>
                        <div className='center-content'>
                            {this.state.isShowSearch ? (
                                <ModalSearchHeader
                                    toggleFromParent={this.toggleShowSearchModal}
                                />
                            ) : (
                                <React.Fragment>
                                    <div className="menu-content">
                                        <div className='child-content'
                                            onClick={() => this.handleViewList('SPECIALTY')}
                                        >
                                            <FormattedMessage id="homeheader.MedicalSpecialty" defaultMessage="Medical Specialty" />
                                        </div>
                                        <div className='child-content'
                                            onClick={() => this.handleViewList('CLINIC')}
                                        >
                                            <FormattedMessage id="homeheader.MedicalFacility" defaultMessage="Medical Facility" />
                                        </div>
                                        <div className='child-content'
                                            onClick={() => this.handleViewList('PHYSICIAN')}
                                        >
                                            <FormattedMessage id="homeheader.Physician" defaultMessage="Physician" />
                                        </div>
                                        <div className='child-content'
                                            onClick={() => this.handleViewList('SERVICE')}

                                        >
                                            <FormattedMessage id="homeheader.ServicePackage" defaultMessage="Service Package" />
                                        </div>
                                    </div>
                                </React.Fragment>
                            )}
                        </div>
                        <div className="right-content">
                            <div className="user-menu-wrapper" ref={this.wrapperRef}>
                                {!isLoggedIn ? <div className="login-group"
                                    onClick={() => this.toggleUserMenu()}
                                >
                                    <span className="text-login">
                                        <FormattedMessage id="header.login" defaultMessage="Log in" />
                                    </span>
                                </div> :
                                    <span className='welcome'
                                        onClick={() => this.toggleUserMenu()}
                                    >
                                        <span className="welcome-text">
                                            <FormattedMessage id="homeheader.welcome" defaultMessage="Welcome, " />
                                            {userInfo && userInfo.firstName ? userInfo.firstName : ''}
                                        </span>
                                        <img src={userInfo.image || icon_icons} className="icon-user" alt="User" />
                                    </span>
                                }
                                {this.state.isOpenUserMenu && (
                                    <UserMenuPopup
                                        handleViewList={this.handleViewList}
                                    />
                                )}
                            </div>
                            <div className="icon-btn" onClick={() => this.handleToggleSearch()}>
                                <img src={search} className="icon-search" alt="icon-search" />
                            </div>
                            <div className="translate-wrapper" onClick={() => this.changeLanguage()}>
                                <img src={translate} className="icon-translate" alt="Translate" />
                            </div>
                        </div>
                    </div>
                </div>

                {this.props.isShowBanner === true && <div className="home-header-line">
                    <div className="clinical-trial-section">
                        <div className="clinical-trial-container">
                            <div className="enrolling-badge">
                                300+ studies actively enrolling
                            </div>
                            <h1 className="main-title">
                                Find your perfect <span>clinical trial match</span>
                            </h1>

                            {/* Mô tả nhỏ */}
                            <p className="subtitle">
                                Join 2+ million people shaping the future of healthcare.
                            </p>
                        </div>
                    </div>
                    {this.props.isShowBanner === false && <div className="welcome-container">
                        <div className="services-grid">
                            {[
                                { icon: "https://img.icons8.com/color/96/doctor-male.png", title: "Search the service/<br />consultant" },
                                { icon: "https://img.icons8.com/color/96/calendar.png", title: "Book an appointment" },
                                { icon: "https://img.icons8.com/color/96/stethoscope.png", title: "Consult online/<br />Visit in-person" },
                                { icon: "https://img.icons8.com/color/96/doctor-male.png", title: "Search the service/<br />consultant" },
                                { icon: "https://img.icons8.com/color/96/calendar.png", title: "Book an appointment" },
                                { icon: "https://img.icons8.com/color/96/stethoscope.png", title: "Consult online/<br />Visit in-person" }
                            ].map((item, index) => (
                                <div key={index} className="service-card">
                                    <div className="icon-circle">
                                        <img src={item.icon} alt="Service" />
                                    </div>
                                    <h3 dangerouslySetInnerHTML={{ __html: item.title }} />
                                </div>
                            ))}
                        </div>

                    </div>}
                </div>}

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

// export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader);
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));

{/* <img src={menu} className="menu-icon" alt="Menu" /> */ }