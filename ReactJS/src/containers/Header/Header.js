import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LANGUAGES } from '../../utils';
import * as actions from "../../store/actions";
import Navigator from '../../components/Navigator';
import { adminMenu } from './menuApp';
import './Header.scss';
import translate from '../../assets/images/translate.svg';
import { FormattedMessage } from 'react-intl';


class Header extends Component {
    // componentDidMount() {
    //     window.addEventListener('storage', (e) => {
    //         if (e.key === 'persist:app') { // Kiểm tra đúng key của redux-persist
    //             window.location.reload(); // Tự động load lại khi thấy tab khác đổi data
    //         }
    //     });
    // }
    changeLanguage = () => {
        let { language } = this.props;
        let nextLanguage = language === 'vi' ? 'en' : 'vi';
        this.props.changeLanguageAppRedux(nextLanguage);
    }
    render() {
        const { processLogout, language, userInfo } = this.props;
        console.log(">>> check header props: ", userInfo);
        return (
            <div className="header-container">
                {/* thanh navigator bên trái */}
                <div className="header-tabs-container">
                    <Navigator menus={adminMenu} />
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
