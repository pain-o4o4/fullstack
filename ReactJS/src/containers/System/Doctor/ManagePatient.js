import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import DatePicker from '../../../components/Input/DatePicker';
import { getListPatientForDoctor, updateBookingStatus } from '../../../services/userService';
import moment from 'moment';
import { toast } from 'react-toastify';
import '../Specialty/ManageSpecialty.scss'; // Reuse Apple Table
import './ManagePatient.scss';

class ManagePatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: []
        };
    }

    async componentDidMount() {
        this.getDataPatient();
    }

    getDataPatient = async () => {
        let { userInfo } = this.props;
        let { currentDate } = this.state;
        let formattedDate = new Date(currentDate).getTime();
        
        if (userInfo && userInfo.id) {
            let res = await getListPatientForDoctor({
                doctorId: userInfo.id,
                date: formattedDate
            });
            if (res && res.errCode === 0) {
                this.setState({
                    dataPatient: res.data
                });
            }
        }
    }

    handleOnChangeDatePicker = (date) => {
        let currentDate = date[0];
        let timestamp = new Date(currentDate).getTime();
        this.setState({
            currentDate: timestamp
        }, () => {
            this.getDataPatient();
        });
    }



    handleOnChangeStatus = async (event, item) => {
        let { language } = this.props;
        let newStatus = event.target.value;
        let confirmMsg = language === 'vi' 
            ? `Bạn có chắc chắn chuyển trạng thái đặt khám của bệnh nhân ${item.patientBookingData.lastName} ${item.patientBookingData.firstName} sang ${newStatus}?`
            : `Are you sure you want to change the status for patient ${item.patientBookingData.firstName} ${item.patientBookingData.lastName} to ${newStatus}?`;

        if(window.confirm(confirmMsg)) {
            let res = await updateBookingStatus({
                doctorId: item.doctorId,
                patientId: item.patientId,
                timeType: item.timeType,
                date: item.date,
                statusId: newStatus,
                email: item.patientBookingData.email,
                patientName: `${item.patientBookingData.lastName} ${item.patientBookingData.firstName}`,
                time: language === 'vi' ? item.timeTypeDataPatient.valueVi : item.timeTypeDataPatient.valueEn, 
                doctorName: language === 'vi' 
                    ? `${this.props.userInfo.lastName} ${this.props.userInfo.firstName}`
                    : `${this.props.userInfo.firstName} ${this.props.userInfo.lastName}`,
                language: language
            });
            if (res && res.errCode === 0) {
                toast.success(language === 'vi' ? 'Cập nhật trạng thái thành công!' : 'Status updated successfully!');
                await this.getDataPatient();
            } else {
                toast.error(language === 'vi' ? 'Lỗi cập nhật trạng thái' : 'Error updating status');
            }
        }
    }

    render() {
        let { dataPatient, currentDate } = this.state;
        let { language } = this.props;
        return (
            <div className="manage-patient-container users-container">
                <div className="header-section">
                    <h2 className="title"><FormattedMessage id="manage-patient.title" /></h2>
                </div>

                <div className="apple-card filters-card">
                    <div className="form-grid">
                        <div className="input-group-apple outline-group">
                            <label><FormattedMessage id="manage-patient.choose-date" /></label>
                            <DatePicker
                                onChange={this.handleOnChangeDatePicker}
                                className="apple-input form-control"
                                value={currentDate}
                            />
                        </div>
                    </div>
                </div>

                <div className="table-wrapper">
                    <div className="table-card">
                        <table className="apple-table">
                            <thead>
                                <tr>
                                    <th><FormattedMessage id="manage-patient.time" /></th>
                                    <th><FormattedMessage id="manage-patient.name" /></th>
                                    <th><FormattedMessage id="manage-patient.actions" /></th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataPatient && dataPatient.length > 0 ? (
                                    dataPatient.map((item, index) => {
                                        let labelColor = item.statusId === 'S2' ? 'green' : (item.statusId === 'S3' ? 'gray' : 'red');
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <span className={`role-badge ${labelColor}`}>
                                                        {language === 'vi' ? item.timeTypeDataPatient.valueVi : item.timeTypeDataPatient.valueEn}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="user-info-cell">
                                                        <div className="avatar-mini rounded circle-avatar">
                                                            <span>{item.patientBookingData.firstName ? item.patientBookingData.firstName.charAt(0) : 'BN'}</span>
                                                        </div>
                                                        <div className="user-name-block">
                                                            <span className="name">
                                                                {language === 'vi' 
                                                                    ? `${item.patientBookingData.lastName} ${item.patientBookingData.firstName}`
                                                                    : `${item.patientBookingData.firstName} ${item.patientBookingData.lastName}`}
                                                            </span>
                                                            <span className="email">{item.patientBookingData.email} - {item.patientBookingData.phonenumber}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <select 
                                                        className={`apple-status-select pointer ${item.statusId}`}
                                                        value={item.statusId}
                                                        onChange={(e) => this.handleOnChangeStatus(e, item)}
                                                    >
                                                        <option value="S1">S1 - Lịch Pending/Hủy</option>
                                                        <option value="S2">S2 - Đã Thu Tiền (Chờ khám)</option>
                                                        <option value="S3">S3 - Đã Khám Xong (Gửi Email)</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="text-center py-4">
                                            <FormattedMessage id="manage-patient.no-data" />
                                        </td>
                                    </tr>
                                )}
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
        userInfo: state.user.userInfo 
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
