import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { getDetailSchedulePatient } from '../../../services/userService';
import moment from 'moment';
import { withRouter } from '../../../components/Navigator';
import './DetailSchedulePatient.scss';

class DetailSchedulePatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailBooking: {}
        };
    }

    async componentDidMount() {
        if (this.props.params && this.props.params.bookingId) {
            let id = this.props.params.bookingId;
            let res = await getDetailSchedulePatient(id);
            if (res && res.errCode === 0) {
                this.setState({
                    detailBooking: res.data
                });
            }
        }
    }

    handleGoBack = () => {
        this.props.navigate(-1);
    }

    render() {
        let { detailBooking } = this.state;
        let { language } = this.props;

        let doctorName = '';
        let clinicName = '';
        let clinicAddress = '';
        let price = '';
        let payment = '';
        let statusStr = '';
        let statusBadge = '';
        let timeStr = '';
        let dateStr = '';

        if (detailBooking && detailBooking.doctorBookingData) {
            let drData = detailBooking.doctorBookingData;
            doctorName = language === 'vi' 
                ? `${drData.lastName} ${drData.firstName}` 
                : `${drData.firstName} ${drData.lastName}`;
            
            if (drData.doctorinforData) {
                let info = drData.doctorinforData;
                clinicName = info.nameClinic;
                clinicAddress = info.addressClinic;

                if (info.priceTypeData) {
                    price = language === 'vi' ? info.priceTypeData.valueVi : info.priceTypeData.valueEn;
                }
                if (info.paymentTypeData) {
                    payment = language === 'vi' ? info.paymentTypeData.valueVi : info.paymentTypeData.valueEn;
                }
            }
        }

        if (detailBooking.statusId) {
            statusBadge = detailBooking.statusId;
            if (detailBooking.statusData) {
                statusStr = language === 'vi' ? detailBooking.statusData.valueVi : detailBooking.statusData.valueEn;
            }
        }

        if (detailBooking.timeTypeDataPatient) {
            timeStr = language === 'vi' ? detailBooking.timeTypeDataPatient.valueVi : detailBooking.timeTypeDataPatient.valueEn;
            dateStr = moment(new Date(parseInt(detailBooking.date))).format('DD/MM/YYYY');
        }


        return (
            <div className="detail-schedule-container my-booking-container container">
                <div className="header-detail">
                    <button className="btn-back pointer" onClick={this.handleGoBack}>
                        <i className="fas fa-arrow-left"></i> Trở về
                    </button>
                    <h2 className="title-booking font-weight-bold ml-3 mb-0">Chi tiết Lịch Khám</h2>
                </div>

                <div className="card-detail mt-4">
                    <div className="card-body">
                        <div className="status-banner mb-4">
                            <span className={`status-badge ${statusBadge}`}>{statusStr}</span>
                            <span className="ml-3 text-muted">ID Lịch hẹn: {detailBooking.token ? detailBooking.token.substring(0, 8) : 'N/A'}</span>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-4">
                                <h5 className="section-title">Nơi Khám</h5>
                                <div className="info-box">
                                    <div className="info-item">
                                        <i className="fas fa-hospital text-primary"></i>
                                        <span className="font-weight-bold ml-2">{clinicName || 'Đang cập nhật'}</span>
                                    </div>
                                    <div className="info-item mt-2">
                                        <i className="fas fa-map-marker-alt text-danger"></i>
                                        <span className="ml-2">{clinicAddress || 'Đang cập nhật'}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-md-6 mb-4">
                                <h5 className="section-title">Bác sĩ phụ trách</h5>
                                <div className="info-box">
                                    <div className="info-item">
                                        <i className="fas fa-user-md text-success"></i>
                                        <span className="font-weight-bold ml-2">{doctorName || 'Đang cập nhật'}</span>
                                    </div>
                                    <div className="info-item mt-2">
                                        <i className="fas fa-calendar-alt text-warning"></i>
                                        <span className="ml-2 font-weight-bold">{timeStr} - {dateStr}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12">
                                <h5 className="section-title">Thông tin Thanh Toán</h5>
                                <div className="info-box payment-box">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Chi phí khám bệnh:</span>
                                        <span className="font-weight-bold text-success" style={{fontSize: '1.2rem'}}>{price || 'Đang cập nhật'}</span>
                                    </div>
                                    <div className="d-flex justify-content-between border-top pt-2">
                                        <span className="text-muted">Hình thức thanh toán:</span>
                                        <span className="font-weight-bold">{payment || 'Đang cập nhật'}</span>
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
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DetailSchedulePatient));
