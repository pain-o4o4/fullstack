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
        let newStatus = event.target.value;
        if(window.confirm(`Bạn có chắc chắn chuyển trạng thái đặt khám của bệnh nhân ${item.patientBookingData.lastName} ${item.patientBookingData.firstName} sang ${newStatus}?`)) {
            let res = await updateBookingStatus({
                doctorId: item.doctorId,
                patientId: item.patientId,
                timeType: item.timeType,
                date: item.date,
                statusId: newStatus,
                email: item.patientBookingData.email,
                patientName: `${item.patientBookingData.lastName} ${item.patientBookingData.firstName}`,
                time: item.timeTypeDataPatient.valueVi, // Vietnamese map
                doctorName: `${this.props.userInfo.lastName} ${this.props.userInfo.firstName}`,
                language: 'vi' // Assuming vietnamese for now
            });
            if (res && res.errCode === 0) {
                toast.success('Cập nhật trạng thái thành công!');
                // Wait for DB and reload
                await this.getDataPatient();
            } else {
                toast.error('Lỗi cập nhật trạng thái');
            }
        }
    }

    render() {
        let { dataPatient, currentDate } = this.state;
        return (
            <div className="manage-patient-container users-container">
                <div className="header-section">
                    <h2 className="title">Quản Lý Bệnh Nhân Đăng Ký Khám</h2>
                </div>

                <div className="apple-card filters-card">
                    <div className="form-grid">
                        <div className="input-group-apple outline-group">
                            <label>Chọn Ngày Xem Lịch</label>
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
                                    <th>Thời gian</th>
                                    <th>Thông tin Hàng chờ</th>
                                    <th>Xác nhận Trạng Thái</th>
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
                                                        {item.timeTypeDataPatient.valueVi}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="user-info-cell">
                                                        <div className="avatar-mini rounded circle-avatar">
                                                            <span>{item.patientBookingData.firstName ? item.patientBookingData.firstName.charAt(0) : 'BN'}</span>
                                                        </div>
                                                        <div className="user-name-block">
                                                            <span className="name">{item.patientBookingData.lastName} {item.patientBookingData.firstName}</span>
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
                                        <td colSpan="3" className="text-center py-4">Chưa có lịch hẹn cho ngày này!</td>
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
