import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import DatePicker from '../../../components/Input/DatePicker';
import { getListPatientForDoctor, updateBookingStatus, sendMessageApi } from '../../../services/userService';
import moment from 'moment';
import { toast } from 'react-toastify';
import { withSocket } from '../../../hoc/withSocket';
import './ManagePatient.scss';

class ManagePatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],
            showConfirm: false,
            confirmData: null,
            isLoading: false,
            searchKeyword: '',
            currentPage: 1,
            itemsPerPage: 10
        };
    }

    async componentDidMount() {
        this.getDataPatient();

        // Lắng nghe sự kiện đồng bộ dữ liệu từ server
        if (this.props.socket) {
            this.props.socket.on('system_data_changed', this.handleSystemDataChanged);
        }
    }

    componentWillUnmount() {
        if (this.props.socket) {
            this.props.socket.off('system_data_changed', this.handleSystemDataChanged);
        }
    }

    handleSystemDataChanged = (data) => {
        if (data && data.entity === 'BOOKING') {
            this.getDataPatient();
        }
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

    handleOnChangeSearch = (event) => {
        this.setState({
            searchKeyword: event.target.value,
            currentPage: 1 // Reset to first page on search
        });
    }

    setPage = (pageNumber) => {
        this.setState({ currentPage: pageNumber });
    }

    handleOpenConfirm = (event, item) => {
        this.setState({
            showConfirm: true,
            confirmData: {
                item: item,
                newStatus: event.target.value
            }
        });
    }

    confirmChangeStatus = async () => {
        let { language, userInfo } = this.props;
        let { confirmData } = this.state;
        if (!confirmData) return;

        this.setState({ isLoading: true });
        let { item, newStatus } = confirmData;

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
                ? `${userInfo.lastName} ${userInfo.firstName}`
                : `${userInfo.firstName} ${userInfo.lastName}`,
            language: language
        });

        if (res && res.errCode === 0) {
            toast.success(language === 'vi' ? 'Cập nhật trạng thái thành công!' : 'Status updated successfully!');
            
            // Auto thank you message for completed appointments
            if (newStatus === 'S3') {
                await sendMessageApi({
                    senderId: item.doctorId,
                    receiverId: item.patientId,
                    text: language === 'vi' 
                        ? 'Chào bạn, cuộc khám bệnh đã hoàn tất. Cảm ơn bạn đã tin tưởng. Chúc bạn mau khỏe và hãy tuân thủ đúng đơn thuốc nhé!'
                        : 'Hello, your appointment is completed. Thank you for your trust. Get well soon and follow your prescription!',
                    type: 'text'
                });
            }

            this.setState({ showConfirm: false, confirmData: null, isLoading: false }, () => {
                this.getDataPatient();
            });
        } else {
            toast.error(language === 'vi' ? 'Lỗi cập nhật trạng thái' : 'Error updating status');
            this.setState({ isLoading: false });
        }
    }

    render() {
        let { dataPatient, currentDate, showConfirm, confirmData, isLoading } = this.state;
        let { language } = this.props;

        return (
            <div className="manage-patient-container">
                <div className="header-section">
                    <h2 className="title"><FormattedMessage id="manage-patient.title" /></h2>
                </div>

                <div className="filters-card">
                    <div className="form-grid">
                        <div className="input-group-apple outline-group">
                            <label><FormattedMessage id="manage-patient.choose-date" /></label>
                            <DatePicker
                                onChange={this.handleOnChangeDatePicker}
                                className="input"
                                value={currentDate}
                            />
                        </div>
                        <div className="input-group-apple">
                            <label>Tìm kiếm bệnh nhân</label>
                            <i className="fas fa-search"></i>
                            <input
                                type="text"
                                className="input search-input"
                                placeholder="Tên, SĐT, Email..."
                                value={this.state.searchKeyword}
                                onChange={this.handleOnChangeSearch}
                            />
                        </div>
                    </div>
                </div>

                <div className="table-wrapper">
                    <div className="table-card">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th><FormattedMessage id="manage-patient.time" /></th>
                                    <th><FormattedMessage id="manage-patient.name" /></th>
                                    <th><FormattedMessage id="manage-patient.actions" /></th>
                                </tr>
                            </thead>
                            <tbody>
                                {(() => {
                                    let filteredData = dataPatient.filter(item => {
                                        let keyword = this.state.searchKeyword.toLowerCase();
                                        let name = `${item.patientBookingData.lastName} ${item.patientBookingData.firstName}`.toLowerCase();
                                        let email = item.patientBookingData.email.toLowerCase();
                                        let phone = item.patientBookingData.phonenumber;
                                        return name.includes(keyword) || email.includes(keyword) || phone.includes(keyword);
                                    });

                                    const { currentPage, itemsPerPage } = this.state;
                                    const indexOfLastItem = currentPage * itemsPerPage;
                                    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
                                    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

                                    if (currentItems && currentItems.length > 0) {
                                        return currentItems.map((item, index) => {
                                            let labelColor = 'gray';
                                            if (item.statusId === 'S1') labelColor = 'orange'; // Pending
                                            if (item.statusId === 'S2') labelColor = 'blue';   // Paid
                                            if (item.statusId === 'S3') labelColor = 'green';  // Done
                                            if (item.statusId === 'S4') labelColor = 'gray';   // Cancelled
                                            if (item.statusId === 'S5') labelColor = 'red';    // Missed

                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        <span className={`role-badge ${labelColor}`}>
                                                            <i className="far fa-clock" style={{ marginRight: '6px' }}></i>
                                                            {language === 'vi' ? item.timeTypeDataPatient.valueVi : item.timeTypeDataPatient.valueEn}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="user-info-cell">
                                                            <div className="user-name-block">
                                                                <span className="name">
                                                                    {language === 'vi'
                                                                        ? `${item.patientBookingData.lastName} ${item.patientBookingData.firstName}`
                                                                        : `${item.patientBookingData.firstName} ${item.patientBookingData.lastName}`}
                                                                </span>
                                                                <span className="email">
                                                                    <i className="fas fa-phone-alt" style={{ fontSize: '11px', marginRight: '5px' }}></i>
                                                                    {item.patientBookingData.phonenumber} • {item.patientBookingData.email}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <select
                                                            className={`status-select ${item.statusId}`}
                                                            value={item.statusId}
                                                            onChange={(e) => this.handleOpenConfirm(e, item)}
                                                        >
                                                            <option value="S1" disabled={true}>{language === 'vi' ? 'Chưa thanh toán' : 'Pending Payment'}</option>
                                                            <option value="S2">{language === 'vi' ? 'Đã thanh toán (Chờ khám)' : 'Paid (Waiting)'}</option>
                                                            <option value="S3">{language === 'vi' ? 'Đã khám' : 'Completed'}</option>
                                                            <option value="S4" disabled={true}>{language === 'vi' ? 'Đã hủy' : 'Cancelled'}</option>
                                                            <option value="S5">{language === 'vi' ? 'Lỡ hẹn' : 'Missed'}</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            )
                                        });
                                    } else {
                                        return (
                                            <tr>
                                                <td colSpan="3" style={{ textAlign: 'center', padding: '50px 0', color: '#86868b' }}>
                                                    <div style={{ fontSize: '40px', marginBottom: '10px', opacity: 0.2 }}>
                                                        <i className="fas fa-calendar-times"></i>
                                                    </div>
                                                    <FormattedMessage id="manage-patient.no-data" />
                                                </td>
                                            </tr>
                                        );
                                    }
                                })()}
                            </tbody>
                        </table>
                    </div>
                    <div className="table-footer">
                        <div className="footer-info">
                            <span><FormattedMessage id="manage-patient.date" />: {moment(currentDate).format('DD/MM/YYYY')}</span>
                            <span style={{ marginLeft: '16px' }}>{dataPatient ? dataPatient.length : 0} <FormattedMessage id="manage-user.total-users" /></span>
                        </div>
                        <div className="pagination-bar-apple">
                            {(() => {
                                let filteredData = dataPatient.filter(item => {
                                    let keyword = this.state.searchKeyword.toLowerCase();
                                    let name = `${item.patientBookingData.lastName} ${item.patientBookingData.firstName}`.toLowerCase();
                                    let email = item.patientBookingData.email.toLowerCase();
                                    let phone = item.patientBookingData.phonenumber;
                                    return name.includes(keyword) || email.includes(keyword) || phone.includes(keyword);
                                });

                                const { currentPage, itemsPerPage } = this.state;
                                const totalPages = Math.ceil(filteredData.length / itemsPerPage);

                                if (totalPages <= 1) return null;

                                return (
                                    <>
                                        <button 
                                            className="page-btn" 
                                            disabled={currentPage === 1}
                                            onClick={() => this.setPage(currentPage - 1)}
                                        >
                                            <i className="fas fa-chevron-left"></i>
                                        </button>
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button 
                                                key={i} 
                                                className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                                                onClick={() => this.setPage(i + 1)}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                        <button 
                                            className="page-btn" 
                                            disabled={currentPage === totalPages}
                                            onClick={() => this.setPage(currentPage + 1)}
                                        >
                                            <i className="fas fa-chevron-right"></i>
                                        </button>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </div>

                {/* APPLE STYLE CONFIRM POPUP */}
                {showConfirm && (
                    <div className="apple-confirm-overlay">
                        <div className="apple-confirm-popup">
                            <div className="popup-title">Thay đổi trạng thái?</div>
                            <div className="popup-desc">
                                Bạn có chắc chắn muốn chuyển trạng thái khám của bệnh nhân 
                                <strong> {confirmData?.item?.patientBookingData?.lastName} {confirmData?.item?.patientBookingData?.firstName}</strong> sang 
                                <strong> {confirmData?.newStatus === 'S3' ? 'Đã khám' : confirmData?.newStatus === 'S5' ? 'Lỡ hẹn' : 'Đã thanh toán'}</strong>?
                            </div>
                            <div className="popup-actions">
                                <button className="btn-cancel" disabled={isLoading} onClick={() => this.setState({ showConfirm: false, confirmData: null })}>Hủy</button>
                                <button className="btn-delete" style={{ background: '#0071e3' }} disabled={isLoading} onClick={this.confirmChangeStatus}>
                                    {isLoading ? 'Đang xử lý...' : 'Xác nhận'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
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

export default withSocket(connect(mapStateToProps, mapDispatchToProps)(ManagePatient));
