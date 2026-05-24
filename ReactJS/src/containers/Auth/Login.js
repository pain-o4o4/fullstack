import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../store/actions";
import './Login.scss';
import { FormattedMessage } from 'react-intl';

import emailIcon from '../../assets/images/email.png';
import passwordIcon from '../../assets/images/password.png';

import { handleLoginApi } from '../../services/userService';
import { withRouter } from '../../components/Navigator';

class Login extends Component {
    state = {
        email: '',
        password: '',
        isShowPassword: false,
        errMessage: '',
        errors: {}
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
                                <span onClick={this.toggleShowPassword} style={{ cursor: 'pointer' }}>
                                    {this.state.isShowPassword ? '🙈' : '👁️'}
                                </span>
                            </div>
                            {errors.password && <div className="inline-error">{errors.password}</div>}

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