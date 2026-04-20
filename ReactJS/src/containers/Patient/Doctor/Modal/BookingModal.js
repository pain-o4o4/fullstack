import React, { Component } from 'react';
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { LANGUAGES } from '../../../../utils/constant'
import { withRouter } from '../../../../components/Navigator'; // hoặc 'react-router-dom'
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
            // priceId: '',
            priceData: '',
            // provinceId: '',
            provinceData: '',
            currentDoctorId: -1
        }
    }

    async componentDidMount() {
        this.props.fetchGenderStart();
        if (this.props.params && this.props.params.id) {
            let id = this.props.params.id;
            this.setState({
                currentDoctorId: id // Thêm dòng này
            });

        }
    }
    buildDataInput = (dataInput, type) => {
        let result = [];
        let { language } = this.props;

        if (dataInput && dataInput.length > 0) {
            if (type === "USER") {
                dataInput.map((item, index) => {
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
                dataInput.map((item, index) => {
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
                dataInput.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi}` + 'VNđ';
                    let labelEn = `${item.valueEn}` + 'USD$';
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object);
                });
                return result;
            }
            if (type === "SPECIALTY") {
                dataInput.map((item, index) => {
                    let object = {};
                    object.label = item.name;
                    object.value = item.id;
                    result.push(object);
                });
                return result;
            }
            if (type === "CLINIC") {
                dataInput.map((item, index) => {
                    let object = {};
                    object.label = item.name;
                    object.value = item.id;
                    result.push(object);
                });
                return result;
            }
            if (type === "GENDER") {
                dataInput.map((item) => {
                    let object = {};
                    object.label = language === 'vi' ? item.valueVi : item.valueEn;
                    object.value = item.keyMap;
                    result.push(object);
                    return item;
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
                    fullName: userInfo.firstName && userInfo.lastName ? `${userInfo.lastName} ${userInfo.firstName}` : this.state.fullName,
                    email: userInfo.email || this.state.email,
                    phoneNumber: userInfo.phoneNumber || this.state.phoneNumber,
                    address: userInfo.address || this.state.address
                });
            }
        }
        if (prevProps.genders !== this.props.genders ||
            prevProps.language !== this.props.language ||
            prevProps.detailDoctor !== this.props.detailDoctor) {
            if (this.props.genders && this.props.genders.length > 0) {
                let data = this.buildDataInput(this.props.genders, 'GENDER');
                console.log('data', data)
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
        let { dataTimeModal, userInfo } = this.props;
        let {
            selectedPayment, fullName,
            email, address, birthday,
            phoneNumber, selectedGender
        } = this.state;
        if (!fullName || !email || !address ||
            !phoneNumber || !selectedGender ||
            !selectedPayment) {
            toast.error("Missing required information!");
            return;
        }
        let timestamp = new Date(birthday).getTime();
        if (selectedPayment === 'PAY1') {
            toast.warning(`
            Currently, the system only supports QR code payments. 
            Please choose another payment method!`
            );
        } else {
            this.handleOnlinePayment();
        }
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
            timeType: dataTimeModal.timeType,
            timeLabel: timeLabel,
            language: language,
            doctorName: this.state.doctorName,

            // Data cho PayOS và hiển thị Payment
            paymentId: doctorInfor.paymentId,
            price: doctorInfor.priceTypeData?.valueVi || 0,
            priceId: language === LANGUAGES.VI ? doctorInfor.priceTypeData?.valueVi + ' VNĐ' : doctorInfor.priceTypeData?.valueEn + ' USD',

            // Data bổ sung cho trang Payment
            clinicName: doctorInfor.nameClinic,
            addressClinic: doctorInfor.addressClinic,
            specialtyName: detailDoctor?.specialtyData?.name || '',
            doctorImage: detailDoctor?.image || '', // Pass the image string to Payment page
        };

        this.props.navigate(path.PAYMENT, {
            state: { bookingData: bookingData }
        });
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
        console.log('dataTimeModal', dataTimeModal);
        console.log('doctorId', this.state);
        let { userInfo } = this.props
        return (
            <Modal
                isOpen={isTheModalOpen}
                className={'booking-modal'}
                size="lg"
                centered
            >
                <div className="booking-modal-content">
                    <div className="booking-modal-header">
                        <h5 className="modal-title">
                            <FormattedMessage id="schedule-doctor.title"
                            />
                        </h5>
                        <button type="button" className="close">
                            <span
                                onClick={closeModal}
                                aria-hidden="true">×</span>
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
                            <div className="col-6 form-group">
                                <label><FormattedMessage id="schedule-doctor.fullName" /></label>
                                <input
                                    className="form-control"
                                    type="text"
                                    value={this.state.fullName}
                                    onChange={(event) => { this.handleOnChangeInput(event, 'fullName') }}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label><FormattedMessage id="schedule-doctor.phoneNumber" /></label>
                                <input
                                    className="form-control"
                                    type="text"
                                    value={this.state.phoneNumber}
                                    onChange={(event) => { this.handleOnChangeInput(event, 'phoneNumber') }}

                                />
                            </div>
                            <div className="col-6 form-group">
                                <label><FormattedMessage id="schedule-doctor.email" /></label>
                                <input
                                    className="form-control"
                                    type="text"
                                    // Thêm dấu ? sau userInfo và || '' ở cuối
                                    value={this.state.email}
                                    onChange={(event) => { this.handleOnChangeInput(event, "email") }}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label><FormattedMessage id="schedule-doctor.address" /></label>
                                <input
                                    className="form-control"
                                    type="text"
                                    value={this.state.address}
                                    onChange={(event) => { this.handleOnChangeInput(event, "address") }}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label><FormattedMessage id="schedule-doctor.reason" /></label>
                                <input
                                    className="form-control"
                                    type="text"
                                    value={this.state.reason}
                                    onChange={(event) => { this.handleOnChangeInput(event, "reason") }}

                                />
                            </div>
                            <div className="col-6 form-group">
                                <label><FormattedMessage id="schedule-doctor.birthday" /></label>
                                <DatePicker
                                    onChange={(date) => { this.handleOnChangeDatePicker(date) }}
                                    className="form-control"
                                    value={this.state.birthday}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label><FormattedMessage id="schedule-doctor.gender" /></label>
                                <Select
                                    value={this.state.selectedGender}
                                    onChange={this.handleChangeSelect}
                                    name='selectedGender'
                                    options={this.state.genders}
                                    className="react-select-container" // Class bọc ngoài
                                    classNamePrefix="react-select"     // Tiền tố cho các class con
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label><FormattedMessage id="schedule-doctor.payment" /></label>
                                <Select
                                    value={this.state.selectedPayment}
                                    onChange={this.handleChangeSelect}
                                    name='selectedPayment'
                                    options={this.state.listPayment}
                                    // placeholder="Chọn phương thức thanh toán"
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                            </div>
                        </div>
                        <div className="booking-modal-footer">

                            <button
                                type="button"
                                className="btn btn-primary"
                                data-dismiss="modal"
                            >
                                <FormattedMessage id="schedule-doctor.cancel" />
                            </button>
                            <Button
                                type="button"
                                className="btn btn-primary"
                                data-dismiss="modal"
                                onClick={() => { this.handleConfirmBooking() }}
                            >
                                <FormattedMessage id="schedule-doctor.confirm" />
                            </Button>

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

// import { withRouter } from 'react-router'; // hoặc 'react-router-dom'
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BookingModal));
