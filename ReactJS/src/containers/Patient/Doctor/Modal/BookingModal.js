import React, { Component } from 'react';
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { LANGUAGES } from '../../../../utils/constant'
import { withRouter } from 'react-router'; // hoặc 'react-router-dom'
import { FormattedMessage } from 'react-intl';
import './BookingModal.scss'
import ProfileDoctor from '../ProfileDoctor'
import _ from 'lodash';
import DatePicker from '../../../../components/Input/DatePicker';
import * as actions from '../../../../store/actions'
import { postBookAppointment } from '../../../../services/userService'
import Select from 'react-select';
import { toast } from 'react-toastify';
import { use } from 'react';
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
            doctorName: ''
        }
    }


    async componentDidMount() {
        this.props.fetchGenderStart();
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        // Gộp điều kiện: Nếu danh sách gender thay đổi HOẶC ngôn ngữ thay đổi
        if (prevProps.genders !== this.props.genders || prevProps.language !== this.props.language) {
            if (this.props.genders && this.props.genders.length > 0) {
                let data = this.buildDataGender(this.props.genders);
                console.log('data', data)
                this.setState({
                    genders: data
                });
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
    }

    buildDataGender = (data) => {
        let result = [];
        let { language } = this.props; // Dùng destructuring cho gọn
        if (data && data.length > 0) {
            data.map((item) => {
                let object = {};
                // Nên dùng LANGUAGES.VI thay vì 'vi' nếu bạn đã định nghĩa constant
                object.label = language === 'vi' ? item.valueVi : item.valueEn;
                object.value = item.keyMap;
                result.push(object);
                return item;
            });
        }
        return result;
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
    handleChangeSelect = (selectedOption) => {
        this.setState({ selectedGender: selectedOption });
    }
    handleConfirmBooking = async () => {
        let { dataTimeModal, userInfo } = this.props
        let date = new Date(this.state.birthday).getTime();
        let res = await postBookAppointment({
            patientId: userInfo && userInfo.id ? userInfo.id : null,
            fullName: this.state.fullName,
            phoneNumber: this.state.phoneNumber,
            email: userInfo && userInfo.email ? userInfo.email : this.state.email,
            address: this.state.address,
            reason: this.state.reason,
            date: date,
            birthday: this.state.birthday,
            gender: this.state.selectedGender.value,
            doctorId: dataTimeModal.doctorId,
            timeType: dataTimeModal.timeType,
            language: this.props.language,
            doctorName: this.state.doctorName
        })
        if (res && res.errCode === 0) {
            toast.success(res.errMessage)
            this.props.closeModal()

            this.setState({
                fullName: '',
                phoneNumber: '',
                email: '',
                address: '',
                reason: '',
                birthday: '',
                selectedGender: '',
                doctorId: '',
                // timeType: '',
            })
        } else {
            toast.error(res.errMessage)
        }

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
        console.log('dataTimeModal', this.state);
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
                        <h5 className="modal-title"><FormattedMessage id="schedule-doctor.title" /></h5>
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
                                    value={this.state.phoneNumber || userInfo?.phoneNumber || ''}
                                    onChange={(event) => { this.handleOnChangeInput(event, 'phoneNumber') }}

                                />
                            </div>
                            <div className="col-6 form-group">
                                <label><FormattedMessage id="schedule-doctor.email" /></label>
                                <input
                                    className="form-control"
                                    type="text"
                                    // Thêm dấu ? sau userInfo và || '' ở cuối
                                    value={this.state.email || userInfo?.email || ''}
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
                                    options={this.state.genders}
                                    className="react-select-container" // Class bọc ngoài
                                    classNamePrefix="react-select"     // Tiền tố cho các class con
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
        genders: state.admin.genders

    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchGenderStart: () => dispatch(actions.fetchGenderStart()),
        // getBookingModal: (id) => dispatch(action.getBookingModal(id))
    };
};

// import { withRouter } from 'react-router'; // hoặc 'react-router-dom'
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BookingModal));
