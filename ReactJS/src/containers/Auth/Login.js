import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../store/actions";
import './Login.scss';
import { FormattedMessage } from 'react-intl';

import emailIcon from '../../assets/images/email.png';
import passwordIcon from '../../assets/images/password.png';

import { handleLoginApi, handleForgotPasswordAPI } from '../../services/userService';
import { withRouter } from '../../components/Navigator';
import { Eye as EyeIcon, EyeClosed as EyeClosedIcon } from '@phosphor-icons/react';

class Login extends Component {
    state = {
        email: '',
        password: '',
        isShowPassword: false,
        errMessage: '',
        errors: {},
        isShowForgotPasswordModal: false,
        forgotEmail: '',
        forgotErrMessage: '',
        forgotSuccessMessage: '',
        isForgotLoading: false
    };

    handleOpenForgotPasswordModal = () => {
        this.setState({
            isShowForgotPasswordModal: true,
            forgotEmail: '',
            forgotErrMessage: '',
            forgotSuccessMessage: '',
            isForgotLoading: false
        });
    };

    handleCloseForgotPasswordModal = () => {
        this.setState({ isShowForgotPasswordModal: false });
    };

    handleForgotEmailChange = (e) => {
        this.setState({ forgotEmail: e.target.value, forgotErrMessage: '', forgotSuccessMessage: '' });
    };

    handleSendForgotRequest = async (e) => {
        e.preventDefault();
        const { forgotEmail } = this.state;
        const { language } = this.props;

        if (!forgotEmail) {
            this.setState({
                forgotErrMessage: language === 'vi' ? 'Vui lòng nhập Email!' : 'Email is required!'
            });
            return;
        }

        this.setState({ isForgotLoading: true, forgotErrMessage: '', forgotSuccessMessage: '' });

        try {
            let res = await handleForgotPasswordAPI(forgotEmail, language);
            if (res && res.errCode === 0) {
                this.setState({
                    forgotSuccessMessage: res.errMessage || (language === 'vi' ? 'Đã gửi liên kết khôi phục thành công!' : 'Reset link sent successfully!')
                });
            } else {
                this.setState({
                    forgotErrMessage: res.errMessage || (language === 'vi' ? 'Gửi yêu cầu thất bại!' : 'Failed to send request!')
                });
            }
        } catch (error) {
            this.setState({
                forgotErrMessage: language === 'vi' ? 'Lỗi kết nối máy chủ!' : 'Server connection error!'
            });
        } finally {
            this.setState({ isForgotLoading: false });
        }
    };

    validateField = (fieldName, value) => {
        let { errors } = this.state;
        let { language } = this.props;
        // Industry-standard robust email regex enforcing valid domain structure and TLD
        const emailRe = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const cleanVal = (value || '').trim();

        if (fieldName === 'email') {
            if (!cleanVal) {
                errors.email = language === 'vi' ? 'Vui lòng nhập Email!' : 'Email is required!';
            } else if (/\s/.test(value)) {
                errors.email = language === 'vi' ? 'Email không được chứa khoảng trắng!' : 'Email cannot contain spaces!';
            } else if (!value.includes('@')) {
                errors.email = language === 'vi' ? "Email thiếu ký tự '@'!" : "Email is missing '@' character!";
            } else if (!value.split('@')[1] || !value.split('@')[1].includes('.')) {
                errors.email = language === 'vi' ? 'Email thiếu tên miền (ví dụ: .com, .vn)!' : 'Email is missing a domain extension (e.g., .com, .vn)!';
            } else if (!emailRe.test(cleanVal)) {
                errors.email = language === 'vi' ? 'Định dạng Email không hợp lệ!' : 'Invalid Email format!';
            } else {
                delete errors.email;
            }
        }

        if (fieldName === 'password') {
            if (!value) {
                errors.password = language === 'vi' ? 'Vui lòng nhập mật khẩu!' : 'Password is required!';
            } else if (/\s/.test(value)) {
                errors.password = language === 'vi' ? 'Mật khẩu không được chứa khoảng trắng!' : 'Password cannot contain spaces!';
            } else if (value.length < 6) {
                errors.password = language === 'vi' ? 'Mật khẩu phải có tối thiểu 6 ký tự!' : 'Password must be at least 6 characters!';
            } else {
                delete errors.password;
            }
        }

        this.setState({ errors, errMessage: '' });
    };

    handleEmailChange = (e) => {
        let val = e.target.value;
        this.setState({ email: val }, () => {
            this.validateField('email', val);
        });
    };

    handleEmailBlur = (e) => {
        let val = e.target.value.trim();
        if (val && !val.includes('@')) {
            val = val + '@gmail.com';
            this.setState({ email: val }, () => {
                this.validateField('email', val);
            });
        }
    };

    handlePasswordChange = (e) => {
        let val = e.target.value;
        this.setState({ password: val }, () => {
            this.validateField('password', val);
        });
    };

    validate = () => {
        const { email, password } = this.state;
        this.validateField('email', email);
        this.validateField('password', password);
        return Object.keys(this.state.errors).length === 0;
    }

