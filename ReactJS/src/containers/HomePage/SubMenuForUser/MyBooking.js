import React, { Component } from 'react';
import { connect } from "react-redux";
import * as action from '../../../store/actions'
import HomeHeader from '../../HomePage/HomeHeader'
import { withRouter } from '../../../components/Navigator';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { LANGUAGES } from '../../../utils';
import './MyBooking.scss'
import { getAllAppointmentsByIdService } from '../../../services/userService'

class MyBooking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listAppointments: []
        }
    }

    async componentDidMount() {
        if (this.props.userInfo && this.props.userInfo.id) {
            let id = this.props.userInfo.id;
            let res = await getAllAppointmentsByIdService(id);
            if (res && res.errCode === 0) {
                this.setState({
                    listAppointments: res.data ? res.data : []
                });
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.userInfo !== this.props.userInfo && this.props.userInfo && this.props.userInfo.id) {
            await getAllAppointmentsByIdService(this.props.userInfo.id);
        }

        if (prevProps.detailAppointment !== this.props.detailAppointment) {
            this.setState({
                listAppointments: this.props.detailAppointment
            });
        }
    }

    render() {
        let { listAppointments } = this.state;
        let { language } = this.props;

        return (
            <div className="my-booking-container">
                <HomeHeader />
                <div className="my-booking-body container">
                    <div className="title-booking">
                        <FormattedMessage id="patient.my-booking.title" defaultMessage="LỊCH HẸN CỦA BẠN" />
                    </div>
                    <div className="table-booking-content">
                        <table className="table table-hover table-bordered mt-3">
                            <thead className="thead-light">
                                <tr>
                                    <th>STT</th>
                                    <th><FormattedMessage id="patient.my-booking.time" defaultMessage="Thời gian" /></th>
                                    <th><FormattedMessage id="patient.my-booking.doctor" defaultMessage="Bác sĩ" /></th>
                                    <th><FormattedMessage id="patient.my-booking.clinic" defaultMessage="Phòng khám" /></th>
                                    <th><FormattedMessage id="patient.my-booking.status" defaultMessage="Trạng thái" /></th>
                                    <th><FormattedMessage id="patient.my-booking.actions" defaultMessage="Thao tác" /></th>
                                </tr>
                            </thead>
                            <tbody>
                                {listAppointments && listAppointments.length > 0 ?
                                    listAppointments.map((item, index) => {

                                        let name = language === 'vi'
                                            ? `${item.doctorBookingData.lastName} ${item.doctorBookingData.firstName}`
                                            : `${item.doctorBookingData.firstName} ${item.doctorBookingData.lastName}`;


                                        let clinicName = item.doctorBookingData.doctorinforData
                                            ? item.doctorBookingData.doctorinforData.nameClinic
                                            : 'N/A';
                                        let clinicAddress = item.doctorBookingData.doctorinforData
                                            ? item.doctorBookingData.doctorinforData.addressClinic
                                            : '';


                                        let formattedDate = moment(new Date(parseInt(item.date))).format('DD/MM/YYYY');

                                        return (
                                            <tr key={index} className="pointer-row" onClick={() => this.props.navigate('/patient/detail-schedule/' + item.id)}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <div className="time-display">
                                                        {language === 'vi' ? item.timeTypeDataPatient.valueVi : item.timeTypeDataPatient.valueEn}
                                                    </div>
                                                    <div className="date-display">{formattedDate}</div>
                                                </td>
                                                <td className="doctor-name">{name}</td>
                                                <td>
                                                    <strong>{clinicName}</strong>
                                                    <div className="clinic-address">{clinicAddress}</div>
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${item.statusId}`}>
                                                        {language === 'vi' ? item.statusData.valueVi : item.statusData.valueEn}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="text-primary" style={{cursor: 'pointer'}}>Xem chi tiết &rarr;</span>
                                                </td>
                                            </tr>
                                        )
                                    })
                                    :
                                    <tr>
                                        <td colSpan="6" className="text-center no-data">
                                            <FormattedMessage id="patient.my-booking.no-data" defaultMessage="Bạn chưa có lịch hẹn nào." />
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        detailAppointment: state.admin.detailAppointment,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAllAppointmentsById: (id) => dispatch(action.getAllAppointmentsById(id))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MyBooking));