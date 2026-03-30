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
            // 1. Phải gán kết quả trả về vào biến data
            let data = await handleLoginApi(this.state.email, this.state.password);
            console.log(">>> Full data from server: ", data);
            // 2. Kiểm tra errCode từ Server (chúng mình đã thống nhất là 0 là OK)
            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.message // Hiển thị lỗi từ server (ví dụ: Sai mật khẩu)
                });
            }

            if (data && data.errCode === 0) {
                // 3. THÀNH CÔNG: Lưu vào Redux và chuyển trang
                this.props.userLoginSuccess(data.userData);
                console.log('Đăng nhập thành công!');
                // Chuyển trang nếu cần: this.props.navigate('/system');
            }

        } catch (error) {
            // Lỗi này là lỗi kết nối hoặc lỗi server crash (500)
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
                            {/* <div className="input">
                                <img src={username} alt="User" />
                                <input type="text" placeholder="Username" />
                            </div> */}
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
                                    {/* <i className="fa-regular fa-eye"></i> */}

                                    <span
                                        onClick={this.hanhleShowHidePassword}
                                        className={this.state.isShowPassword ?
                                            "material-symbols-rounded" : "material-symbols-rounded"}
                                    >
                                        {/* QUAN TRỌNG: Thêm tên icon vào đây */}
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
                                {/* Don't have an account? */}
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
