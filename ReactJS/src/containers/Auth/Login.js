import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../store/actions";
import './Login.scss';
import { FormattedMessage } from 'react-intl';

import emailIcon from '../../assets/images/email.png';
import passwordIcon from '../../assets/images/password.png';

import { handleLoginApi } from '../../services/userService';
import { withRouter } from '../../components/Navigator';
import { startTimer } from '../../auth/TokenRefreshManager';

class Login extends Component {
    state = {
        email: '',
        password: '',
        isShowPassword: false,
        errMessage: ''
    };

    handleEmailChange = (e) => {
        this.setState({ email: e.target.value });
    };

    handlePasswordChange = (e) => {
        this.setState({ password: e.target.value });
    };

    validate = () => {
        let { email, password } = this.state;
        const re = /\S+@\S+\.\S+/;

        if (!email) {
            this.setState({ errMessage: 'Vui lòng nhập Email!' });
            return false;
        }
        if (!re.test(email)) {
            this.setState({ errMessage: 'Định dạng Email không hợp lệ!' });
            return false;
        }
        if (!password) {
            this.setState({ errMessage: 'Vui lòng nhập mật khẩu!' });
            return false;
        }
        if (password.length < 6) {
            this.setState({ errMessage: 'Mật khẩu phải có tối thiểu 6 ký tự!' });
            return false;
        }
        return true;
    }

    handleLogin = async () => {
        this.setState({ errMessage: '' });

        if (!this.validate()) return;

        try {
            let res = await handleLoginApi(this.state.email, this.state.password);

            if (res && res.errCode !== 0) {
                this.setState({
                    errMessage: res.message
                });
                return;
            }

            if (res && res.errCode === 0) {
                let user = res.userData;
                let token = res.token;
                if (token) {
                    localStorage.setItem('token', token);
                    this.props.userLoginSuccess({ ...user, token });

                    // Khởi động Silent Refresh Timer ngay sau khi login
                    startTimer(token);
                } else {
                    this.props.userLoginSuccess(user);
                }
                if (user.roleId === 'R1') {
                    this.props.navigate('/system/user-manage');
                } else if (user.roleId === 'R2') {
                    this.props.navigate('/doctor/manage-schedule');
                } else if (user.roleId === 'R3') {
                    this.props.navigate('/home');
                } else {
                    this.props.navigate('/login');
                }
            }

        } catch (error) {
            this.setState({
                errMessage: error?.response?.data?.message || 'Login failed'
            });
        }
    };

    handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            this.handleLogin();
        }
    };

    toggleShowPassword = () => {
        this.setState({ isShowPassword: !this.state.isShowPassword });
    };

    handleSignUp = () => {
        this.props.navigate('/register');
    };

    render() {
        let { language } = this.props;
        return (
            <div className="auth-split-container">
                <div className="welcome-left">
                    <div className="welcome-text">
                        <h1><FormattedMessage id="login.welcome" /></h1>
                        <p><FormattedMessage id="login.welcome-desc" /></p>
                    </div>
                </div>

                <div className="form-right-login">
                    <div className="container">
                        <div className="header">
                            <div className="text"><FormattedMessage id="login.login" /></div>
                            <div className="underline"></div>
                        </div>

                        <div className="inputs">
                            <div className="input">
                                <img className="input-icon" src={emailIcon} alt="email" />
                                <input
                                    type="email"
                                    placeholder={language === 'vi' ? 'Email' : 'Email'}
                                    value={this.state.email}
                                    onChange={this.handleEmailChange}
                                />
                            </div>

                            <div className="input">
                                <img className="input-icon" src={passwordIcon} alt="password" />
                                <input
                                    type={this.state.isShowPassword ? "text" : "password"}
                                    placeholder={language === 'vi' ? 'Mật khẩu' : 'Password'}
                                    value={this.state.password}
                                    onChange={this.handlePasswordChange}
                                    onKeyDown={this.handleKeyDown}
                                />
                                <span onClick={this.toggleShowPassword}>
                                    {this.state.isShowPassword ? '🙈' : '👁️'}
                                </span>
                            </div>

                            <div className="error-message">
                                {this.state.errMessage}
                            </div>

                            <div className="submit-container">
                                <button className="submit" onClick={this.handleLogin}>
                                    <FormattedMessage id="login.login" />
                                </button>
                                <button className="submit gray" onClick={this.handleSignUp}>
                                    <FormattedMessage id="login.signup" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => ({
    userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));