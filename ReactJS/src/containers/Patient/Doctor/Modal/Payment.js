import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from '../../../../components/Navigator';
import HomeHeader from '../../../HomePage/HomeHeader';
import { postBookAppointment, getDetailSchedulePatient } from '../../../../services/userService';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../../../utils';
import _ from 'lodash';
import './Payment.scss';

class Payment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeLeft: 900,
            bookingData: null,
            isLoading: true
        }
    }

    async componentDidMount() {
        let bookingData = null;
        let bookingId = null;

        // CASE 1: Arriving from BookingModal (New booking, not yet saved in DB)
        if (this.props.location.state && this.props.location.state.bookingData) {
            bookingData = this.props.location.state.bookingData;

            this.setState({ bookingData, isLoading: false });

            if (!bookingData.bookingId) {
                // Save to DB immediately to get S1 status
                await this.saveInitialBooking(bookingData);
            } else {
                this.handleTimerPersistence(bookingData.bookingId);
            }
        }
        // CASE 2: Arriving from MyBooking or URL (Existing bookingId)
        else {
            const query = new URLSearchParams(this.props.location.search);
            bookingId = query.get('bookingId');
            if (bookingId) {
                await this.fetchBookingDetails(bookingId);
            } else {
                toast.error(this.props.language === LANGUAGES.VI ? "Không tìm thấy thông tin đơn hàng!" : "Order information not found!");
                this.props.navigate('/home');
            }
        }
    }

    saveInitialBooking = async (bookingData) => {
        try {
            // This backend call creates S1 AND PayOS link
            let res = await postBookAppointment(bookingData);
            if (res && res.errCode === 0 && res.data) {
                const { bookingId, checkoutUrl } = res.data;
                this.setState({
                    bookingData: { ...bookingData, bookingId },
                    checkoutUrl: checkoutUrl // Store for later
                });
                this.handleTimerPersistence(bookingId);
            } else {
                // If backend fails (e.g. PayOS error), the record might or might not be saved 
                // but we at least show the summary from state
                toast.error(this.props.language === LANGUAGES.VI
                    ? "Lưu lịch hẹn thất bại hoặc lỗi cổng thanh toán!"
                    : "Failed to save appointment or payment gateway error!");
            }
        } catch (e) {
            console.error(e);
        }
    }

    fetchBookingDetails = async (bookingId) => {
        try {
            let res = await getDetailSchedulePatient(bookingId);
            console.log('>>> DEBUG PAYMENT API RES:', res);
            if (res && res.errCode === 0 && res.data) {
                let data = res.data;
                const { language } = this.props;

                const createdAt = data.createdAt ? new Date(data.createdAt).getTime() : Date.now();
                const now = Date.now();
                const diff = now - createdAt;
                const fifteenMins = 15 * 60 * 1000;

                let reconstructed = {
                    bookingId: data.id,
                    doctorId: data.doctorId,
                    patientId: data.patientId,
                    doctorName: data.doctorBookingData ? `${data.doctorBookingData.lastName} ${data.doctorBookingData.firstName}` : '',
                    doctorImage: data.doctorBookingData?.image,
                    clinicName: data.doctorBookingData?.doctorinforData?.nameClinic,
                    addressClinic: data.doctorBookingData?.doctorinforData?.addressClinic,
                    specialtyName: data.doctorBookingData?.markdownData?.description || '',
                    date: data.date,
                    timeType: data.timeType,
                    timeLabel: language === LANGUAGES.VI ? data.timeTypeDataPatient?.valueVi : data.timeTypeDataPatient?.valueEn,
                    price: data.doctorBookingData?.doctorinforData?.priceTypeData?.valueVi,
                    priceId: language === LANGUAGES.VI
                        ? (data.doctorBookingData?.doctorinforData?.priceTypeData?.valueVi + ' VNĐ')
                        : (data.doctorBookingData?.doctorinforData?.priceTypeData?.valueEn + ' USD'),
                    fullName: data.patientBookingData ? (data.patientBookingData.lastName + ' ' + data.patientBookingData.firstName) : '',
                    phoneNumber: data.patientBookingData?.phonenumber,
                    email: data.patientBookingData?.email,
                    address: data.patientBookingData?.address,
                    gender: data.patientBookingData?.gender,
                    genderLabel: language === LANGUAGES.VI ? data.patientBookingData?.genderData?.valueVi : data.patientBookingData?.genderData?.valueEn,
                    birthday: data.patientBookingData?.birthday,
                    reason: data.patientBookingData?.reason,
                };

                if (diff > fifteenMins) {
                    toast.warn(language === LANGUAGES.VI ? "Hết hạn! Đang tạo phiên mới..." : "Expired! Creating new session...");
                    await this.createNewBookingSession(reconstructed);
                    return;
                }

                this.setState({
                    bookingData: reconstructed,
                    isLoading: false,
                    timeLeft: Math.max(0, Math.floor((fifteenMins - diff) / 1000))
                }, () => {
                    this.startTimer(data.id);
                });
            } else {
                toast.error(this.props.language === LANGUAGES.VI ? "Không tìm thấy dữ liệu đặt lịch!" : "Booking data not found!");
                this.setState({ isLoading: false });
                this.props.navigate('/home');
            }
        } catch (e) {
            console.error(e);
            this.setState({ isLoading: false });
            toast.error("Error fetching booking details!");
        }
    }

    handleTimerPersistence = (bookingId) => {
        // This is now redundant since we use fetchBookingDetails logic, but let's keep it simple
        // If we have an ID but no fetch (newly created), we start 15 min timer
        this.setState({ timeLeft: 900 }, () => this.startTimer(bookingId));
    }

    createNewBookingSession = async (oldData) => {
        try {
            // Re-call the booking API with old data to get a fresh ID
            let res = await postBookAppointment(oldData);
            if (res && res.errCode === 0 && res.data) {
                const newBookingId = res.data.bookingId;
                // Redirect to self with new ID
                this.props.navigate(`/patient/payment?bookingId=${newBookingId}`, { replace: true });
                // Force reload logic
                window.location.reload();
            } else {
                toast.error("Error regenerating session.");
                this.props.navigate('/home');
            }
        } catch (e) {
            console.error(e);
        }
    }

    startTimer = (bookingId) => {
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.setState(prevState => {
                if (prevState.timeLeft <= 1) {
                    clearInterval(this.timer);
                    this.handleTimeout(bookingId);
                    return { timeLeft: 0 };
                }
                return { timeLeft: prevState.timeLeft - 1 };
            });
        }, 1000);
    }

    handleTimeout = (bookingId) => {
        if (bookingId) localStorage.removeItem(`payment_expiry_${bookingId}`);
        toast.error(this.props.language === LANGUAGES.VI ? "Hết thời gian thanh toán!" : "Payment timeout!");
        this.props.navigate('/home');
    }

    handleConfirmPaid = async () => {
        let { bookingData } = this.state;
        if (bookingData) {
            try {
                // Now calling postBookAppointment will actually get the PayOS link because record already exists
                let res = await postBookAppointment(bookingData);
                if (res && res.errCode === 0 && res.data && res.data.checkoutUrl) {
                    // Clear timer since user is proceeding to gateway
                    localStorage.removeItem(`payment_expiry_${bookingData.bookingId}`);
                    window.location.href = res.data.checkoutUrl;
                } else {
                    toast.error(res.errMessage || "Error initializing payment!");
                }
            } catch (e) {
                console.log(e);
                toast.error("Connection error!");
            }
        }
    }

    render() {
        let { timeLeft, bookingData, isLoading } = this.state;
        let { language } = this.props;
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;

        return (
            <React.Fragment>
                <div className="payment-wrapper">
                    <HomeHeader isShowBanner={false} />

                    <div className="payment-main">
                        <div className="payment-content-layout">
                            {/* Left Column - Sticky via CSS */}
                            <div className="content-left">
                                <div className="product-visual">
                                    <div className="doctor-card">
                                        <img
                                            src={bookingData?.doctorImage || 'https://via.placeholder.com/400x270'}
                                            alt="Doctor"
                                            className="doctor-image"
                                        />
                                    </div>
                                    <div className="name-overlay">
                                        <h3 className="doctor-name">{bookingData?.doctorName}</h3>
                                    </div>
                                </div>

                                <div className="perks-grid">
                                    <div className="perk-item">
                                        <i className="fas fa-calendar-check"></i>
                                        <div className="perk-text">
                                            <strong><FormattedMessage id="homepage.feature-booking" /></strong>
                                            <span><FormattedMessage id="homepage.about-more" /></span>
                                        </div>
                                    </div>
                                    <div className="perk-item">
                                        <i className="fas fa-shield-alt"></i>
                                        <div className="perk-text">
                                            <strong><FormattedMessage id="payment-page.appointment-title" /></strong>
                                            <span><FormattedMessage id="payment-page.note" /></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="content-right">
                                <h1 className="main-title">
                                    {language === LANGUAGES.VI ? 'Kiểm tra thông tin lịch hẹn' : 'Review your appointment'}
                                </h1>

                                {!isLoading && bookingData ? (
                                    <div className="selection-groups">
                                        <div className="selection-section">
                                            <h2 className="section-title"><FormattedMessage id="payment-page.doctor-title" /></h2>
                                            <div className="card active">
                                                <div className="card-header">
                                                    <span className="card-label"><strong>{bookingData.doctorName}</strong></span>
                                                    <span className="card-price">Included</span>
                                                </div>
                                                <div className="card-details">
                                                    <p>{bookingData.clinicName}</p>
                                                    <p className="secondary">{bookingData.addressClinic}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="selection-section">
                                            <h2 className="section-title"><FormattedMessage id="payment-page.appointment-title" /></h2>
                                            <div className="card active">
                                                <div className="card-header">
                                                    <span className="card-label"><strong>{bookingData.timeLabel}</strong></span>
                                                    <span className="card-price">{bookingData.priceId}</span>
                                                </div>
                                                <div className="card-details">
                                                    <p>{bookingData.date}</p>
                                                    <p className="secondary">Time zone: GMT+7 (Vietnam)</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="selection-section">
                                            <h2 className="section-title"><FormattedMessage id="payment-page.patient-title" /></h2>
                                            <div className="card info-only">
                                                <div className="patient-summary-grid">
                                                    <div className="summary-item">
                                                        <span className="label"><FormattedMessage id="payment-page.patient-name" /></span>
                                                        <span className="value">{bookingData.fullName}</span>
                                                    </div>
                                                    <div className="summary-item">
                                                        <span className="label"><FormattedMessage id="payment-page.phone" /></span>
                                                        <span className="value">{bookingData.phoneNumber}</span>
                                                    </div>
                                                    <div className="summary-item">
                                                        <span className="label"><FormattedMessage id="payment-page.email" /></span>
                                                        <span className="value">{bookingData.email}</span>
                                                    </div>
                                                    <div className="summary-item">
                                                        <span className="label"><FormattedMessage id="payment-page.gender" /></span>
                                                        <span className="value">{bookingData.genderLabel}</span>
                                                    </div>
                                                    <div className="summary-item full">
                                                        <span className="label"><FormattedMessage id="payment-page.patient-address" /></span>
                                                        <span className="value">{bookingData.address}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="loading-state">
                                        <div className="spinner"></div>
                                        <span><FormattedMessage id="verify-email.loading" /></span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="sticky-footer">
                        <div className="footer-content">
                            <div className="footer-left">
                                <div className="status-item">
                                    <i className="fas fa-clock"></i>
                                    <div className="status-text">
                                        <span><FormattedMessage id="payment-page.timer" /> <strong>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</strong></span>
                                        <span className="action-link"><FormattedMessage id="homepage.support" /></span>
                                    </div>
                                </div>
                            </div>
                            <div className="footer-right">
                                <div className="total-box">
                                    <span className="total-amount-large">{bookingData?.priceId}</span>
                                    <span className="loan-info">Approx. {bookingData?.priceId} with 0% interest.</span>
                                </div>
                                <button className="btn-primary" onClick={this.handleConfirmPaid}>
                                    <FormattedMessage id="payment-page.pay-now" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    language: state.app.language,
});

export default withRouter(connect(mapStateToProps, null)(Payment));