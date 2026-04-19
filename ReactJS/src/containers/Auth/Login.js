import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../store/actions";
import './Login.scss';

import emailIcon from '../../assets/images/email.png';
import passwordIcon from '../../assets/images/password.png';

import { handleLoginApi } from '../../services/userService';
import { withRouter } from '../../components/Navigator';

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

    handleLogin = async () => {
        this.setState({ errMessage: '' });

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

                this.props.userLoginSuccess(user);

                // 👉 redirect theo role
                // 👉 redirect theo role
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
        return (
            <div className="auth-split-container">
                <div className="welcome-left">
                    <div className="welcome-text">
                        <h1>Welcome back!</h1>
                        <p>You can sign in to access your account.</p>
                    </div>
                </div>

                <div className="form-right-login">
                    <div className="container">
                        <div className="header">
                            <div className="text">Login</div>
                            <div className="underline"></div>
                        </div>

                        <div className="inputs">
                            <div className="input">
                                <img className="input-icon" src={emailIcon} alt="email" />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={this.state.email}
                                    onChange={this.handleEmailChange}
                                />
                            </div>

                            <div className="input">
                                <img className="input-icon" src={passwordIcon} alt="password" />
                                <input
                                    type={this.state.isShowPassword ? "text" : "password"}
                                    placeholder="Password"
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
                                <button onClick={this.handleSignUp}>
                                    Sign Up
                                </button>
                                <button onClick={this.handleLogin}>
                                    Login
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo)),
});

export default withRouter(connect(null, mapDispatchToProps)(Login));