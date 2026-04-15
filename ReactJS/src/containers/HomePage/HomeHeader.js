import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomeHeader.scss';
import menu from '../../assets/images/menu.svg';
import { FormattedMessage } from 'react-intl';
import { User, MagnifyingGlass } from "@phosphor-icons/react"
import search from '../../assets/images/search.svg';
import user_login from '../../assets/images/user_login.svg';
import translate from '../../assets/images/translate.svg';
// Đổi h thành H ở cả 2 chỗ cho đồng bộ
import ModalSearchHeader from './ModalSearchHeader.js';
import { LANGUAGES } from '../../utils/constant';
import { changeLanguageApp } from "../../store/actions";
import actionTypes from '../../store/actions/actionTypes';
import { withRouter } from 'react-router';
class HomeHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowSearch: false // Mặc định là đóng search
        }
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
    returnToHome = () => {
        if (this.props.history) {
            this.props.history.push(`/home`);
        }
    }

    render() {
        console.log(">>> check props: ", this.props.userInfo);
        return (
            <React.Fragment>

                <div className='home-header-container'>
                    <div className='home-header-content'>
                        <div className='left-content'>
                            <div className='header-logo'
                                onClick={() => this.returnToHome()}
                            ></div>
                        </div>
                        <div className='center-content'>
                            {this.state.isShowSearch ? (
                                /* KHI BẬT SEARCH: Chỉ vẽ Component Search */
                                <ModalSearchHeader
                                    toggleFromParent={this.toggleShowSearchModal}
                                />
                            ) : (
                                /* KHI TẮT SEARCH: Chỉ vẽ 4 khối div Menu */
                                <React.Fragment>
                                    <div className="menu-content">
                                        <div className='child-content'
                                        // onClick={()=>{}}
                                        >
                                            <FormattedMessage id="homeheader.MedicalSpecialty" defaultMessage="Medical Specialty" />
                                        </div>
                                        <div className='child-content'>
                                            <FormattedMessage id="homeheader.MedicalFacility" defaultMessage="Medical Facility" />
                                        </div>
                                        <div className='child-content'>
                                            <FormattedMessage id="homeheader.Physician" defaultMessage="Physician" />
                                        </div>
                                        <div className='child-content'>
                                            <FormattedMessage id="homeheader.ServicePackage" defaultMessage="Service Package" />
                                        </div>
                                    </div>
                                </React.Fragment>
                            )}
                        </div>
                        <div className="right-content">
                            <div className="login-group">
                                <img src={user_login} className="icon-user" alt="User" />
                                <span className="text-login">

                                    <FormattedMessage id="header.login" defaultMessage="Log in" />
                                </span>
                            </div>
                            <img src={search} className="icon-search" alt="icon-search" onClick={() => this.handleToggleSearch()} />
                            <img
                                src={translate}
                                className="icon-translate"
                                alt="Translate"
                                onClick={() => this.changeLanguage()}
                            />
                        </div>
                    </div>
                </div>

                {this.props.isShowBanner === true && <div className="home-header-line">
                    <div className="clinical-trial-section">
                        <div className="clinical-trial-container">
                            <div className="enrolling-badge">
                                <span className="icon">👥</span>
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
                    <div className="welcome-container">
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

                    </div>
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
        // Tạo một cái tên hàm 'changeLanguageAppRedux' để Duy dùng trong Class
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language))
    };
};

// export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader);
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));

{/* <img src={menu} className="menu-icon" alt="Menu" /> */ }