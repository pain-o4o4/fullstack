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

        // Helper function for Capitalizing Addresses & Names (Title Case)
        const formatTitleCase = (str) => {
            if (!str) return 'N/A';
            return str.trim()
                .toLowerCase()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        };

        // Helper function for formatting Phone Numbers (0987 654 321)
        const formatPhone = (phone) => {
            if (!phone) return 'N/A';
            let cleaned = phone.replace(/\D/g, '');
            if (cleaned.length === 10) {
                return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
            }
            if (cleaned.length === 11) {
                return cleaned.replace(/(\d{4})(\d{4})(\d{3})/, '$1 $2 $3');
            }
            return phone;
        };

        // Helper function for professional Currency Formatting
        const formatCurrency = (priceVi, priceEn) => {
            if (!priceVi) return 'N/A';
            if (language === LANGUAGES.VI) {
                return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(priceVi));
            } else {
                return `$${priceEn || '0'}`;
            }
        };

        // All image data is now Cloudinary URLs from Backend
        const decodeAvatar = (imgObj) => {
            if (!imgObj) return '';
            if (typeof imgObj === 'string') return imgObj;
            return '';
        };

        let doctorName = '';
        if (detailBooking.doctorBookingData) {
            let docLastName = formatTitleCase(detailBooking.doctorBookingData.lastName);
            let docFirstName = formatTitleCase(detailBooking.doctorBookingData.firstName);
            doctorName = language === LANGUAGES.VI
                ? `${docLastName} ${docFirstName}`
                : `${docFirstName} ${docLastName}`;
        }

        let patientName = '';
        if (detailBooking.patientBookingData) {
            let patLastName = formatTitleCase(detailBooking.patientBookingData.lastName);
            let patFirstName = formatTitleCase(detailBooking.patientBookingData.firstName);
            patientName = language === LANGUAGES.VI
                ? `${patLastName} ${patFirstName}`
                : `${patFirstName} ${patLastName}`;
        }

        let doctorAvatar = decodeAvatar(detailBooking.doctorBookingData?.image);
        let patientAvatar = decodeAvatar(detailBooking.patientBookingData?.image);

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
                            
                            <div className="info-column">
                                
                                <div className="info-section master-card provider-card">
                                    <h3 className="section-title"><FormattedMessage id="patient-detail.doctor-info" /></h3>
                                    
                                    <div className="provider-header-row">
                                        {doctorAvatar ? (
                                            <img src={doctorAvatar} className="provider-avatar" alt={doctorName} />
                                        ) : (
                                            <div className="provider-avatar monogram">
                                                {doctorName ? doctorName.split(' ').pop().charAt(0).toUpperCase() : 'D'}
                                            </div>
                                        )}
                                        <div className="provider-name-group">
                                            <span className="label"><FormattedMessage id="patient-detail.doctor-name" /></span>
                                            <span className="value bold">{doctorName}</span>
                                        </div>
                                    </div>

                                    <div className="info-item">
                                        <span className="label"><FormattedMessage id="patient-detail.clinic-info" /></span>
                                        <span className="value">
                                            {formatTitleCase(detailBooking.clinicBookingData?.name)}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label"><FormattedMessage id="patient.my-booking.address" /></span>
                                        <span className="value address-text">
                                            {formatTitleCase(detailBooking.clinicBookingData?.address)}
                                        </span>
                                    </div>
                                </div>

                                
                                <div className="info-section master-card appointment-card">
                                    <h3 className="section-title"><FormattedMessage id="patient-detail.appointment-info" /></h3>
                                    <div className="info-item">
                                        <span className="label"><FormattedMessage id="manage-patient.date" /></span>
                                        <span className="value highlight-text">{dateStr}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label"><FormattedMessage id="manage-patient.time" /></span>
                                        <span className="value highlight-text">
                                            {language === LANGUAGES.VI ? detailBooking.timeTypeDataPatient?.valueVi : detailBooking.timeTypeDataPatient?.valueEn}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label"><FormattedMessage id="patient-detail.appointment-id" /></span>
                                        <span className="value id-badge">#{detailBooking.id}</span>
                                    </div>
                                    
                                    <div className="info-item price-divider">
                                        <span className="label"><FormattedMessage id="patient-detail.price" /></span>
                                        <span className="value price">
                                            {formatCurrency(
                                                detailBooking.doctorBookingData?.doctorinforData?.priceTypeData?.valueVi,
                                                detailBooking.doctorBookingData?.doctorinforData?.priceTypeData?.valueEn
                                            )}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label"><FormattedMessage id="patient-detail.payment-method" /></span>
                                        <span className="value">
                                            {detailBooking.doctorBookingData?.doctorinforData?.paymentTypeData ?
                                                (language === LANGUAGES.VI ?
                                                    detailBooking.doctorBookingData.doctorinforData.paymentTypeData.valueVi :
                                                    detailBooking.doctorBookingData.doctorinforData.paymentTypeData.valueEn)
                                                : <FormattedMessage id="patient-detail.not-found" />}
                                        </span>
                                    </div>

                                    {detailBooking.statusId === 'S1' && (
                                        <div className="card-action-container">
                                            <button className="btn-pay-now-master" onClick={() => this.props.navigate(`/patient/payment?bookingId=${detailBooking.id}`)}>
                                                <FormattedMessage id="patient.my-booking.pending" defaultMessage="Thanh toán ngay" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            
                            <div className="info-column">
                                <div className="info-section master-card patient-card">
                                    <h3 className="section-title"><FormattedMessage id="patient-profile.name-label" /></h3>
                                    
                                    <div className="patient-header-row">
                                        {patientAvatar ? (
                                            <img src={patientAvatar} className="patient-avatar" alt={patientName} />
                                        ) : (
                                            <div className="patient-avatar monogram">
                                                {patientName ? patientName.split(' ').pop().charAt(0).toUpperCase() : 'P'}
                                            </div>
                                        )}
                                        <div className="patient-name-group">
                                            <span className="label"><FormattedMessage id="patient-detail.patient-name" /></span>
                                            <span className="value name-highlight">{patientName}</span>
                                        </div>
                                    </div>

                                    <div className="info-item">
                                        <span className="label">Email</span>
                                        <span className="value email-text">{detailBooking.patientBookingData?.email?.toLowerCase()}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label"><FormattedMessage id="patient-profile.phone-place" /></span>
                                        <span className="value phone-text">{formatPhone(detailBooking.patientBookingData?.phonenumber)}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label"><FormattedMessage id="patient.booking-modal.gender" /></span>
                                        <span className="value">
                                            {language === LANGUAGES.VI ? detailBooking.patientBookingData?.genderData?.valueVi : detailBooking.patientBookingData?.genderData?.valueEn}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label"><FormattedMessage id="patient.my-booking.address" /></span>
                                        <span className="value address-text">{formatTitleCase(detailBooking.patientBookingData?.address)}</span>
                                    </div>

                                    
                                    <div className="reason-callout-container">
                                        <span className="reason-label"><FormattedMessage id="schedule-doctor.reason" /></span>
                                        <div className="reason-content-box">
                                            {detailBooking.reason || <FormattedMessage id="patient-detail.not-found" defaultMessage="Không có lý do khám" />}
                                        </div>
                                    </div>
                                </div>
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
        language: state.app.language,
    };
};

export default withRouter(connect(mapStateToProps)(DetailSchedulePatient));
