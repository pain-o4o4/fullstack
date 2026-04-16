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
        if (userInfo && userInfo.roleId) {
            let role = userInfo.roleId;
            if (role === USER_ROLE.ADMIN) {
                menu = adminMenu;
            } else if (role === USER_ROLE.DOCTOR) {
                menu = doctorMenu;
            }
        }

        this.setState({
            menuApp: menu
        });
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.userInfo !== this.props.userInfo) {
            let { userInfo } = this.props;
            let menu = [];
            if (userInfo && userInfo.roleId) {
                let role = userInfo.roleId;
                if (role === USER_ROLE.ADMIN) {
                    menu = adminMenu;
                } else if (role === USER_ROLE.DOCTOR) {
                    menu = doctorMenu;
                }
            }
            this.setState({
                menuApp: menu
            });
        }
    }
    render() {
        const { processLogout, language, userInfo } = this.props;
        console.log(">>> check header props: ", userInfo);
        return (
            <div className="header-container">
                <div className="header-tabs-container">
                    <Navigator menus={this.state.menuApp} />
                </div>
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
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
