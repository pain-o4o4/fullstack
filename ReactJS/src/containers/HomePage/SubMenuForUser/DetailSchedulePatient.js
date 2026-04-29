import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { getDetailSchedulePatient } from '../../../services/userService';
import moment from 'moment';
import './DetailSchedulePatient.scss';
import HomeHeader from '../HomeHeader';
import { withRouter } from '../../../components/Navigator';
import { LANGUAGES } from '../../../utils';

class DetailSchedulePatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailBooking: {},
            isLoading: true
        }
    }

    async componentDidMount() {
        if (this.props.params && this.props.params.bookingId) {
            let id = this.props.params.bookingId;
            let res = await getDetailSchedulePatient(id);
            if (res && res.errCode === 0) {
                this.setState({
                    detailBooking: res.data,
                    isLoading: false
                })
            } else {
                this.setState({ isLoading: false });
            }
        }
    }

    handleBack = () => {
        this.props.navigate('/patient/my-booking');
    }

    render() {
        let { detailBooking, isLoading } = this.state;
        let { language } = this.props;

        if (isLoading) return (
            <div className="detail-schedule-container">
                <HomeHeader />
                <div className="loading-container">Loading...</div>
            </div>
        );

        let doctorName = '';
        if (detailBooking.doctorBookingData) {
            doctorName = language === LANGUAGES.VI
                ? `${detailBooking.doctorBookingData.lastName} ${detailBooking.doctorBookingData.firstName}`
                : `${detailBooking.doctorBookingData.firstName} ${detailBooking.doctorBookingData.lastName}`;
        }

        let patientName = '';
        if (detailBooking.patientBookingData) {
            patientName = language === LANGUAGES.VI
                ? `${detailBooking.patientBookingData.lastName} ${detailBooking.patientBookingData.firstName}`
                : `${detailBooking.patientBookingData.firstName} ${detailBooking.patientBookingData.lastName}`;
        }

        let statusClass = detailBooking.statusId || '';
        let dateStr = '';
        if (detailBooking.date) {
            if (/^\d+$/.test(detailBooking.date)) {
                dateStr = moment(Number(detailBooking.date)).format('DD/MM/YYYY');
            } else {
                dateStr = detailBooking.date;
            }
        }

        return (
            <div className="detail-schedule-container">
                <HomeHeader />
                <div className="detail-schedule-body">
                    <div className="back-button" onClick={this.handleBack}>
                        <i className="fas fa-arrow-left"></i>
                        <span><FormattedMessage id="patient-detail.btn-back" /></span>
                    </div>

                    <div className="detail-card animate-slide-up">
                        <div className="header-detail-row">
                            <h2 className="title"><FormattedMessage id="patient-detail.title" /></h2>
                            <div className={`status-tag ${statusClass}`}>
                                {language === LANGUAGES.VI ? detailBooking.statusData?.valueVi : detailBooking.statusData?.valueEn}
                            </div>
                        </div>

                        <div className="info-grid">
                            <div className="info-section">
                                <h3 className="section-title"><FormattedMessage id="patient-detail.doctor-info" /></h3>
                                <div className="info-item">
                                    <span className="label"><FormattedMessage id="patient-detail.doctor-name" />:</span>
                                    <span className="value bold">{doctorName}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label"><FormattedMessage id="patient-detail.clinic-info" />:</span>
                                    <span className="value">
                                        {detailBooking.doctorBookingData?.doctorinforData?.nameClinic}
                                    </span>
                                </div>
                                <div className="info-item">
                                    <span className="label"><FormattedMessage id="patient.my-booking.address" />:</span>
                                    <span className="value">
                                        {detailBooking.doctorBookingData?.doctorinforData?.addressClinic}
                                    </span>
                                </div>
                            </div>

                            <div className="info-section">
                                <h3 className="section-title"><FormattedMessage id="patient-detail.appointment-info" /></h3>
                                <div className="info-item">
                                    <span className="label"><FormattedMessage id="manage-patient.date" />:</span>
                                    <span className="value">{dateStr}</span>
                                </div>

                                <div className="info-item">
                                    <span className="label"><FormattedMessage id="manage-patient.time" />:</span>
                                    <span className="value">
                                        {language === LANGUAGES.VI ? detailBooking.timeTypeDataPatient?.valueVi : detailBooking.timeTypeDataPatient?.valueEn}
                                    </span>
                                </div>
                                <div className="info-item">
                                    <span className="label"><FormattedMessage id="patient-detail.appointment-id" />:</span>
                                    <span className="value">#{detailBooking.id}</span>
                                </div>
                            </div>
                            <div className="info-section full-width">
                                <h3 className="section-title"><FormattedMessage id="patient-profile.name-label" /></h3>
                                <div className="info-item">
                                    <span className="label"><FormattedMessage id="patient-detail.patient-name" />:</span>
                                    <span className="value">{patientName}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Email:</span>
                                    <span className="value">{detailBooking.patientBookingData?.email}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label"><FormattedMessage id="patient-profile.phone-place" />:</span>
                                    <span className="value">{detailBooking.patientBookingData?.phonenumber}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label"><FormattedMessage id="patient.booking-modal.gender" defaultMessage="Giới tính" />:</span>
                                    <span className="value">
                                        {language === LANGUAGES.VI ? detailBooking.patientBookingData?.genderData?.valueVi : detailBooking.patientBookingData?.genderData?.valueEn}
                                    </span>
                                </div>
                                {/* <div className="info-item">
                                    <span className="label"><FormattedMessage id="patient.booking-modal.birthday" />:</span>
                                    <span className="value">{dateStr}</span>
                                </div> */}
                                <div className="info-item">
                                    <span className="label"><FormattedMessage id="patient.my-booking.address" />:</span>
                                    <span className="value">{detailBooking.patientBookingData?.address}</span>
                                </div>
                                <div className="info-item full-width mt-2">
                                    <span className="label"><FormattedMessage id="schedule-doctor.reason" />:</span>
                                    <div className="value-reason">{detailBooking.reason}</div>
                                </div>
                            </div>
                            <div className="info-section">
                                <h3 className="section-title"><FormattedMessage id="patient-detail.payment-info" /></h3>
                                <div className="info-item">
                                    <span className="label"><FormattedMessage id="patient-detail.price" />:</span>
                                    <span className="value price">
                                        {detailBooking.doctorBookingData?.doctorinforData?.priceTypeData ?
                                            (language === LANGUAGES.VI ?
                                                detailBooking.doctorBookingData.doctorinforData.priceTypeData.valueVi + ' VND' :
                                                detailBooking.doctorBookingData.doctorinforData.priceTypeData.valueEn + ' $')
                                            : <FormattedMessage id="patient-detail.not-found" />}
                                    </span>
                                </div>
                                <div className="info-item">
                                    <span className="label"><FormattedMessage id="patient-detail.payment-method" />:</span>
                                    <span className="value">
                                        {detailBooking.doctorBookingData?.doctorinforData?.paymentTypeData ?
                                            (language === LANGUAGES.VI ?
                                                detailBooking.doctorBookingData.doctorinforData.paymentTypeData.valueVi :
                                                detailBooking.doctorBookingData.doctorinforData.paymentTypeData.valueEn)
                                            : <FormattedMessage id="patient-detail.not-found" />}
                                    </span>
                                </div>
                            </div>


                        </div>

                        {detailBooking.statusId === 'S1' && (
                            <div className="action-footer">
                                <button className="btn-pay-now" onClick={() => this.props.navigate(`/patient/payment?bookingId=${detailBooking.id}`)}>
                                    <FormattedMessage id="patient.my-booking.pending" defaultMessage="Thanh toán ngay" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

export default withRouter(connect(mapStateToProps)(DetailSchedulePatient));
