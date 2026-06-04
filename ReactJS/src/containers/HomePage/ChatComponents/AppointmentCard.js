import React, { Component } from 'react';
import { getDetailDoctorByIdService, getScheduleByDate } from '../../../services/userService';
import moment from 'moment';
import 'moment/locale/vi';

class AppointmentCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doctorData: null,
            slotData: null,
            isLoading: true,
            isBooked: false
        };
    }

    async componentDidMount() {
        await this.loadData();
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.doctorId !== this.props.doctorId ||
            prevProps.date !== this.props.date ||
            prevProps.timeType !== this.props.timeType ||
            prevProps.language !== this.props.language) {
            await this.loadData();
        }
    }

    loadData = async () => {
        const { doctorId, date, timeType } = this.props;
        this.setState({ isLoading: true });
        try {
            // 1. Fetch Doctor details
            let docRes = await getDetailDoctorByIdService(doctorId);
            let doctorData = null;
            if (docRes && docRes.errCode === 0) {
                doctorData = docRes.data;
            }

            // 2. Fetch Schedule/Slot details for that date
            let schedRes = await getScheduleByDate(doctorId, date);
            let slotData = null;
            let isBooked = false;
            if (schedRes && schedRes.errCode === 0 && schedRes.data) {
                const matchingSlot = schedRes.data.find(item => item.timeType === timeType);
                if (matchingSlot) {
                    slotData = matchingSlot;
                    if (matchingSlot.isFull === true) {
                        isBooked = true;
                    }
                }
            }

            this.setState({
                doctorData,
                slotData,
                isBooked,
                isLoading: false
            }, () => {
                if (this.props.onLoadComplete) {
                    this.props.onLoadComplete();
                }
            });
        } catch (e) {
            console.error("Error loading interactive card dynamic data:", e);
            this.setState({ isLoading: false }, () => {
                if (this.props.onLoadComplete) {
                    this.props.onLoadComplete();
                }
            });
        }
    }

    render() {
        const { isLoading, doctorData, slotData, isBooked } = this.state;
        const { language, userInfo, onBook } = this.props;

        if (isLoading) {
            return (
                <div className="dcd-appointment-card loading">
                    <div className="card-skeleton-header">
                        <i className="fas fa-spinner fa-spin"></i>
                        <span>{language === 'vi' ? 'Đang tải thông tin...' : 'Loading proposal...'}</span>
                    </div>
                </div>
            );
        }

        if (!doctorData) {
            return (
                <div className="dcd-appointment-card error">
                    <i className="fas fa-exclamation-triangle"></i>
                    <span>{language === 'vi' ? 'Không thể tải thông tin lịch khám' : 'Failed to load booking details'}</span>
                </div>
            );
        }

        const isMeDoctor = userInfo && Number(userInfo.id) === Number(doctorData.id);
        const doctorName = `${doctorData.lastName || ''} ${doctorData.firstName || ''}`;
        const price = doctorData.doctorinforData?.priceTypeData
            ? (language === 'vi' ? doctorData.doctorinforData.priceTypeData.valueVi : doctorData.doctorinforData.priceTypeData.valueEn)
            : 'Chưa cập nhật';

        const specialtyName = doctorData.doctorinforData?.specialtyData?.name || (language === 'vi' ? 'Chưa cập nhật' : 'Not updated');
        const clinicName = doctorData.doctorinforData?.clinicData?.name || (language === 'vi' ? 'Chưa cập nhật' : 'Not updated');

        const dateLabel = moment(Number(this.props.date)).locale(language).format('dddd - DD/MM/YYYY');
        const formattedDateLabel = dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1);

        let timeLabel = '';
        if (slotData && slotData.timeTypeData) {
            timeLabel = language === 'vi' ? slotData.timeTypeData.valueVi : slotData.timeTypeData.valueEn;
        } else {
            timeLabel = this.props.timeType;
        }

        return (
            <div className={`dcd-appointment-card ${isBooked ? 'is-booked' : ''}`}>
                <div className="appointment-card-header">
                    <i className="fas fa-calendar-check card-icon"></i>
                    <span>{language === 'vi' ? 'ĐỀ XUẤT LỊCH HẸN KHÁM' : 'APPOINTMENT SUGGESTION'}</span>
                </div>
                <div className="appointment-card-body">
                    <div className="appointment-info-row">
                        <span className="label">{language === 'vi' ? 'Bác sĩ tư vấn:' : 'Consultant:'}</span>
                        <span className="value font-weight-bold">{doctorName}</span>
                    </div>
                    <div className="appointment-info-row">
                        <span className="label">{language === 'vi' ? 'Chuyên khoa:' : 'Specialty:'}</span>
                        <span className="value">{specialtyName}</span>
                    </div>
                    <div className="appointment-info-row">
                        <span className="label">{language === 'vi' ? 'Nơi khám:' : 'Clinic:'}</span>
                        <span className="value">{clinicName}</span>
                    </div>
                    <div className="appointment-info-row">
                        <span className="label">{language === 'vi' ? 'Khung giờ:' : 'Time Slot:'}</span>
                        <span className="value-highlight">
                            <i className="far fa-clock"></i> {timeLabel}
                        </span>
                    </div>
                    <div className="appointment-info-row">
                        <span className="label">{language === 'vi' ? 'Ngày khám:' : 'Date:'}</span>
                        <span className="value">{formattedDateLabel}</span>
                    </div>
                    <div className="appointment-info-row">
                        <span className="label">{language === 'vi' ? 'Giá khám:' : 'Price:'}</span>
                        <span className="value price-tag">{price}</span>
                    </div>
                </div>
                {isBooked ? (
                    <div className="appointment-booked-badge">
                        <i className="fas fa-ban"></i> {language === 'vi' ? 'Khung giờ này đã đầy' : 'Fully booked'}
                    </div>
                ) : isMeDoctor ? (
                    <div className="appointment-sent-badge">
                        <i className="fas fa-check-circle"></i> {language === 'vi' ? 'Đã đề xuất lịch khám bệnh' : 'Sent Appointment Suggestion'}
                    </div>
                ) : (
                    <button
                        className="appointment-btn-confirm"
                        onClick={() => onBook(slotData)}
                        disabled={!slotData}
                    >
                        {language === 'vi' ? 'Đặt lịch hẹn ngay' : 'Book Appointment Now'}
                    </button>
                )}
            </div>
        );
    }
}

export default AppointmentCard;
