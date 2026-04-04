import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LANGUAGES, USER_ROLE } from '../../utils';
import * as actions from "../../store/actions";
import Navigator from '../../components/Navigator';
import { adminMenu, doctorMenu } from './menuApp';
import './Header.scss';
import translate from '../../assets/images/translate.svg';
import { FormattedMessage } from 'react-intl';


class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuApp: []
        }
    }
    changeLanguage = () => {
        let { language } = this.props;
        let nextLanguage = language === 'vi' ? 'en' : 'vi';
        this.props.changeLanguageAppRedux(nextLanguage);
    }
    componentDidMount() {
        let { userInfo } = this.props;
        let menu = [];

        // Bước 1: Check xem có userInfo không cái đã
        if (userInfo && userInfo.roleId) {
            let role = userInfo.roleId;

            // Bước 2: Kiểm tra Role nào thì hốt Menu đó
            if (role === USER_ROLE.ADMIN) { // Admin (R1) vào đây
                menu = adminMenu;
            } else if (role === USER_ROLE.DOCTOR) { // Doctor (R2) vào đây
                menu = doctorMenu;
            }
        }

        // Bước 3: Cập nhật vào state để giao diện vẽ ra
        this.setState({
            menuApp: menu
        });
    }
    render() {
        const { processLogout, language, userInfo } = this.props;
        console.log(">>> check header props: ", userInfo);
        return (
            <div className="header-container">
                {/* thanh navigator bên trái */}
                <div className="header-tabs-container">
                    <Navigator menus={this.state.menuApp} />
                </div>

                {/* Cụm chức năng bên phải */}
                <div className="header-right-content">
                    <div className="Languages">
                        <span className='welcome'>
                            <FormattedMessage id="homeheader.welcome" defaultMessage="Welcome, " />
                            {userInfo && userInfo.firstName ? userInfo.firstName : ''}
                        </span>
                        <div className="translate-wrapper" onClick={() => this.changeLanguage()}>
                            <img
                                src={translate}
                                className="icon-translate"
                                alt="Translate"
                            />
                        </div>
                    </div>

                    {/* nút logout */}
                    <div className="btn btn-logout" onClick={processLogout} title='Log out'>
                        <i className="fas fa-sign-out-alt"></i>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn, // Lấy từ user
        language: state.app.language,      // Language vẫn nằm ở app là đúng
        userInfo: state.user.userInfo      // Lấy từ user
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
