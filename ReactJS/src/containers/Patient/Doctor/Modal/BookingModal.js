import React, { Component } from 'react';
import { connect } from "react-redux";
import { Button, Modal } from 'reactstrap';
import { LANGUAGES } from '../../../../utils/constant'
import { withRouter } from '../../../../components/Navigator';
import { FormattedMessage } from 'react-intl';
import './BookingModal.scss'
import ProfileDoctor from '../ProfileDoctor'
import _ from 'lodash';
import DatePicker from '../../../../components/Input/DatePicker';
import * as actions from '../../../../store/actions'
import { postBookAppointment } from '../../../../services/userService'
import Select from 'react-select';
import { toast } from 'react-toastify';
import { path } from '../../../../utils/constant'

class BookingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            birthday: '',
            doctorId: '',
            timeType: '',
            selectedGender: '',
            genders: '',
            doctorName: '',

            selectedPayment: '',
            listPayment: [],
            priceData: '',
            provinceData: '',
            currentDoctorId: -1,
            isLoading: false,
            progressStatus: 'idle',
            errors: {}
        }
    }

    async componentDidMount() {
        this.props.fetchGenderStart();
        if (this.props.params && this.props.params.id) {
            let id = this.props.params.id;
            this.setState({
                currentDoctorId: id
            });
        }
        let { userInfo } = this.props;
        if (userInfo) {
            this.setState({
                fullName: (userInfo.firstName && userInfo.lastName) ? `${userInfo.lastName} ${userInfo.firstName}` : this.state.fullName,
                email: userInfo.email || '',
                phoneNumber: userInfo.phonenumber || userInfo.phoneNumber || '',
                address: userInfo.address || ''
            });
        }
    }

    buildDataInput = (dataInput, type) => {
        let result = [];
        let { language } = this.props;

        if (dataInput && dataInput.length > 0) {
            if (type === "USER") {
                dataInput.forEach((item, index) => {
                    let object = {};
                    let labelVi = `${item.lastName} ${item.firstName}`;
                    let labelEn = `${item.firstName} ${item.lastName}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.id;
                    result.push(object);
                });
                return result;
            }
            if (type === "PAYMENT" || type === "PROVINCE") {
                dataInput.forEach((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi}`;
                    let labelEn = `${item.valueEn}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object);
                });
                return result;
            }
            if (type === "PRICE") {
                dataInput.forEach((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi}` + ' VNĐ';
                    let labelEn = `${item.valueEn}` + ' USD';
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object);
                });
                return result;
            }
            if (type === "SPECIALTY") {
                dataInput.forEach((item, index) => {
                    let object = {};
                    object.label = item.name;
                    object.value = item.id;
                    result.push(object);
                });
                return result;
            }
            if (type === "CLINIC") {
                dataInput.forEach((item, index) => {
                    let object = {};
                    object.label = item.name;
                    object.value = item.id;
                    result.push(object);
                });
                return result;
            }
            if (type === "GENDER") {
                dataInput.forEach((item) => {
                    let object = {};
                    object.label = language === 'vi' ? item.valueVi : item.valueEn;
                    object.value = item.keyMap;
                    result.push(object);
                });
            }
        }
        return result;
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.userInfo !== this.props.userInfo) {
            let { userInfo } = this.props;
            if (userInfo) {
                this.setState({
                    fullName: (userInfo.firstName && userInfo.lastName) ? `${userInfo.lastName} ${userInfo.firstName}` : this.state.fullName,
                    email: userInfo.email || this.state.email || '',
                    phoneNumber: userInfo.phonenumber || userInfo.phoneNumber || this.state.phoneNumber || '',
                    address: userInfo.address || this.state.address || ''
                });
            }
        }
        if (prevProps.genders !== this.props.genders ||
            prevProps.language !== this.props.language ||
            prevProps.detailDoctor !== this.props.detailDoctor) {
            if (this.props.genders && this.props.genders.length > 0) {
                let data = this.buildDataInput(this.props.genders, 'GENDER');
                this.setState({
                    genders: data
                });
            }
            if (this.props.detailDoctor && this.props.detailDoctor.doctorinforData) {
                let paymentData = this.props.detailDoctor.doctorinforData.paymentTypeData;
                let listPaymentConvert = this.buildDataInput([paymentData], 'PAYMENT');
                this.setState({
                    listPayment: listPaymentConvert,
                    selectedPayment: this.props.detailDoctor.doctorinforData.paymentId
                })
            }
        }
        if (prevProps.dataTimeModal !== this.props.dataTimeModal) {
            if (this.props.dataTimeModal && this.props.dataTimeModal.doctorId) {
                this.setState({
                    doctorId: this.props.dataTimeModal.doctorId,
                    timeType: this.props.dataTimeModal.timeType
                })
            }
        }
        if (prevProps.params && this.props.params && prevProps.params.id !== this.props.params.id) {
            let id = this.props.params.id;
            this.setState({
                currentDoctorId: id
            });
            this.props.getDetailDoctor(id);
        }
    }

    validateField = (fieldName, value) => {
        let { errors } = this.state;
        let { language } = this.props;
        const nameRegex = /^[\p{L}\s]+$/u;
        const xssRegex = /<[^>]*>/g;

        const cleanVal = (value || '').trim();

        if (fieldName === 'fullName') {
            if (!cleanVal) {
                errors.fullName = language === 'vi' ? 'Vui lòng nhập họ và tên!' : 'Full name is required!';
            } else if (xssRegex.test(value)) {
                errors.fullName = language === 'vi' ? 'Họ và tên chứa ký tự không hợp lệ!' : 'Full name contains invalid characters!';
            } else if (!nameRegex.test(cleanVal)) {
                errors.fullName = language === 'vi' ? 'Họ và tên chỉ được phép chứa các chữ cái!' : 'Full name can only contain alphabetic characters!';
            } else if (cleanVal.split(/\s+/).length < 2) {
                errors.fullName = language === 'vi' ? 'Vui lòng nhập cả Họ và Tên!' : 'Please enter both first and last name!';
            } else {
                delete errors.fullName;
            }
        }
        if (fieldName === 'phoneNumber') {
            let cleanPhone = (value || '').replace(/[\s\-\.]/g, '');
            if (cleanPhone.startsWith('+84')) {
                cleanPhone = '0' + cleanPhone.slice(3);
            } else if (cleanPhone.startsWith('84')) {
                cleanPhone = '0' + cleanPhone.slice(2);
            }

            if (!cleanPhone) {
                errors.phoneNumber = language === 'vi' ? 'Vui lòng nhập số điện thoại!' : 'Phone number is required!';
            } else if (!/^\+?\d+$/.test(cleanPhone)) {
                errors.phoneNumber = language === 'vi' ? 'Số điện thoại chỉ được chứa các chữ số!' : 'Phone number must contain only digits!';
            } else if (!cleanPhone.startsWith('0')) {
                errors.phoneNumber = language === 'vi' ? 'Số điện thoại phải bắt đầu bằng số 0!' : 'Phone number must start with 0!';
            } else if (cleanPhone.length !== 10) {
                errors.phoneNumber = language === 'vi' ? 'Số điện thoại phải có đúng 10 chữ số!' : 'Phone number must be exactly 10 digits!';
            } else if (!/^(03|05|07|08|09)\d{8}$/.test(cleanPhone)) {
                errors.phoneNumber = language === 'vi' ? 'Đầu số không hợp lệ (hỗ trợ 03, 05, 07, 08, 09)!' : 'Invalid phone prefix (starts with 03, 05, 07, 08, 09)!';
            } else {
                delete errors.phoneNumber;
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
        if (fieldName === 'reason') {
            if (!cleanVal) {
                errors.reason = language === 'vi' ? 'Vui lòng nhập lý do khám bệnh!' : 'Reason is required!';
            } else if (cleanVal.length < 10) {
                errors.reason = language === 'vi' ? 'Vui lòng mô tả lý do khám chi tiết hơn (tối thiểu 10 ký tự)!' : 'Please describe your reason in more detail (at least 10 characters)!';
            } else {
                delete errors.reason;
            }
        }

        this.setState({ errors });
    }

    checkValidateInput = () => {
        const { fullName, phoneNumber, address, reason, birthday, selectedGender, selectedPayment } = this.state;
        let { language } = this.props;
        let { errors } = this.state;

        this.validateField('fullName', fullName);
        this.validateField('phoneNumber', phoneNumber);
        this.validateField('address', address);
        this.validateField('reason', reason);

        if (!birthday) {
            errors.birthday = language === 'vi' ? 'Vui lòng chọn ngày sinh!' : 'Please select your birthday!';
        } else {
            delete errors.birthday;
        }

        if (!selectedGender) {
            errors.selectedGender = language === 'vi' ? 'Vui lòng chọn giới tính!' : 'Please select your gender!';
        } else {
            delete errors.selectedGender;
        }

        if (!selectedPayment) {
            errors.selectedPayment = language === 'vi' ? 'Vui lòng chọn phương thức thanh toán!' : 'Please select a payment method!';
        } else {
            delete errors.selectedPayment;
        }

        this.setState({ errors });
        return Object.keys(errors).length === 0;
    }

    handleOnChangeInput = (event, type) => {
        let copyState = { ...this.state }
        copyState[type] = event.target.value
        this.setState({
            ...copyState
        }, () => {
            this.validateField(type, event.target.value);
        });
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            birthday: date[0]
        }, () => {
            let { errors } = this.state;
            if (date[0]) {
                delete errors.birthday;
            } else {
                errors.birthday = this.props.language === 'vi' ? 'Vui lòng chọn ngày sinh!' : 'Please select your birthday!';
            }
            this.setState({ errors });
        });
    }

    handleChangeSelect = (selectedOption, actionMeta) => {
        this.setState({
            [actionMeta.name]: selectedOption
        }, () => {
            let { errors } = this.state;
            if (selectedOption) {
                delete errors[actionMeta.name];
            } else {
                errors[actionMeta.name] = this.props.language === 'vi' ? 'Vui lòng chọn mục này!' : 'Please select this field!';
            }
            this.setState({ errors });
        });
    }

    handleConfirmBooking = async () => {
        let { isLoggedIn } = this.props;

        if (!isLoggedIn) {
            toast.warning(this.props.language === 'vi' ? "Vui Lòng Đăng Nhập Để Thực Hiện Đặt Lịch!" : "Please Login To Book An Appointment!");
            this.props.navigate(path.LOGIN);
            return;
        }

        let isValid = this.checkValidateInput();
        if (!isValid) {
            toast.error(this.props.language === 'vi' ? "Vui Lòng Điền Đầy Đủ Và Chính Xác Các Thông Tin!" : "Please Fill In All Fields Correctly!");
            return;
        }

        this.setState({ isLoading: true, progressStatus: 'encrypting' });

        setTimeout(() => {
            this.setState({ progressStatus: 'sending' });
            setTimeout(() => {
                this.handleOnlinePayment();
            }, 1200);
        }, 1000);
    }

    handleOnlinePayment = async () => {
        let { dataTimeModal, userInfo, detailDoctor, language } = this.props;
        let { fullName, phoneNumber, email, address, reason, birthday, selectedGender } = this.state;

        let date = new Date(birthday).getTime();
        let doctorInfor = detailDoctor?.doctorinforData || {};

        let timeLabel = language === LANGUAGES.VI
            ? dataTimeModal.timeTypeData.valueVi
            : dataTimeModal.timeTypeData.valueEn;

        let bookingData = {
            patientId: userInfo?.id || null,
            fullName: fullName,
            phoneNumber: phoneNumber,
            email: email,
            address: address,
            reason: reason,
            date: dataTimeModal.date,
            birthday: date,
            birthdayLabel: new Date(birthday).toLocaleDateString(language === LANGUAGES.VI ? 'vi-VN' : 'en-US'),
            gender: selectedGender.value,
            genderLabel: selectedGender.label,
            doctorId: dataTimeModal.doctorId,
            clinicId: dataTimeModal.clinicId,
            timeType: dataTimeModal.timeType,
            timeLabel: timeLabel,
            language: language,
            doctorName: this.state.doctorName,

            clinicName: dataTimeModal.clinicData?.name || '',
            addressClinic: dataTimeModal.clinicData?.address || '',

            paymentId: doctorInfor.paymentId,
            price: doctorInfor.priceTypeData?.valueVi || 0,
            priceId: language === LANGUAGES.VI ? doctorInfor.priceTypeData?.valueVi + ' VNĐ' : doctorInfor.priceTypeData?.valueEn + ' USD',

            specialtyName: detailDoctor?.specialtyData?.name || '',
            doctorImage: detailDoctor?.image || '',
        };

        this.props.navigate(path.PAYMENT, {
            state: { bookingData: bookingData }
        });
        this.setState({ isLoading: false, progressStatus: 'idle' });
    }

    doctorNameFromChild = (name) => {
        this.setState({
            doctorName: name
        })
    }

    render() {
        let { language, isTheModalOpen, closeModal, dataTimeModal } = this.props
        let doctorId = dataTimeModal && !_.isEmpty(dataTimeModal)
            ? dataTimeModal.doctorId : '';
        let { isLoading, progressStatus } = this.state;

        return (
            <Modal
                isOpen={isTheModalOpen}
                className={'booking-modal'}
                size="lg"
                centered
                fade={false}
                role="dialog"
                aria-labelledby="modal-title"
                aria-modal="true"
            >
                <div className="booking-modal-content">
                    <div className="booking-modal-header">
                        <h5 className="modal-title" id="modal-title">
                            <FormattedMessage id="schedule-doctor.title" />
                        </h5>
                        <button type="button" className="close" onClick={closeModal} aria-label="Close modal">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="booking-modal-body">
                        <div className="infor-doctor">
                            <ProfileDoctor
                                doctorId={doctorId}
                                isShowDescription={false}
                                isShowLinkDetail={false}
                                isShowPrice={true}
                                dataTimeModal={dataTimeModal}
                                doctorNameFromParent={this.doctorNameFromChild}
                            />
                        </div>
                        <div className="row">
                            <div className="col-md-6 form-group">
                                <label htmlFor="fullName"><FormattedMessage id="schedule-doctor.fullName" /></label>
                                <input
                                    id="fullName"
                                    className={`form-control ${this.state.errors.fullName ? 'is-invalid' : ''}`}
                                    type="text"
                                    value={this.state.fullName}
                                    onChange={(event) => { this.handleOnChangeInput(event, 'fullName') }}
                                    placeholder="VD: Nguyễn Văn A"
                                    aria-required="true"
                                />
                                {this.state.errors.fullName && <div className="invalid-feedback">{this.state.errors.fullName}</div>}
                            </div>
                            <div className="col-md-6 form-group">
                                <label htmlFor="phoneNumber"><FormattedMessage id="schedule-doctor.phoneNumber" /></label>
                                <input
                                    id="phoneNumber"
                                    className={`form-control ${this.state.errors.phoneNumber ? 'is-invalid' : ''}`}
                                    type="tel"
                                    value={this.state.phoneNumber}
                                    onChange={(event) => { this.handleOnChangeInput(event, 'phoneNumber') }}
                                    placeholder="09xx xxx xxx"
                                    aria-required="true"
                                />
                                {this.state.errors.phoneNumber && <div className="invalid-feedback">{this.state.errors.phoneNumber}</div>}
                            </div>
                            <div className="col-md-6 form-group">
                                <label htmlFor="email"><FormattedMessage id="schedule-doctor.email" /></label>
                                <input
                                    id="email"
                                    className="form-control locked-input"
                                    type="email"
                                    value={this.state.email}
                                    readOnly
                                    placeholder="Email"
                                    aria-required="true"
                                />
                                <small className="form-text text-muted" style={{ color: '#86868b', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                                    <i className="fas fa-lock" style={{ marginRight: '4px' }}></i>
                                    {language === 'vi' ? 'Email được điền tự động từ tài khoản để tránh spam.' : 'Email is auto-filled from your account to prevent spam.'}
                                </small>
                            </div>
                            <div className="col-md-6 form-group">
                                <label htmlFor="address"><FormattedMessage id="schedule-doctor.address" /></label>
                                <input
                                    id="address"
                                    className={`form-control ${this.state.errors.address ? 'is-invalid' : ''}`}
                                    type="text"
                                    value={this.state.address}
                                    onChange={(event) => { this.handleOnChangeInput(event, "address") }}
                                    placeholder="Địa chỉ"
                                    aria-required="true"
                                />
                                {this.state.errors.address && <div className="invalid-feedback">{this.state.errors.address}</div>}
                            </div>
                            <div className="col-12 form-group">
                                <label htmlFor="reason"><FormattedMessage id="schedule-doctor.reason" /></label>
                                <textarea
                                    id="reason"
                                    className={`form-control ${this.state.errors.reason ? 'is-invalid' : ''}`}
                                    rows="3"
                                    value={this.state.reason}
                                    onChange={(event) => { this.handleOnChangeInput(event, "reason") }}
                                    placeholder="Mô tả triệu chứng..."
                                    aria-required="true"
                                />
                                {this.state.errors.reason && <div className="invalid-feedback">{this.state.errors.reason}</div>}
                            </div>
                            <div className="col-4 form-group">
                                <label><FormattedMessage id="schedule-doctor.birthday" /></label>
                                <DatePicker
                                    onChange={(date) => { this.handleOnChangeDatePicker(date) }}
                                    className={`form-control ${this.state.errors.birthday ? 'is-invalid' : ''}`}
                                    value={this.state.birthday}
                                    maxDate={new Date()}
                                />
                                {this.state.errors.birthday && <div className="invalid-feedback">{this.state.errors.birthday}</div>}
                            </div>
                            <div className="col-4 form-group">
                                <label><FormattedMessage id="schedule-doctor.gender" /></label>
                                <Select
                                    value={this.state.selectedGender || null}
                                    onChange={this.handleChangeSelect}
                                    name='selectedGender'
                                    options={this.state.genders}
                                    className={`react-select-container ${this.state.errors.selectedGender ? 'is-invalid' : ''}`}
                                    classNamePrefix="react-select"
                                />
                                {this.state.errors.selectedGender && <div className="invalid-feedback">{this.state.errors.selectedGender}</div>}
                            </div>
                            <div className="col-4 form-group">
                                <label><FormattedMessage id="schedule-doctor.payment" /></label>
                                <Select
                                    value={this.state.selectedPayment || null}
                                    onChange={this.handleChangeSelect}
                                    name='selectedPayment'
                                    options={this.state.listPayment}
                                    className={`react-select-container ${this.state.errors.selectedPayment ? 'is-invalid' : ''}`}
                                    classNamePrefix="react-select"
                                />
                                {this.state.errors.selectedPayment && <div className="invalid-feedback">{this.state.errors.selectedPayment}</div>}
                            </div>
                        </div>

                        <div className="medical-security-badge" role="note">
                            <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 0L0 3V8C0 12.33 3 16 7 16C11 16 14 12.33 14 8V3L7 0ZM12 8C12 11.23 9.87 14.12 7 14.93C4.13 14.12 2 11.23 2 8V4.31L7 2.17L12 4.31V8Z" fill="#248A3D"/>
                                <path d="M10 6L6 10L4 8" stroke="#248A3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>Dữ liệu của bạn được mã hóa đầu cuối (End-to-end Encrypted)</span>
                        </div>

                        <div className="booking-modal-footer">
                            <button
                                type="button"
                                className="btn-cancel"
                                onClick={closeModal}
                                disabled={isLoading}
                                aria-disabled={isLoading}
                            >
                                <FormattedMessage id="schedule-doctor.cancel" />
                            </button>
                            <button
                                className={`btn-booking-confirm ${progressStatus}`}
                                onClick={() => { this.handleConfirmBooking() }}
                                disabled={isLoading}
                                aria-busy={isLoading}
                            >
                                <span className="btn-text">
                                    {progressStatus === 'idle' && <FormattedMessage id="schedule-doctor.confirm" />}
                                    {progressStatus === 'encrypting' && "Đang mã hóa dữ liệu..."}
                                    {progressStatus === 'sending' && "Đang gửi yêu cầu..."}
                                </span>
                                <div className="btn-progress-bar"></div>
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        userInfo: state.user.userInfo,
        isLoggedIn: state.user.isLoggedIn,
        allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,
        genders: state.admin.genders,
        detailDoctor: state.admin.detailDoctor
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchGenderStart: () => dispatch(actions.fetchGenderStart()),
        getRequiredDoctorInfor: (id) => dispatch(actions.getRequiredDoctorInfor(id)),
        getDetailDoctor: (id) => dispatch(actions.getDetailDoctor(id)),
        saveBookingData: (data) => dispatch(actions.saveBookingData(data))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BookingModal));
