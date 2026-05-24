import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { handleResetPasswordAPI } from '../../services/userService';
import { withRouter } from '../../components/Navigator';
import './Login.scss';
import { Eye as EyeIcon, EyeClosed as EyeClosedIcon } from '@phosphor-icons/react';

class ResetPassword extends Component {
    state = {
        newPassword: '',
        confirmPassword: '',
        isShowPassword: false,
        isLoading: false,
        errors: {}
    }

    validatePassword = (value) => {
        let { language } = this.props;
        if (!value) {
            return language === 'vi' ? 'Vui lòng nhập mật khẩu mới!' : 'Please enter your new password!';
        }
        if (/\s/.test(value)) {
            return language === 'vi' ? 'Mật khẩu không được chứa khoảng trắng!' : 'Password cannot contain spaces!';
        }
        if (value.length < 6) {
            return language === 'vi' ? 'Mật khẩu phải có tối thiểu 6 ký tự!' : 'Password must be at least 6 characters!';
        }
        return '';
    };

    handlePasswordChange = (e) => {
        const value = e.target.value;
        const error = this.validatePassword(value);
        this.setState(prevState => ({
            newPassword: value,
            errors: {
                ...prevState.errors,
                newPassword: error
            }
        }));
    };

    handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        const { language } = this.props;
        const error = value !== this.state.newPassword
            ? (language === 'vi' ? 'Mật khẩu xác nhận không trùng khớp!' : 'Confirmation password does not match!')
            : '';
        this.setState(prevState => ({
            confirmPassword: value,
            errors: {
                ...prevState.errors,
                confirmPassword: error
            }
        }));
    };

    toggleShowPassword = () => {
        this.setState({ isShowPassword: !this.state.isShowPassword });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const { newPassword, confirmPassword } = this.state;
        const { language } = this.props;

        const newPassErr = this.validatePassword(newPassword);
        const confirmPassErr = confirmPassword !== newPassword
            ? (language === 'vi' ? 'Mật khẩu xác nhận không trùng khớp!' : 'Confirmation password does not match!')
            : '';

        if (newPassErr || confirmPassErr) {
            this.setState({
                errors: {
                    newPassword: newPassErr,
                    confirmPassword: confirmPassErr
                }
            });
            return;
        }

        // Đọc query parameters từ URL: ?id=xx&token=yy
        const queryParams = new URLSearchParams(window.location.search);
        const id = queryParams.get('id');
        const token = queryParams.get('token');

        if (!id || !token) {
            toast.error(language === 'vi' ? 'Đường dẫn thiếu thông tin xác thực!' : 'Link is missing authentication parameters!');
            return;
        }

        this.setState({ isLoading: true });

        try {
            let res = await handleResetPasswordAPI({
                userId: id,
                token: token,
                newPassword: newPassword,
                language: language
            });

            if (res && res.errCode === 0) {
                toast.success(res.errMessage || (language === 'vi' ? 'Đặt lại mật khẩu thành công!' : 'Password reset successful!'));
                this.props.navigate('/login');
            } else {
                toast.error(res.errMessage || (language === 'vi' ? 'Yêu cầu không hợp lệ hoặc đã quá hạn!' : 'Request is invalid or expired!'));
            }
        } catch (error) {
            toast.error(language === 'vi' ? 'Không thể kết nối đến máy chủ!' : 'Could not connect to the server!');
        } finally {
            this.setState({ isLoading: false });
        }
    }

    render() {
        const { language } = this.props;
        const { newPassword, confirmPassword, isShowPassword, isLoading, errors } = this.state;

        return (
            <div className="auth-split-container">
                <div className="welcome-left">
                    <div className="welcome-text">
                        <h1>{language === 'vi' ? 'Đặt lại mật khẩu' : 'Reset Password'}</h1>
                        <p>
                            {language === 'vi' 
                                ? 'Bảo vệ tài khoản y tế của bạn bằng cách thiết lập một mật khẩu mới có độ bảo mật cao.' 
                                : 'Protect your medical account by setting a strong new password.'}
                        </p>
                    </div>
                </div>
                <div className="form-right-login">
                    <div className="container" style={{ minHeight: '520px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div className="header">
                            <div className="text">{language === 'vi' ? 'Khôi phục' : 'Reset Password'}</div>
                            <div className="underline"></div>
                        </div>

                        <form onSubmit={this.handleSubmit} className="forgot-password-form" style={{ marginTop: '20px' }}>
                            <div className="forgot-content-wrap">
                                <p>
                                    {language === 'vi' 
                                        ? 'Vui lòng thiết lập mật khẩu mới có độ bảo mật cao để bảo vệ tài khoản của bạn.' 
                                        : 'Please set a strong new password to protect your account.'}
                                </p>

                                <div className="form-group-forgot">
                                    <label>{language === 'vi' ? 'Mật khẩu mới' : 'New Password'}</label>
                                    <div className={`forgot-input-wrapper ${errors.newPassword ? 'has-error' : ''}`}>
                                        <input
                                            type={isShowPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={this.handlePasswordChange}
                                            placeholder={language === 'vi' ? 'Nhập mật khẩu mới' : 'Enter new password'}
                                            required
                                        />
                                        <span onClick={this.toggleShowPassword} className="eye-icon-span">
                                            {isShowPassword ? (
                                                <EyeIcon size={28} color="#1c246d" weight="light" />
                                            ) : (
                                                <EyeClosedIcon size={28} color="#1c246d" weight="light" />
                                            )}
                                        </span>
                                    </div>
                                    {errors.newPassword && <div className="status-message error" style={{ marginTop: '5px' }}>{errors.newPassword}</div>}
                                </div>

                                <div className="form-group-forgot" style={{ marginTop: '15px' }}>
                                    <label>{language === 'vi' ? 'Xác nhận mật khẩu mới' : 'Confirm New Password'}</label>
                                    <div className={`forgot-input-wrapper ${errors.confirmPassword ? 'has-error' : ''}`}>
                                        <input
                                            type={isShowPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={this.handleConfirmPasswordChange}
                                            placeholder={language === 'vi' ? 'Xác nhận lại mật khẩu' : 'Confirm your password'}
                                            required
                                        />
                                    </div>
                                    {errors.confirmPassword && <div className="status-message error" style={{ marginTop: '5px' }}>{errors.confirmPassword}</div>}
                                </div>
                            </div>

                            <div className="submit-container">
                                <button type="submit" disabled={isLoading} className="submit">
                                    {isLoading 
                                        ? (language === 'vi' ? 'Đang cập nhật...' : 'Updating...') 
                                        : (language === 'vi' ? 'Đặt lại mật khẩu' : 'Reset Password')}
                                </button>
                            </div>
                        </form>
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

export default withRouter(connect(mapStateToProps)(ResetPassword));
