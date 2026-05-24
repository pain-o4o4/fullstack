import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { verifyRegisterOtp, resendRegisterOtp } from '../../services/userService';
import * as actions from "../../store/actions";
import { withRouter } from '../../components/Navigator';
import { startTimer } from '../../auth/TokenRefreshManager';
import './Login.scss';

class RegisterVerify extends Component {
    state = {
        verificationCode: '',
        errMessage: '',
        isSubmitting: false,
        isResending: false,
        errors: {}
    };

    componentDidMount() {
        if (!this.props.registerEmail) {
            this.props.navigate('/register');
        }
    }

    validateField = (fieldName, value) => {
        let { errors } = this.state;
        const cleanVal = (value || '').replace(/[\s\-]/g, '');

        if (fieldName === 'verificationCode') {
            if (!cleanVal) {
                errors.verificationCode = 'Vui lòng nhập mã OTP!';
            } else if (!/^\d+$/.test(cleanVal)) {
                errors.verificationCode = 'Mã OTP chỉ được chứa các chữ số!';
            } else if (cleanVal.length !== 6) {
                errors.verificationCode = 'Mã OTP phải có đúng 6 chữ số!';
            } else {
                delete errors.verificationCode;
            }
        }
        this.setState({ errors, errMessage: '' });
    };

    handleChange = (e) => {
        let val = e.target.value;
        this.setState({ verificationCode: val }, () => {
            this.validateField('verificationCode', val);
        });
    };

    handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const { verificationCode, errors } = this.state;
            const cleanCode = (verificationCode || '').replace(/[\s\-]/g, '');
            if (cleanCode.length === 6 && !errors.verificationCode) {
                this.handleVerify();
            }
        }
    };

    handleVerify = async () => {
        const code = (this.state.verificationCode || '').replace(/[\s\-]/g, '');
        this.validateField('verificationCode', code);

        if (Object.keys(this.state.errors).length > 0 || !code) {
            return;
        }

        this.setState({ isSubmitting: true });
        try {
            const res = await verifyRegisterOtp(this.props.registerEmail, code);
            if (res && res.errCode === 0) {
                if (res.token) {
                    localStorage.setItem('token', res.token);

                    // Khởi động Silent Refresh Timer ngay sau khi đăng ký thành công
                    startTimer(res.token);
                }
                this.props.userLoginSuccess({ ...res.user, token: res.token });
                this.props.clearRegisterSession();
                console.log('Xác thực thành công. Chào mừng bạn!');
                this.props.navigate('/home');
                return;
            }
            this.setState({ errMessage: (res && (res.errMessage || res.message)) || 'Xác thực thất bại.' });
        } catch (e) {
            this.setState({ errMessage: e?.response?.data?.errMessage || 'Lỗi hệ thống khi xác thực OTP.' });
        } finally {
            this.setState({ isSubmitting: false });
        }
    };

    handleResend = async () => {
        if (!this.props.registerEmail) return;
        this.setState({ isResending: true, errMessage: '' });
        try {
            const res = await resendRegisterOtp(this.props.registerEmail);
            if (res && res.errCode === 0) {
                console.log('Đã gửi lại mã OTP. Vui lòng kiểm tra Gmail.');
            } else {
                this.setState({ errMessage: (res && (res.errMessage || res.message)) || 'Không thể gửi lại OTP.' });
            }
        } catch (e) {
            this.setState({ errMessage: e?.response?.data?.errMessage || 'Lỗi hệ thống khi gửi lại OTP.' });
        } finally {
            this.setState({ isResending: false });
        }
    };

    render() {
        const { registerEmail } = this.props;
        const { verificationCode, errMessage, errors, isSubmitting, isResending } = this.state;

        return (
            <div className="auth-split-container">
                <div className="welcome-left">
                    <div className="welcome-text">
                        <h1>Xác thực OTP</h1>
                        <p>Nhập mã 6 chữ số đã gửi đến Gmail của bạn.</p>
                    </div>
                </div>
                <div className="form-right-login">
                    <div className="container">
                        <div className="header">
                            <div className="text">Xác thực tài khoản</div>
                            <div className="underline"></div>
                        </div>
                        <div className="inputs">
                            <div className="input">
                                <input type="text" value={registerEmail || ''} disabled />
                            </div>
                            <div className={`input ${errors.verificationCode ? 'has-error' : ''}`}>
                                <input
                                    type="text"
                                    name="verificationCode"
                                    placeholder="Mã OTP (6 chữ số)"
                                    value={verificationCode}
                                    onChange={this.handleChange}
                                    onKeyDown={this.handleKeyDown}
                                />
                            </div>
                            {errors.verificationCode && <div className="inline-error">{errors.verificationCode}</div>}
                            <div className="error-message">{errMessage}</div>
                            <div className="submit-container">
                                <button className="submit" onClick={this.handleVerify} disabled={isSubmitting}>
                                    {isSubmitting ? 'Đang xác thực...' : 'Xác thực OTP'}
                                </button>
                                <button className="submit gray" onClick={this.handleResend} disabled={isResending}>
                                    {isResending ? 'Đang gửi lại...' : 'Gửi lại OTP'}
                                </button>
                            </div>
                            <div className="submit-container">
                                <button className="submit gray" onClick={() => this.props.navigate('/register')}>
                                    Quay lại đăng ký
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
        registerEmail: state.user.email,
    };
};

const mapDispatchToProps = (dispatch) => ({
    userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo)),
    clearRegisterSession: () => dispatch(actions.clearRegisterSession())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RegisterVerify));