    handleLogin = async () => {
        this.setState({ errMessage: '' });

        // Auto append domain if not present upon submission
        let email = this.state.email.trim();
        if (email && !email.includes('@')) {
            email = email + '@gmail.com';
            this.setState({ email }, () => {
                if (!this.validate()) return;
                this.proceedLogin();
            });
        } else {
            if (!this.validate()) return;
            this.proceedLogin();
        }
    }

    proceedLogin = async () => {
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
                }
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

        } catch (error) {
            this.setState({
                errMessage: error?.response?.data?.message || 'Login failed'
            });
        }
    };

    handleKeyDown = (event, currentField) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const fields = ['email', 'password'];
            const currentIndex = fields.indexOf(currentField);

            const allFilled = fields.every(field => this.state[field] && this.state[field].trim() !== '');
            const hasErrors = Object.keys(this.state.errors).length > 0;

            if (currentField === 'password' || (allFilled && !hasErrors)) {
                this.handleLogin();
            } else if (currentIndex !== -1 && currentIndex < fields.length - 1) {
                const nextFieldName = fields[currentIndex + 1];
                const nextInput = document.querySelector(`input[name="${nextFieldName}"]`);
                if (nextInput) {
                    nextInput.focus();
                }
            }
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
        let { errors } = this.state;
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
                        {!this.state.isShowForgotPasswordModal ? (
                            <React.Fragment>
                                <div className="header">
                                    <div className="text"><FormattedMessage id="login.login" /></div>
                                    <div className="underline"></div>
                                </div>

                                <div className="inputs">
                                    <div className={`input ${errors.email ? 'has-error' : ''}`}>
                                        <img className="input-icon" src={emailIcon} alt="email" />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder={language === 'vi' ? 'Email' : 'Email'}
                                            value={this.state.email}
                                            onChange={this.handleEmailChange}
                                            onBlur={this.handleEmailBlur}
                                            onKeyDown={(event) => this.handleKeyDown(event, 'email')}
                                        />
                                    </div>
                                    {errors.email && <div className="inline-error">{errors.email}</div>}

                                    <div className={`input ${errors.password ? 'has-error' : ''}`}>
                                        <img className="input-icon" src={passwordIcon} alt="password" />
                                        <input
                                            type={this.state.isShowPassword ? "text" : "password"}
                                            name="password"
                                            placeholder={language === 'vi' ? 'Mật khẩu' : 'Password'}
                                            value={this.state.password}
                                            onChange={this.handlePasswordChange}
                                            onKeyDown={(event) => this.handleKeyDown(event, 'password')}
                                        />
                                        <span onClick={this.toggleShowPassword} className="eye-icon-span">
                                            {this.state.isShowPassword ? (
                                                <EyeIcon size={28} color="#1c246d" weight="light" />
                                            ) : (
                                                <EyeClosedIcon size={28} color="#1c246d" weight="light" />
                                            )}
                                        </span>
                                    </div>
                                    {errors.password && <div className="inline-error">{errors.password}</div>}

                                    <div className="error-forgot-container">
                                        <div className="error-message">
                                            {this.state.errMessage}
                                        </div>
                                        <div className="forgot-password">
                                            <span onClick={this.handleOpenForgotPasswordModal}>
                                                {language === 'vi' ? 'Quên mật khẩu?' : 'Forgot password?'}
                                            </span>
                                        </div>
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
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <div className="header">
                                    <div className="text">
                                        {language === 'vi' ? 'Khôi phục' : 'Forgot Password'}
                                    </div>
                                    <div className="underline"></div>
                                </div>

                                <form onSubmit={this.handleSendForgotRequest} className="forgot-password-form">
                                    <div className="forgot-content-wrap">
                                        <p>
                                            {language === 'vi' 
                                                ? 'Nhập địa chỉ email tài khoản của bạn để nhận liên kết khôi phục mật khẩu y tế.' 
                                                : 'Enter your email address to receive a secure password reset link.'}
                                        </p>
                                        <div className="form-group-forgot">
                                            <label>{language === 'vi' ? 'Địa chỉ Email' : 'Email Address'}</label>
                                            <div className="forgot-input-wrapper">
                                                <input 
                                                    type="email" 
                                                    value={this.state.forgotEmail} 
                                                    onChange={this.handleForgotEmailChange}
                                                    placeholder="your-email@example.com"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {this.state.forgotErrMessage && (
                                        <div className="status-message error">
                                            {this.state.forgotErrMessage}
                                        </div>
                                    )}

                                    {this.state.forgotSuccessMessage && (
                                        <div className="status-message success">
                                            {this.state.forgotSuccessMessage}
                                        </div>
                                    )}

                                    <div className="submit-container">
                                        <button 
                                            type="submit" 
                                            disabled={this.state.isForgotLoading}
                                            className="submit"
                                        >
                                            {this.state.isForgotLoading 
                                                ? (language === 'vi' ? 'Đang gửi...' : 'Sending...') 
                                                : (language === 'vi' ? 'Gửi yêu cầu' : 'Send Link')}
                                        </button>
                                        <button 
                                            type="button" 
                                            className="submit gray"
                                            onClick={this.handleCloseForgotPasswordModal}
                                        >
                                            {language === 'vi' ? 'Quay lại' : 'Back'}
                                        </button>
                                    </div>
                                </form>
                            </React.Fragment>
                        )}
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