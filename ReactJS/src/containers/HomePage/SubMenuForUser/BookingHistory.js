import React, { Component } from 'react';
import { connect } from "react-redux";
import * as action from '../../../store/actions'
import HomeHeader from '../../HomePage/HomeHeader'
import { withRouter } from '../../../components/Navigator';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { LANGUAGES } from '../../../utils';
import './MyBooking.scss' // Reusing styles

class BookingHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listHistory: [],
            currentPage: 1,
            pageSize: 5
        }
    }

    async componentDidMount() {
        if (this.props.userInfo && this.props.userInfo.id) {
            this.props.getHistoryAppointmentById(this.props.userInfo.id);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.userInfo !== this.props.userInfo && this.props.userInfo && this.props.userInfo.id) {
            this.props.getHistoryAppointmentById(this.props.userInfo.id);
        }

        if (prevProps.historyAppointment !== this.props.historyAppointment) {
            this.setState({
                listHistory: this.props.historyAppointment
            });
        }
    }

    render() {
        let { listHistory, currentPage, pageSize } = this.state;
        let { language } = this.props;

        return (
            <div className="my-booking-container">
                <HomeHeader />
                <div className="my-booking-body container">
                    <div className="title-booking">
                        <FormattedMessage id="patient.history.title" defaultMessage="LỊCH SỬ KHÁM BỆNH" />
                    </div>
                    <div className="table-booking-content">
                        <table className="table table-hover table-bordered mt-3">
                            <thead className="thead-light">
                                <tr>
                                    <th>STT</th>
                                    <th><FormattedMessage id="patient.my-booking.time" defaultMessage="Thời gian" /></th>
                                    <th><FormattedMessage id="patient-detail.patient-name" defaultMessage="Bệnh nhân" /></th>
                                    <th><FormattedMessage id="patient-profile.phone-place" defaultMessage="Số điện thoại" /></th>
                                    <th><FormattedMessage id="patient.my-booking.doctor" defaultMessage="Bác sĩ" /></th>
                                    <th><FormattedMessage id="schedule-doctor.reason" defaultMessage="Lý do" /></th>
                                    <th><FormattedMessage id="patient.my-booking.status" defaultMessage="Trạng thái" /></th>
                                    <th><FormattedMessage id="patient.my-booking.actions" defaultMessage="Thao tác" /></th>
                                </tr>
                            </thead>
                            <tbody>
                                {listHistory && listHistory.length > 0 ?
                                    listHistory.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((item, index) => {
                                        const realIndex = (currentPage - 1) * pageSize + index + 1;
                                        let name = language === 'vi'
                                            ? `${item.doctorBookingData.lastName} ${item.doctorBookingData.firstName}`
                                            : `${item.doctorBookingData.firstName} ${item.doctorBookingData.lastName}`;

                                        let patientName = item.patientBookingData
                                            ? `${item.patientBookingData.lastName} ${item.patientBookingData.firstName}`
                                            : 'N/A';

                                        let clinicName = item.doctorBookingData.doctorinforData
                                            ? item.doctorBookingData.doctorinforData.nameClinic
                                            : 'N/A';
                                        
                                        let formattedDate = '';
                                        if (item.date) {
                                            if (/^\d+$/.test(item.date)) {
                                                formattedDate = moment(Number(item.date)).format('DD/MM/YYYY');
                                            } else {
                                                formattedDate = item.date;
                                            }
                                        }

                                        return (
                                            <tr key={index} className={`status-${item.statusId}`}>
                                                <td>{realIndex}</td>
                                                <td>
                                                    <div className="time-display">
                                                        {language === 'vi' ? item.timeTypeDataPatient.valueVi : item.timeTypeDataPatient.valueEn}
                                                    </div>
                                                    <div className="date-display">{formattedDate}</div>
                                                </td>
                                                <td>
                                                    <div style={{ fontWeight: '600', color: '#1d1d1f' }}>{patientName}</div>
                                                </td>
                                                <td>{item.patientBookingData?.phonenumber || 'N/A'}</td>
                                                <td>
                                                    <div className="doctor-name">{name}</div>
                                                    <div className="clinic-address">{clinicName}</div>
                                                </td>
                                                <td>
                                                    <div style={{ fontSize: '13px', color: '#86868b', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.reason}>
                                                        {item.reason}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${item.statusId}`}>
                                                        {item.statusId === 'S3' ? <FormattedMessage id="patient.my-booking.done" /> : 
                                                         item.statusId === 'S4' ? <FormattedMessage id="patient.my-booking.cancelled" /> :
                                                         item.statusId === 'S5' ? <FormattedMessage id="patient.my-booking.missed" /> :
                                                         (language === 'vi' ? item.statusData.valueVi : item.statusData.valueEn)
                                                        }
                                                    </span>
                                                </td>
                                                <td>
                                                    <button className="btn btn-outline-info btn-sm"
                                                        onClick={() => this.props.navigate('/patient/detail-schedule/' + item.id)}
                                                    >
                                                        {language === 'vi' ? 'Xem lại' : 'Review'}
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                    :
                                    <tr>
                                        <td colSpan="8" className="text-center no-data">
                                            <FormattedMessage id="patient.history.no-data" defaultMessage="Bạn chưa có lịch sử khám nào." />
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>

                    {listHistory && listHistory.length > pageSize &&
                        <div className="pagination-container">
                            <button 
                                className="btn-pagination" 
                                disabled={currentPage === 1}
                                onClick={() => this.setState({ currentPage: currentPage - 1 })}
                            >
                                <i className="fas fa-chevron-left"></i>
                            </button>
                            
                            {[...Array(Math.ceil(listHistory.length / pageSize))].map((_, i) => (
                                <button 
                                    key={i}
                                    className={`btn-pagination ${currentPage === i + 1 ? 'active' : ''}`}
                                    onClick={() => this.setState({ currentPage: i + 1 })}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button 
                                className="btn-pagination" 
                                disabled={currentPage === Math.ceil(listHistory.length / pageSize)}
                                onClick={() => this.setState({ currentPage: currentPage + 1 })}
                            >
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        userInfo: state.user.userInfo,
        historyAppointment: state.admin.historyAppointment
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getHistoryAppointmentById: (id) => dispatch(action.getHistoryAppointmentById(id))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BookingHistory));
