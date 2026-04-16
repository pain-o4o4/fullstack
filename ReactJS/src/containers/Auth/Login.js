import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import './Login.scss';
import { FormattedMessage } from 'react-intl';
import username from '../../assets/images/username.png'
import email from '../../assets/images/email.png'
import password from '../../assets/images/password.png'
import bookingcare from '../../assets/images/bookingcare.png'
import { handleLoginApi } from '../../services/userService';
import { userService } from '../../services/userService';
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            isShowPassword: false,
            errMessage: ''
        }
    }

    handleEmailChange = (e) => {
        this.setState({ email: e.target.value });
    }

    handlePasswordChange = (e) => {
        this.setState({ password: e.target.value });
    }
    handleLogin = async () => {
        this.setState({ errMessage: '' });
        try {
            let res = await handleLoginApi(this.state.email, this.state.password);
            // Data trả ra "id", "email", "roleId", "password", "firstName", "lastName", "image"
            if (res && res.errCode !== 0) {
                this.setState({
                    errMessage: res.message
                });
            }
            if (res && res.errCode === 0) {
                let user = res.userData;
                console.log('>>> User data sau khi login:', user);
                if (user && user.roleId) {
                    this.props.userLoginSuccess(user);
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
            }
        } catch (error) {
            if (error.response && error.response.data) {
                this.setState({
                    errMessage: error.response.data.message
                });
            } else {
                console.error(error);
            }

        }
    }
    hanhleShowHidePassword = () => {
        this.setState({ isShowPassword: !this.state.isShowPassword });
    }
    handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            this.handleLogin();
        }
    }
    render() {
        // console.log(this.state.errMessage);
        return (

            <div className="auth-split-container">
                <div className="welcome-left">
                    <div className="welcome-text">
                        <h1>Welcome back!</h1>
                        <p>You can sign in to access with your existing account.</p>
                    </div>
                </div>
                <div className="form-right">
                    <div className="container">
                        <div className="header">
                            <div className="text">Login</div>
                            <div className="underline"></div>
                        </div>
                        <div className="inputs">
                            <div className="input">
                                <img className="input-icon" src={email} alt="Email" />
                                <input type="email" placeholder="Email"
                                    value={this.state.email}
                                    onChange={this.handleEmailChange}
                                />
                            </div>
                            <div className="input">
                                <img className="input-icon" src={password} alt="Password" />
                                <input type={this.state.isShowPassword ? "text" : "password"} placeholder="Password"
                                    value={this.state.password}
                                    onChange={this.handlePasswordChange}
                                    onKeyDown={(event) => this.handleKeyDown(event)}
                                />
                                <div className="eye-icon">
                                    <span
                                        onClick={this.hanhleShowHidePassword}
                                        className={this.state.isShowPassword ?
                                            "material-symbols-rounded" : "material-symbols-rounded"}
                                    >
                                        {this.state.isShowPassword ? 'visibility' : 'visibility_off'}
                                    </span>
                                </div>
                            </div>
                            <div className="error-forgot-container ">
                                <div className="error-message">
                                    {this.state.errMessage}
                                </div>
                                <div className="forgot-password">
                                    <span>Forgot Password?</span>
                                </div>
                            </div>
                            <div className="submit-container">
                                <button className="submit" type="submit">Sign Up</button>
                                <button className="submit" type="button" onClick={this.handleLogin}>Login</button>
                            </div>
                            <span className="social-login">
                                <span>Or login with</span>
                                <i className="fab fa-facebook"></i>
                                <i className="fab fa-google"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        // adminLoginSuccess: (adminInfo) => dispatch(actions.adminLoginSuccess(adminInfo)),
        // adminLoginFail: () => dispatch(actions.adminLoginFail()),
        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
