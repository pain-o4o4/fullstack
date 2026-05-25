import React, { Component } from 'react';
import { connect } from 'react-redux';
import { initiateRegister } from '../../services/userService';
import './Login.scss';
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import Select from 'react-select';
import * as action from "../../store/actions";
import { withRouter } from '../../components/Navigator';
import { Eye as EyeIcon, EyeClosed as EyeClosedIcon } from '@phosphor-icons/react';
class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
            phonenumber: '',
            gender: 'M',
            errMessage: '',
            errors: {},
            isShowPassword: false
        }
    }
    componentDidMount() {
        this.props.fetchGenderStart()
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
        // Industry-standard robust email regex enforcing valid domain structure and TLD
        const emailRe = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÂÊÔƠưăâêôơ\s]+$/;
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
        if (fieldName === 'phonenumber') {
            // Automatically strip spaces, dots, and dashes to make it super friendly
            let cleanPhone = (value || '').replace(/[\s\-\.]/g, '');

            // Convert country codes like +84 or 84 to 0
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

        this.setState({ errors, errMessage: '' });
    }

    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({ ...copyState }, () => {
            this.validateField(id, event.target.value);
        });
    }

    handleEmailBlur = (e) => {
        let val = e.target.value.trim();
        if (val && !val.includes('@')) {
            val = val + '@gmail.com';
            this.setState({ email: val }, () => {
                this.validateField('email', val);
            });
        }
    };

    handleKeyDown = (event, currentField) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const fields = ['firstName', 'lastName', 'email', 'password', 'phonenumber', 'address'];
            const currentIndex = fields.indexOf(currentField);

            const allFilled = fields.every(field => {
                const val = this.state[field];
                return typeof val === 'string' ? val.trim() !== '' : !!val;
            });
            const hasErrors = Object.keys(this.state.errors).length > 0;

            if (currentField === 'address' || (allFilled && !hasErrors)) {
                this.handleRegister();
            } else if (currentIndex !== -1 && currentIndex < fields.length - 1) {
                const nextFieldName = fields[currentIndex + 1];
                const nextInput = document.querySelector(`input[name="${nextFieldName}"]`);
                if (nextInput) {
                    nextInput.focus();
                }
            }
        }
    };

    checkValidateInput = () => {
        const { firstName, lastName, email, password, phonenumber, address } = this.state;
        this.validateField('firstName', firstName);
        this.validateField('lastName', lastName);
        this.validateField('email', email);
        this.validateField('password', password);
        this.validateField('phonenumber', phonenumber);
        this.validateField('address', address);

        return Object.keys(this.state.errors).length === 0;
    }

    handleRegister = async () => {
        this.setState({ errMessage: '' });

        // Auto append domain if not present upon submission
        let email = this.state.email.trim();
        if (email && !email.includes('@')) {
            email = email + '@gmail.com';
            this.setState({ email }, () => {
                let isValid = this.checkValidateInput();
                if (!isValid) return;
                this.proceedRegister();
            });
        } else {
            let isValid = this.checkValidateInput();
            if (!isValid) return;
            this.proceedRegister();
        }
    }

    proceedRegister = async () => {
        try {
            let payload = {
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phonenumber: this.state.phonenumber,
                gender: this.state.gender,
                roleId: 'R3',
            };
            let res = await initiateRegister(payload);

            if (res && res.errCode !== 0) {
                console.log(res.errMessage || res.message);
                this.setState({ errMessage: res.errMessage || res.message });
            } else {
                this.props.setRegisterSession({
                    email: payload.email,
                    registrationSessionToken: res.registrationSessionToken,
                    draftData: payload
                });
                console.log("Mã OTP đã được gửi. Vui lòng kiểm tra Gmail.");
                this.props.navigate('/register/verify-otp');
            }
        } catch (e) {
            console.log(e);
        }
    }
    toggleShowPassword = () => {
        this.setState({ isShowPassword: !this.state.isShowPassword });
    };

    handleSelectGender = () => {
        let { genders, language } = this.props;
        let options = genders && genders.length > 0 ? genders.map(item => ({
            value: item.keyMap,
            label: language === 'vi' ? item.valueVi : item.valueEn
        })) : [];
        return options
    }
    render() {
        let { genders, language } = this.props;
        let { errors } = this.state;

        console.log('>>> check state:', this.state);
        return (
            <div className="auth-split-container">
                <div className="welcome-left">
                    <div className="welcome-text">
                        <h1><FormattedMessage id="register.join" /></h1>
                        <p><FormattedMessage id="register.join-desc" /></p>
                    </div>
                </div>
                <div className="form-right-signup">
                    <div className="container">
                        <div className="header">
                            <div className="text"><FormattedMessage id="register.signup" /></div>
                            <div className="underline"></div>
                        </div>
                        <div className="inputs">
                            
                            <div className="input-group-row">
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div className={`input ${errors.firstName ? 'has-error' : ''}`}>
                                        <input name="firstName" placeholder={language === 'vi' ? 'Tên' : 'First Name'}
                                            value={this.state.firstName}
                                            onChange={(event) => this.handleOnChangeInput(event, 'firstName')}
                                            onKeyDown={(event) => this.handleKeyDown(event, 'firstName')}
                                        />
                                    </div>
                                    {errors.firstName && <div className="inline-error">{errors.firstName}</div>}
                                </div>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div className={`input ${errors.lastName ? 'has-error' : ''}`}>
                                        <input name="lastName" placeholder={language === 'vi' ? 'Họ' : 'Last Name'}
                                            value={this.state.lastName}
                                            onChange={(event) => this.handleOnChangeInput(event, 'lastName')}
                                            onKeyDown={(event) => this.handleKeyDown(event, 'lastName')}
                                        />
                                    </div>
                                    {errors.lastName && <div className="inline-error">{errors.lastName}</div>}
                                </div>
                            </div>

                            
                            <div className={`input ${errors.email ? 'has-error' : ''}`}>
                                <input name="email" type="email" placeholder={language === 'vi' ? 'Email' : 'Email'}
                                    value={this.state.email}
                                    onChange={(event) => this.handleOnChangeInput(event, 'email')}
                                    onBlur={this.handleEmailBlur}
                                    onKeyDown={(event) => this.handleKeyDown(event, 'email')} />
                            </div>
                            {errors.email && <div className="inline-error">{errors.email}</div>}

                            
                            <div className={`input ${errors.password ? 'has-error' : ''}`}>
                                <input name="password" type={this.state.isShowPassword ? "text" : "password"} placeholder={language === 'vi' ? 'Mật khẩu' : 'Password'}
                                    value={this.state.password}
                                    onChange={(event) => this.handleOnChangeInput(event, 'password')}
                                    onKeyDown={(event) => this.handleKeyDown(event, 'password')} />
                                <span onClick={this.toggleShowPassword} className="eye-icon-span">
                                    {this.state.isShowPassword ? (
                                        <EyeIcon size={28} color="#1c246d" weight="light" />
                                    ) : (
                                        <EyeClosedIcon size={28} color="#1c246d" weight="light" />
                                    )}
                                </span>
                            </div>
                            {errors.password && <div className="inline-error">{errors.password}</div>}

                            
                            {this.state.password && (
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
                            )}

                            <div className="input-group-row">
                                
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div className={`input ${errors.phonenumber ? 'has-error' : ''}`}>
                                        <input name="phonenumber" placeholder={language === 'vi' ? 'Số điện thoại' : 'Phone Number'}
                                            value={this.state.phonenumber}
                                            onChange={(event) => this.handleOnChangeInput(event, 'phonenumber')}
                                            onKeyDown={(event) => this.handleKeyDown(event, 'phonenumber')} />
                                    </div>
                                    {errors.phonenumber && <div className="inline-error">{errors.phonenumber}</div>}
                                </div>
                                
                                <div className="input-gender">
                                    <Select
                                        className="react-select-container"
                                        classNamePrefix="select"
                                        options={this.handleSelectGender()}
                                        placeholder={<FormattedMessage id="register.gender" />}
                                        onChange={(selected) => this.handleOnChangeInput({ target: { value: selected.value } }, 'gender')}
                                    />
                                </div>
                            </div>

                            
                            <div className={`input ${errors.address ? 'has-error' : ''}`}>
                                <input name="address" placeholder={language === 'vi' ? 'Địa chỉ' : 'Address'}
                                    value={this.state.address}
                                    onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                    onKeyDown={(event) => this.handleKeyDown(event, 'address')} />
                            </div>
                            {errors.address && <div className="inline-error">{errors.address}</div>}

                            <div className="error-message">{this.state.errMessage}</div>

                            <div className="submit-container">
                                <button className="submit" onClick={this.handleRegister}>
                                    <FormattedMessage id="register.register-btn" />
                                </button>
                                <button
                                    className="submit gray"
                                    onClick={() => this.props.navigate('/login')}
                                >
                                    <FormattedMessage id="register.back-btn" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders
    };
};
const mapDispatchToProps = dispatch => ({
    fetchGenderStart: () => dispatch(action.fetchGenderStart()),
    setRegisterSession: (payload) => dispatch(action.setRegisterSession(payload)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Register));