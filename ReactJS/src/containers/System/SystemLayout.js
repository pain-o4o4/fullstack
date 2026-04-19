import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import * as actions from "../../store/actions";
import { USER_ROLE } from '../../utils';
import { adminMenu, doctorMenu, patientMenu } from '../Header/menuApp';
import translate from '../../assets/images/translate.svg';
import './SystemLayout.scss';

class SystemLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuApp: []
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

    changeLanguage = () => {
        let { language } = this.props;
        let nextLanguage = language === 'vi' ? 'en' : 'vi';
        this.props.changeLanguageAppRedux(nextLanguage);
    };

    render() {
        const { processLogout, userInfo, children, language } = this.props;
        const { menuApp } = this.state;

        const lang = language || 'vi'; // Fallback to avoid undefined

        return (
            <div className="apple-account-page">
                {/* Top Header */}
                <div className="apple-sub-header">
                    <div className="sub-header-content">
                        <span className="brand-name"
                            onClick={() => window.location.href = '/home'}
                        >BookingCare</span>
                        <div className="right-controls">
                            <div className="translate-wrapper" onClick={this.changeLanguage} title={lang === 'vi' ? 'Đổi ngôn ngữ' : 'Change Language'}>
                                <img src={translate} className="icon-translate" alt="Translate" />
                            </div>
                            <button className="btn-signout" onClick={processLogout} title={lang === 'vi' ? 'Đăng xuất' : 'Logout'}>
                                <FormattedMessage id="system-layout.sign-out" defaultMessage="Sign Out" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Dashboard Area */}
                <div className="apple-settings-container">
                    <div className="container-flex">

                        {/* Sidebar */}
                        <aside className="apple-sidebar">
                            <div className="user-profile-summary">
                                <div className="avatar-circle">
                                    <img src={userInfo?.image || 'https://static.vecteezy.com/system/resources/previews/026/625/600/non_2x/person-icon-symbol-design-illustration-vector.jpg'} alt="avatar" />
                                </div>
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
                            </nav>
                        </aside>

                        {/* Content Area */}
                        <main className="apple-main-content">
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
});

export default connect(mapStateToProps, mapDispatchToProps)(SystemLayout);
