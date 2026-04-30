import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { verifyRegisterOtp, resendRegisterOtp } from '../../services/userService';
import * as actions from "../../store/actions";
import { withRouter } from '../../components/Navigator';
import './Login.scss';

class RegisterVerify extends Component {
    state = {
        verificationCode: '',
        errMessage: '',
        isSubmitting: false,
        isResending: false
    };

    componentDidMount() {
        if (!this.props.registerEmail) {
            this.props.navigate('/register');
        }
    }

    handleChange = (e) => {
        this.setState({ verificationCode: e.target.value, errMessage: '' });
    };

    handleVerify = async () => {
        const code = (this.state.verificationCode || '').trim();
        if (!code || code.length !== 6) {
            this.setState({ errMessage: 'Vui lòng nhập mã OTP gồm 6 chữ số.' });
            return;
        }
        this.setState({ isSubmitting: true });
        try {
            const res = await verifyRegisterOtp(this.props.registerEmail, code);
            if (res && res.errCode === 0) {
                if (res.token) {
                    localStorage.setItem('token', res.token);
                }
                this.props.userLoginSuccess(res.user);
                this.props.clearRegisterSession();
                toast.success('Xác thực thành công. Chào mừng bạn!');
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
                toast.success('Đã gửi lại mã OTP. Vui lòng kiểm tra Gmail.');
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
        const { verificationCode, errMessage, isSubmitting, isResending } = this.state;

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
                            <div className="input">
                                <input
                                    type="text"
                                    placeholder="Mã OTP (6 chữ số)"
                                    value={verificationCode}
                                    onChange={this.handleChange}
                                />
                            </div>
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
