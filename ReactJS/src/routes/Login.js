import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from "../store/actions";
import { KeyCodeUtils, LanguageUtils } from "../utils";

import userIcon from '../../src/assets/images/user.svg';
import passIcon from '../../src/assets/images/pass.svg';
import './Login.scss';
import { FormattedMessage } from 'react-intl';

import adminService from '../services/adminService';
import { withRouter } from '../components/Navigator'; // 👈 nhớ import

class Login extends Component {
    constructor(props) {
        super(props);
        this.btnLogin = React.createRef();
    }

    initialState = {
        username: '',
        password: '',
        loginError: ''
    }

    state = {
        ...this.initialState
    };

    refresh = () => {
        this.setState({ ...this.initialState })
    }

    onUsernameChange = (e) => {
        this.setState({ username: e.target.value })
    }

    onPasswordChange = (e) => {
        this.setState({ password: e.target.value })
    }

    redirectToSystemPage = () => {
        this.props.navigate('/system/user-manage');
    }

    processLogin = () => {
        const { adminLoginSuccess } = this.props;

        let adminInfo = {
            tlid: "0",
            tlfullname: "Administrator",
            custype: "A",
            accessToken: "fake-token"
        };

        adminLoginSuccess(adminInfo);
        this.refresh();
        this.redirectToSystemPage();

        try {
            adminService.login({
                username: 'admin',
                password: '123456'
            });
        } catch (e) {
            console.log('error login : ', e);
        }
    }

    handlerKeyDown = (event) => {
        const keyCode = event.which || event.keyCode;
        if (keyCode === KeyCodeUtils.ENTER) {
            event.preventDefault();
            if (!this.btnLogin.current || this.btnLogin.current.disabled) return;
            this.btnLogin.current.click();
        }
    };

    componentDidMount() {
        document.addEventListener('keydown', this.handlerKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handlerKeyDown);
        this.setState = () => { };
    }

    render() {
        const { username, password, loginError } = this.state;
        const { lang } = this.props;

        return (
            <div className="login-wrapper">
                <div className="login-container">
                    <div className="form_login">
                        <h2 className="title">
                            <FormattedMessage id="login.login" />
                        </h2>

                        <div className="form-group icon-true">
                            <img className="icon" src={userIcon} alt="" />
                            <input
                                placeholder={LanguageUtils.getMessageByKey("login.username", lang)}
                                type="text"
                                className="form-control"
                                value={username}
                                onChange={this.onUsernameChange}
                            />
                        </div>

                        <div className="form-group icon-true">
                            <img className="icon" src={passIcon} alt="" />
                            <input
                                placeholder={LanguageUtils.getMessageByKey("login.password", lang)}
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={this.onPasswordChange}
                            />
                        </div>

                        {loginError && (
                            <div className='login-error'>
                                <span>{loginError}</span>
                            </div>
                        )}

                        <div className="form-group login">
                            <input
                                ref={this.btnLogin}
                                type="submit"
                                className="btn"
                                value={LanguageUtils.getMessageByKey("login.login", lang)}
                                onClick={this.processLogin}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    lang: state.app.language
});

const mapDispatchToProps = dispatch => ({
    adminLoginSuccess: (adminInfo) => dispatch(actions.adminLoginSuccess(adminInfo)),
    adminLoginFail: () => dispatch(actions.adminLoginFail()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));