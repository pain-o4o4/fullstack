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
            progressStatus: 'idle'
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

    handleOnChangeInput = (event, type) => {
        let copyState = { ...this.state }
        copyState[type] = event.target.value
        this.setState({
            ...copyState
        })
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            birthday: date[0]
        })
    }

    handleChangeSelect = (selectedOption, actionMeta) => {
        this.setState({
            [actionMeta.name]: selectedOption
        });
    }

    handleConfirmBooking = async () => {
        this.setState({ isLoading: true, progressStatus: 'encrypting' });
        let { dataTimeModal, isLoggedIn } = this.props;
        let {
            selectedPayment, fullName, email, address,
            birthday, phoneNumber, selectedGender, reason
        } = this.state;

        if (!isLoggedIn) {
            toast.warning(this.props.language === 'vi' ? "Vui Lòng Đăng Nhập Để Thực Hiện Đặt Lịch!" : "Please Login To Book An Appointment!");
            this.props.navigate(path.LOGIN);
            this.setState({ isLoading: false, progressStatus: 'idle' });
            return;
        }

        const emailRe = /\S+@\S+\.\S+/;
        const phoneRe = /^\d+$/;

        if (!fullName || !email || !address || !phoneNumber || !selectedGender || !selectedPayment || !birthday || !reason) {
            toast.error(this.props.language === 'vi' ? "Vui Lòng Điền Đầy Đủ Các Thông Tin Bắt Buộc!" : "Please Fill In All Required Fields!");
            this.setState({ isLoading: false, progressStatus: 'idle' });
            return;
        }

        if (!emailRe.test(email)) {
            toast.error(this.props.language === 'vi' ? "Định Dạng Email Không Hợp Lệ!" : "Invalid Email Format!");
            this.setState({ isLoading: false, progressStatus: 'idle' });
            return;
        }

        if (!phoneRe.test(phoneNumber)) {
            toast.error(this.props.language === 'vi' ? "Số Điện Thoại Không Hợp Lệ!" : "Invalid Phone Number!");
            this.setState({ isLoading: false, progressStatus: 'idle' });
            return;
        }

        if (reason.length < 10) {
            toast.error(this.props.language === 'vi' ? "Vui Lòng Mô Tả Lý Do Khám Chi Tiết Hơn!" : "Please Describe Your Reason In More Detail!");
            this.setState({ isLoading: false, progressStatus: 'idle' });
            return;
        }

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

            clinicName: dataTimeModal.clinicData?.name || doctorInfor.nameClinic,
            addressClinic: dataTimeModal.clinicData?.address || doctorInfor.addressClinic,

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
                                isShowPrice={false}
                                doctorNameFromParent={this.doctorNameFromChild}
                            />
                        </div>
                        <div className="row">
                            <div className="col-md-6 form-group">
                                <label htmlFor="fullName"><FormattedMessage id="schedule-doctor.fullName" /></label>
                                <input
                                    id="fullName"
                                    className="form-control"
                                    type="text"
                                    value={this.state.fullName}
                                    onChange={(event) => { this.handleOnChangeInput(event, 'fullName') }}
                                    placeholder="VD: Nguyễn Văn A"
                                    aria-required="true"
                                />
                            </div>
                            <div className="col-md-6 form-group">
                                <label htmlFor="phoneNumber"><FormattedMessage id="schedule-doctor.phoneNumber" /></label>
                                <input
                                    id="phoneNumber"
                                    className="form-control"
                                    type="tel"
                                    value={this.state.phoneNumber}
                                    onChange={(event) => { this.handleOnChangeInput(event, 'phoneNumber') }}
                                    placeholder="09xx xxx xxx"
                                    aria-required="true"
                                />
                            </div>
                            <div className="col-md-6 form-group">
                                <label htmlFor="email"><FormattedMessage id="schedule-doctor.email" /></label>
                                <input
                                    id="email"
                                    className="form-control"
                                    type="email"
                                    value={this.state.email}
                                    onChange={(event) => { this.handleOnChangeInput(event, "email") }}
                                    placeholder="Email"
                                    aria-required="true"
                                />
                            </div>
                            <div className="col-md-6 form-group">
                                <label htmlFor="address"><FormattedMessage id="schedule-doctor.address" /></label>
                                <input
                                    id="address"
                                    className="form-control"
                                    type="text"
                                    value={this.state.address}
                                    onChange={(event) => { this.handleOnChangeInput(event, "address") }}
                                    placeholder="Địa chỉ"
                                    aria-required="true"
                                />
                            </div>
                            <div className="col-12 form-group">
                                <label htmlFor="reason"><FormattedMessage id="schedule-doctor.reason" /></label>
                                <textarea
                                    id="reason"
                                    className="form-control"
                                    rows="3"
                                    value={this.state.reason}
                                    onChange={(event) => { this.handleOnChangeInput(event, "reason") }}
                                    placeholder="Mô tả triệu chứng..."
                                    aria-required="true"
                                />
                            </div>
                            <div className="col-4 form-group">
                                <label><FormattedMessage id="schedule-doctor.birthday" /></label>
                                <DatePicker
                                    onChange={(date) => { this.handleOnChangeDatePicker(date) }}
                                    className="form-control"
                                    value={this.state.birthday}
                                    maxDate={new Date()}
                                />
                            </div>
                            <div className="col-4 form-group">
                                <label><FormattedMessage id="schedule-doctor.gender" /></label>
                                <Select
                                    value={this.state.selectedGender || null}
                                    onChange={this.handleChangeSelect}
                                    name='selectedGender'
                                    options={this.state.genders}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                            </div>
                            <div className="col-4 form-group">
                                <label><FormattedMessage id="schedule-doctor.payment" /></label>
                                <Select
                                    value={this.state.selectedPayment || null}
                                    onChange={this.handleChangeSelect}
                                    name='selectedPayment'
                                    options={this.state.listPayment}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
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
