import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import * as actions from "../../store/actions";
import { USER_ROLE } from '../../utils';
import { adminMenu, doctorMenu, patientMenu } from '../Header/menuApp';
import translate from '../../assets/images/translate.svg';
import './SystemLayout.scss';
import icon_icons from '../../assets/images/icon_icons.svg';
import { CommonUtils } from '../../utils';
import { editUserService, getAllUsers } from '../../services/userService';
import { toast } from 'react-toastify';
const decodeBase64Buffer = (imgObj) => {
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
class SystemLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuApp: [],
            isOpenSidebar: false
        };
    }

    componentDidMount() {
        this.updateMenu();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.userInfo !== this.props.userInfo) {
            this.updateMenu();
        }
    }

    updateMenu = () => {
        let { userInfo } = this.props;
        let menu = [];
        if (userInfo && userInfo.roleId) {
            let role = userInfo.roleId;
            if (role === USER_ROLE.ADMIN) {
                menu = adminMenu;
            } else if (role === USER_ROLE.DOCTOR) {
                menu = doctorMenu;
            } else if (role === USER_ROLE.PATIENT) {
                menu = patientMenu;
            }
        }
        this.setState({ menuApp: menu });
    };
    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let { userInfo } = this.props;

            if (!userInfo) return;

            let userData = {
                id: userInfo.id,
                email: userInfo.email,
                password: 'HIDDEN_PASSWORD',
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                address: userInfo.address,
                phonenumber: userInfo.phonenumber,
                gender: userInfo.gender || 'M', // Fallback an toàn phòng khi chưa logout/login lại
                roleId: userInfo.roleId || 'R1', // Fallback
                positionId: userInfo.positionId || 'P0', // Fallback
                avatar: base64
            };

            try {
                let res = await editUserService(userData);
                if (res && res.errCode === 0) {
                    let updatedUserInfo = { ...userInfo, image: base64, gender: userData.gender, positionId: userData.positionId };
                    this.props.updateUserSuccess(updatedUserInfo);
                    console.log("Cập nhật ảnh đại diện thành công!");
                } else {
                    console.log(res.errMessage || "Lỗi cập nhật ảnh đại diện!");
                }
            } catch (error) {
                console.log(error);
                console.log("Lỗi cập nhật ảnh đại diện!");
            }
        }
        event.target.value = ''; // Reset input
    }
    changeLanguage = () => {
        let { language } = this.props;
        let nextLanguage = language === 'vi' ? 'en' : 'vi';
        this.props.changeLanguageAppRedux(nextLanguage);
    };

    toggleSidebar = () => {
        this.setState({ isOpenSidebar: !this.state.isOpenSidebar });
    };

    closeSidebar = () => {
        this.setState({ isOpenSidebar: false });
    };

    render() {
        const { processLogout, userInfo, children, language } = this.props;
        const { menuApp } = this.state;

        const lang = language || 'vi'; // Fallback to avoid undefined

        return (
            <div className="account-page">
                {/* Top Header */}
                <div className="sub-header">
                    <div className="sub-header-content">
                        <div className="left-controls" onClick={() => window.location.href = '/home'} style={{ cursor: 'pointer' }}>
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
                        <div className="right-controls">
                            <div className="translate-wrapper" onClick={this.changeLanguage} title={lang === 'vi' ? 'Đổi ngôn ngữ' : 'Change Language'}>
                                <img src={translate} className="icon-translate" alt="Translate" />
                            </div>
                            <button className="btn-signout" onClick={processLogout} title={lang === 'vi' ? 'Đăng xuất' : 'Logout'}>
                                <FormattedMessage id="system-layout.sign-out" defaultMessage="Sign Out" />
                            </button>
                            <div className="sidebar-toggle" onClick={this.toggleSidebar}>
                                <i className="fas fa-bars"></i>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="settings-container">
                    {/* Overlay for mobile sidebar */}
                    {this.state.isOpenSidebar && (
                        <div className="sidebar-overlay" onClick={this.closeSidebar}></div>
                    )}

                    <div className="container-flex">

                        {/* Sidebar */}
                        <aside className={`sidebar ${this.state.isOpenSidebar ? 'open' : ''}`}>
                            <div className="user-profile-summary">
                                <label htmlFor="upload-sys-avatar" className="avatar-circle" style={{ cursor: 'pointer', position: 'relative' }}>
                                    <img src={userInfo && userInfo.image ? decodeBase64Buffer(userInfo.image) : icon_icons} alt="avatar" />
                                    <div className="avatar-edit-overlay">
                                        <i className="fas fa-camera"></i>
                                    </div>
                                </label>
                                <input type="file" id="upload-sys-avatar" hidden accept="image/*" onChange={this.handleOnChangeImage} />
                                <h2 className="user-name">
                                    <FormattedMessage id="system-layout.welcome" />, {userInfo?.lastName} {userInfo?.firstName}
                                </h2>
                                <p className="user-email">{userInfo?.email || 'admin@bookingcare.vn'}</p>
                            </div>

                            <nav className="sidebar-nav">
                                {menuApp && menuApp.length > 0 && menuApp.map((group, groupIndex) => (
                                    <div className="menu-group" key={groupIndex}>
                                        <div className="group-name">
                                            <FormattedMessage id={group.name} />
                                        </div>
                                        {/* Some menus array inside the group */}
                                        {group.menus && group.menus.length > 0 ? (
                                            group.menus.map((item, itemIndex) => (
                                                <NavLink
                                                    to={item.link}
                                                    className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                                                    key={itemIndex}
                                                    onClick={this.closeSidebar} // Close sidebar on nav click (mobile)
                                                >
                                                    {item.name.includes('.') ? <FormattedMessage id={item.name} /> : item.name}
                                                </NavLink>
                                            ))
                                        ) : (
                                            /* If a group like doctor.manage-booking doesn't have child menus but has a direct link */
                                            group.link && (
                                                <NavLink
                                                    to={group.link}
                                                    className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                                                >
                                                    {group.name.includes('.') ? <FormattedMessage id={group.name} /> : group.name}
                                                </NavLink>
                                            )
                                        )}
                                    </div>
                                ))}
                                
                                {/* Mobile-only System Actions (Logout/Translate) */}
                                <div className="menu-group mobile-system-actions">
                                    <div className="group-name">
                                        <FormattedMessage id="system-layout.system" defaultMessage="SYSTEM" />
                                    </div>
                                    <div className="nav-item" onClick={this.changeLanguage}>
                                        <img src={translate} className="icon-translate-sidebar" alt="Translate" />
                                        <span>{lang === 'vi' ? 'Tiếng Anh' : 'Vietnamese'}</span>
                                    </div>
                                    <div className="nav-item logout-item" onClick={processLogout}>
                                        <i className="fas fa-sign-out-alt"></i>
                                        <FormattedMessage id="system-layout.sign-out" defaultMessage="Sign Out" />
                                    </div>
                                </div>
                            </nav>
                        </aside>

                        {/* Content Area */}
                        <main className="main-content">
                            {children}
                        </main>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
    userInfo: state.user.userInfo
});

const mapDispatchToProps = dispatch => ({
    processLogout: () => dispatch(actions.processLogout()),
    changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language)),
    updateUserSuccess: (userInfo) => dispatch(actions.updateUserSuccess(userInfo))
});

export default connect(mapStateToProps, mapDispatchToProps)(SystemLayout);
