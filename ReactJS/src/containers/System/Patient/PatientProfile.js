import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { toast } from "react-toastify";
import * as action from '../../../store/actions';
import { postUpdatePatientService } from '../../../services/userService';
import { Eye as EyeIcon, EyeClosed as EyeClosedIcon } from '@phosphor-icons/react';
import './PatientProfile.scss';

class PatientProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            email: '',
            firstName: '',
            lastName: '',
            phonenumber: '',
            address: '',
            image: '',
            password: '',
            confirmPassword: '',
            roleId: '',
            errors: {}
        }
    }

    async componentDidMount() {
        let { userInfo } = this.props;
        if (userInfo && Object.keys(userInfo).length > 0) {
            this.setState({
                id: userInfo.id,
                email: userInfo.email,
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                phonenumber: userInfo.phonenumber,
                address: userInfo.address,
                image: userInfo.image,
                roleId: userInfo.roleId
            });
        }
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.userInfo !== this.props.userInfo) {
            let { userInfo } = this.props;
            if (userInfo) {
                let { id, email, firstName, lastName, phonenumber, address, image, roleId } = userInfo;
                this.setState({
                    id, email, firstName, lastName, phonenumber, address, image, roleId
                });
            }
        }
    }

    getPasswordStrength = (password) => {
        const length = password.length >= 6;
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        return { length, hasLetter, hasNumber };
    }

    validateField = (fieldName, value) => {
        let { errors } = this.state;
        let { language } = this.props;
        const nameRegex = /^[\p{L}\s]+$/u;
        const xssRegex = /<[^>]*>/g;

        const cleanVal = (value || '').trim();

        if (fieldName === 'firstName') {
            if (!cleanVal) {
                errors.firstName = language === 'vi' ? 'Vui lòng nhập Tên!' : 'First Name is required!';
            } else if (xssRegex.test(value)) {
                errors.firstName = language === 'vi' ? 'Tên chứa ký tự không hợp lệ!' : 'First Name contains invalid characters!';
            } else if (!nameRegex.test(cleanVal)) {
                errors.firstName = language === 'vi' ? 'Tên chỉ được phép chứa các chữ cái!' : 'First Name can only contain alphabetic characters!';
            } else {
                delete errors.firstName;
            }
        }
        if (fieldName === 'lastName') {
            if (!cleanVal) {
                errors.lastName = language === 'vi' ? 'Vui lòng nhập Họ!' : 'Last Name is required!';
            } else if (xssRegex.test(value)) {
                errors.lastName = language === 'vi' ? 'Họ chứa ký tự không hợp lệ!' : 'Last Name contains invalid characters!';
            } else if (!nameRegex.test(cleanVal)) {
                errors.lastName = language === 'vi' ? 'Họ chỉ được phép chứa các chữ cái!' : 'Last Name can only contain alphabetic characters!';
            } else {
                delete errors.lastName;
            }
        }
        if (fieldName === 'password') {
            if (value && value.length > 0) {
                if (/\s/.test(value)) {
                    errors.password = language === 'vi' ? 'Mật khẩu không được chứa khoảng trắng!' : 'Password cannot contain spaces!';
                } else if (value.length < 6) {
                    errors.password = language === 'vi' ? 'Mật khẩu phải có tối thiểu 6 ký tự!' : 'Password must be at least 6 characters!';
                } else {
                    delete errors.password;
                }
            } else {
                delete errors.password;
                delete errors.confirmPassword;
            }
            if (this.state.confirmPassword && this.state.confirmPassword !== value) {
                errors.confirmPassword = language === 'vi' ? 'Mật khẩu nhập lại không khớp!' : 'Confirm password does not match!';
            } else if (this.state.confirmPassword === value) {
                delete errors.confirmPassword;
            }
        }
        if (fieldName === 'confirmPassword') {
            if (this.state.password && this.state.password.length > 0) {
                if (!value) {
                    errors.confirmPassword = language === 'vi' ? 'Vui lòng xác nhận lại mật khẩu!' : 'Please confirm your password!';
                } else if (value !== this.state.password) {
                    errors.confirmPassword = language === 'vi' ? 'Mật khẩu nhập lại không khớp!' : 'Confirm password does not match!';
                } else {
                    delete errors.confirmPassword;
                }
            } else {
                delete errors.confirmPassword;
            }
        }
        if (fieldName === 'phonenumber') {
            let cleanPhone = (value || '').replace(/[\s\-\.]/g, '');
            if (cleanPhone.startsWith('+84')) {
                cleanPhone = '0' + cleanPhone.slice(3);
            } else if (cleanPhone.startsWith('84')) {
                cleanPhone = '0' + cleanPhone.slice(2);
            }

            if (!cleanPhone) {
                errors.phonenumber = language === 'vi' ? 'Vui lòng nhập số điện thoại!' : 'Phone number is required!';
            } else if (!/^\+?\d+$/.test(cleanPhone)) {
                errors.phonenumber = language === 'vi' ? 'Số điện thoại chỉ được chứa các chữ số!' : 'Phone number must contain only digits!';
            } else if (!cleanPhone.startsWith('0')) {
                errors.phonenumber = language === 'vi' ? 'Số điện thoại phải bắt đầu bằng số 0!' : 'Phone number must start with 0!';
            } else if (cleanPhone.length !== 10) {
                errors.phonenumber = language === 'vi' ? 'Số điện thoại phải có đúng 10 chữ số!' : 'Phone number must be exactly 10 digits!';
            } else if (!/^(03|05|07|08|09)\d{8}$/.test(cleanPhone)) {
                errors.phonenumber = language === 'vi' ? 'Đầu số không hợp lệ (hỗ trợ 03, 05, 07, 08, 09)!' : 'Invalid phone prefix (starts with 03, 05, 07, 08, 09)!';
            } else {
                delete errors.phonenumber;
            }
        }
        if (fieldName === 'address') {
            if (!cleanVal) {
                errors.address = language === 'vi' ? 'Vui lòng nhập địa chỉ!' : 'Address is required!';
            } else if (xssRegex.test(value)) {
                errors.address = language === 'vi' ? 'Địa chỉ chứa ký tự không hợp lệ!' : 'Address contains invalid characters!';
            } else {
                delete errors.address;
            }
        }

        this.setState({ errors });
    }

    checkValidateInput = () => {
        const { firstName, lastName, password, confirmPassword, phonenumber, address } = this.state;
        this.validateField('firstName', firstName);
        this.validateField('lastName', lastName);
        this.validateField('password', password);
        this.validateField('confirmPassword', confirmPassword);
        this.validateField('phonenumber', phonenumber);
        this.validateField('address', address);

        return Object.keys(this.state.errors).length === 0;
    }

    toggleShowPassword = () => {
        this.setState({ isShowPassword: !this.state.isShowPassword });
    };

    toggleShowConfirmPassword = () => {
        this.setState({ isShowConfirmPassword: !this.state.isShowConfirmPassword });
    };

    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({ ...copyState }, () => {
            this.validateField(id, event.target.value);
        });
    }

    handleSaveSettings = async () => {
        let { language } = this.props;

        let isValid = this.checkValidateInput();
        if (!isValid) {
            toast.error(language === 'vi' ? "Vui lòng kiểm tra lại các trường không hợp lệ!" : "Please check invalid fields!");
            return;
        }

        let res = await postUpdatePatientService(this.state);
        if (res && res.errCode === 0) {
            toast.success(language === 'vi' ? "Cập nhật thông tin thành công!" : "Information updated successfully!");
            this.setState({ password: '' });
            this.props.updateUserSuccess(this.state);
        } else {
            console.log(language === 'vi' ? "Cập nhật thông tin thất bại!" : "Failed to update information!");
        }
    }

    render() {
        let { language } = this.props;
        let { errors } = this.state;
        return (
            <div className="patient-profile-section">
                <h1 className="main-title">
                    <FormattedMessage id="patient-profile.title" />
                </h1>
                <p className="main-subtitle">
                    <FormattedMessage id="patient-profile.subtitle" />
                </p>

                <div className="settings-grid">
                    <div className="info-card">
                        <div className="card-header">
                            <span className="card-title"><FormattedMessage id="patient-profile.name-label" /></span>
                            <i className="fas fa-user" ></i>
                        </div>
                        <div className="card-body">
                            <input className={`inline-input ${errors.lastName ? 'has-error' : ''}`} value={this.state.lastName || ''} onChange={(e) => this.handleOnChangeInput(e, 'lastName')} placeholder={language === 'vi' ? "Họ" : "Last name"} />
                            {errors.lastName && <div className="inline-error">{errors.lastName}</div>}
                            
                            <input className={`inline-input ${errors.firstName ? 'has-error' : ''}`} value={this.state.firstName || ''} onChange={(e) => this.handleOnChangeInput(e, 'firstName')} placeholder={language === 'vi' ? "Tên" : "First name"} />
                            {errors.firstName && <div className="inline-error">{errors.firstName}</div>}
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="card-header">
                            <span className="card-title"><FormattedMessage id="patient-profile.contact-label" /></span>
                            <i className="fas fa-envelope"></i>
                        </div>
                        <div className="card-body">
                            <p className="readonly-text">{this.state.email}</p>
                            <input className={`inline-input ${errors.phonenumber ? 'has-error' : ''}`} value={this.state.phonenumber || ''} onChange={(e) => this.handleOnChangeInput(e, 'phonenumber')} placeholder={language === 'vi' ? "Số điện thoại" : "Phone number"} />
                            {errors.phonenumber && <div className="inline-error">{errors.phonenumber}</div>}
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="card-header">
                            <span className="card-title"><FormattedMessage id="patient-profile.address-label" /></span>
                            <i className="fas fa-map-marker-alt card-icon blue"></i>
                        </div>
                        <div className="card-body">
                            <textarea className={`inline-input address-textarea ${errors.address ? 'has-error' : ''}`}
                                value={this.state.address || ''}
                                onChange={(e) => this.handleOnChangeInput(e, 'address')}
                                placeholder={language === 'vi' ? "Nhập địa chỉ nhà..." : "Enter your home address..."}
                                rows="3"
                            />
                            {errors.address && <div className="inline-error">{errors.address}</div>}
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="card-header">
                            <span className="card-title"><FormattedMessage id="patient-profile.password-label" /></span>
                            <i className="fas fa-shield-alt card-icon blue"></i>
                        </div>
                        <div className="card-body">
                            <div className="password-input-wrapper">
                                <input type={this.state.isShowPassword ? "text" : "password"}
                                    className={`inline-input ${errors.password ? 'has-error' : ''}`}
                                    placeholder={language === 'vi' ? "Đổi mật khẩu mới..." : "Change new password..."}
                                    value={this.state.password || ''}
                                    onChange={(e) => this.handleOnChangeInput(e, 'password')}
                                    autoComplete="new-password"
                                />
                                <span onClick={this.toggleShowPassword} className="eye-icon-span">
                                    {this.state.isShowPassword ? (
                                        <EyeIcon size={24} color="#86868b" weight="light" />
                                    ) : (
                                        <EyeClosedIcon size={24} color="#86868b" weight="light" />
                                    )}
                                </span>
                            </div>
                            {errors.password && <div className="inline-error">{errors.password}</div>}

                            {this.state.password && (
                                <>
                                    <div className="password-input-wrapper" style={{ marginTop: '10px' }}>
                                        <input type={this.state.isShowConfirmPassword ? "text" : "password"}
                                            className={`inline-input ${errors.confirmPassword ? 'has-error' : ''}`}
                                            placeholder={language === 'vi' ? "Xác nhận mật khẩu mới..." : "Confirm new password..."}
                                            value={this.state.confirmPassword || ''}
                                            onChange={(e) => this.handleOnChangeInput(e, 'confirmPassword')}
                                            autoComplete="new-password"
                                        />
                                        <span onClick={this.toggleShowConfirmPassword} className="eye-icon-span">
                                            {this.state.isShowConfirmPassword ? (
                                                <EyeIcon size={24} color="#86868b" weight="light" />
                                            ) : (
                                                <EyeClosedIcon size={24} color="#86868b" weight="light" />
                                            )}
                                        </span>
                                    </div>
                                    {errors.confirmPassword && <div className="inline-error">{errors.confirmPassword}</div>}

                                    <div className="password-requirements">
                                        <div className={`requirement ${this.getPasswordStrength(this.state.password).length ? 'valid' : 'invalid'}`}>
                                            <i className={`fas ${this.getPasswordStrength(this.state.password).length ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                                            {language === 'vi' ? 'Tối thiểu 6 ký tự' : 'At least 6 characters'}
                                        </div>
                                        <div className={`requirement ${this.getPasswordStrength(this.state.password).hasLetter ? 'valid' : 'invalid'}`}>
                                            <i className={`fas ${this.getPasswordStrength(this.state.password).hasLetter ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                                            {language === 'vi' ? 'Chứa ít nhất 1 chữ cái' : 'At least 1 letter'}
                                        </div>
                                        <div className={`requirement ${this.getPasswordStrength(this.state.password).hasNumber ? 'valid' : 'invalid'}`}>
                                            <i className={`fas ${this.getPasswordStrength(this.state.password).hasNumber ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                                            {language === 'vi' ? 'Chứa ít nhất 1 chữ số' : 'At least 1 number'}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="footer-action">
                    <button className="save-btn" onClick={() => this.handleSaveSettings()}>
                        <FormattedMessage id="patient-profile.btn-save" />
                    </button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    language: state.app.language,
    userInfo: state.user.userInfo,
});

const mapDispatchToProps = dispatch => ({
    updateUserSuccess: (userInfo) => dispatch(action.updateUserSuccess(userInfo))
});

export default connect(mapStateToProps, mapDispatchToProps)(PatientProfile);
