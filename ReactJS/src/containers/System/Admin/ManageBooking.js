import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import {
    getListBookingHistoryService,
    updateBookingServiceManual,
    deleteBookingServiceManual,
    getAllDoctorsService,
    sendMessageApi,
    updateBookingStatus,
    getAllGlobalQuickRepliesApi
} from '../../../services/userService';
import moment from 'moment';
import { toast } from 'react-toastify';
import './ManageBooking.scss';
import { withSocket } from '../../../hoc/withSocket';
import DatePicker from '../../../components/Input/DatePicker';

class ManageBooking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataBooking: [],
            total: 0,
            currentPage: 1,
            totalPages: 1,
            limit: 6,
            isLoading: false,

            // Filters
            selectedDoctorId: 'ALL',
            selectedStatusId: 'ALL',
            selectedDate: moment().startOf('day').valueOf(),
            searchKeyword: '',

            // Edit Modal
            showEditModal: false,
            editData: null,

            // Delete Confirm
            showDeleteConfirm: false,
            deleteId: null,

            // Bulk Delete
            selectedBookings: [],
            showBulkDeleteConfirm: false,

            listDoctors: []
        };
    }

    async componentDidMount() {
        await this.loadData();
        if (this.props.userInfo.roleId === 'R1') {
            this.loadDoctors();
        }

        if (this.props.socket) {
            this.props.socket.on('system_data_changed', this.handleSystemDataChanged);
            this.props.socket.on('booking_status_updated', this.handleSystemDataChanged);
        }
    }

    componentWillUnmount() {
        if (this.props.socket) {
            this.props.socket.off('system_data_changed', this.handleSystemDataChanged);
            this.props.socket.off('booking_status_updated', this.handleSystemDataChanged);
        }
    }

    handleSystemDataChanged = (data) => {
        this.loadData(this.state.currentPage);
    }

    loadDoctors = async () => {
        let res = await getAllDoctorsService();
        if (res && res.errCode === 0) {
            this.setState({ listDoctors: res.data });
        }
    }

    loadData = async (page = 1) => {
        this.setState({ isLoading: true });
        let { userInfo } = this.props;
        let { selectedDoctorId, selectedStatusId, selectedDate, searchKeyword, limit } = this.state;

        let params = {
            roleId: userInfo.roleId,
            page: page,
            limit: limit,
            statusId: selectedStatusId,
            date: selectedDate,
            searchKeyword: searchKeyword
        };

        if (userInfo.roleId === 'R2') {
            params.doctorId = userInfo.id;
        } else if (selectedDoctorId !== 'ALL') {
            params.doctorId = selectedDoctorId;
        }

        let res = await getListBookingHistoryService(params);
        if (res && res.errCode === 0) {
            this.setState({
                dataBooking: res.data,
                total: res.total,
                totalPages: res.totalPages,
                currentPage: res.currentPage,
                isLoading: false
            });
        } else {
            this.setState({ isLoading: false });
        }
    }

    handleFilterChange = (key, value) => {
        this.setState({ [key]: value, currentPage: 1 }, () => {
            this.loadData(1);
        });
    }

    handleOnChangeDatePicker = (date) => {
        let timestamp = date[0] ? new Date(date[0]).getTime() : 'ALL';
        this.handleFilterChange('selectedDate', timestamp);
    }

    handlePageChange = (page) => {
        this.loadData(page);
    }

    handleOpenEdit = (item) => {
        this.setState({
            showEditModal: true,
            editData: { ...item }
        });
    }

    handleEditChange = (key, value) => {
        this.setState({
            editData: {
                ...this.state.editData,
                [key]: value
            }
        });
    }

    saveEdit = async () => {
        let { editData } = this.state;
        let { language, userInfo } = this.props;
        this.setState({ isLoading: true });

        try {
            let res = await updateBookingStatus({
                doctorId: editData.doctorId,
                patientId: editData.patientId,
                timeType: editData.timeType,
                date: editData.date,
                statusId: editData.statusId,
                email: editData.patientBookingData ? editData.patientBookingData.email : '',
                patientName: editData.patientBookingData ? `${editData.patientBookingData.lastName} ${editData.patientBookingData.firstName}` : 'Patient',
                time: editData.timeTypeDataPatient ? (language === 'vi' ? editData.timeTypeDataPatient.valueVi : editData.timeTypeDataPatient.valueEn) : '',
                doctorName: language === 'vi'
                    ? `${userInfo.lastName} ${userInfo.firstName}`
                    : `${userInfo.firstName} ${userInfo.lastName}`,
                language: language
            });

            if (res && res.errCode === 0) {
                toast.success(language === 'vi' ? 'Cập nhật thành công!' : 'Updated successfully!');
                
                // Lấy mẫu tin nhắn tự động từ DB nếu trạng thái là S3 hoặc S5
                if (editData.statusId === 'S3' || editData.statusId === 'S5') {
                    let quickRepliesRes = await getAllGlobalQuickRepliesApi();
                    if (quickRepliesRes && quickRepliesRes.errCode === 0) {
                        let typeNeeded = editData.statusId === 'S3' ? 'AUTO_S3' : 'AUTO_S5';
                        let template = quickRepliesRes.data.find(item => item.type === typeNeeded);
                        
                        if (template && template.content) {
                            let clinicName = editData.clinicBookingData && editData.clinicBookingData.name ? editData.clinicBookingData.name : 'Phòng khám của chúng tôi';
                            let specialtyName = editData.doctorBookingData && editData.doctorBookingData.doctorinforData && editData.doctorBookingData.doctorinforData.specialtyData ? editData.doctorBookingData.doctorinforData.specialtyData.name : 'Chuyên khoa';

                            let text = template.content
                                .replace(/\{\{\s*patientName\s*\}\}/g, editData.patientBookingData ? `${editData.patientBookingData.lastName} ${editData.patientBookingData.firstName}` : '')
                                .replace(/\{\{\s*doctorName\s*\}\}/g, language === 'vi' ? `${userInfo.lastName} ${userInfo.firstName}` : `${userInfo.firstName} ${userInfo.lastName}`)
                                .replace(/\{\{\s*clinicName\s*\}\}/g, clinicName)
                                .replace(/\{\{\s*specialty\s*\}\}/g, specialtyName);

                            await sendMessageApi({
                                senderId: editData.doctorId,
                                receiverId: editData.patientId,
                                text: text,
                                type: 'text'
                            });
                        }
                    }
                }

                this.setState({ showEditModal: false, editData: null });
                this.loadData(this.state.currentPage);
            } else {
                toast.error(res.errMessage || (language === 'vi' ? "Cập nhật thất bại" : "Update failed"));
            }
        } catch (error) {
            console.error("Lỗi khi lưu lịch hẹn:", error);
            if (error.response && error.response.status === 403) {
                toast.error(language === 'vi' ? "Bạn không có quyền thực hiện thao tác này!" : "You don't have permission to do this!");
            } else {
                toast.error(language === 'vi' ? "Có lỗi xảy ra trong hệ thống!" : "An error occurred in the system!");
            }
        }
        this.setState({ isLoading: false });
        this.setState({ isLoading: false });
    }

    handleSelectBooking = (bookingId) => {
        let { selectedBookings } = this.state;
        if (selectedBookings.includes(bookingId)) {
            this.setState({ selectedBookings: selectedBookings.filter(id => id !== bookingId) });
        } else {
            this.setState({ selectedBookings: [...selectedBookings, bookingId] });
        }
    }

    handleSelectAll = () => {
        let { dataBooking, selectedBookings } = this.state;
        let allIdsOnPage = dataBooking.map(b => b.id);
        let allSelectedOnPage = allIdsOnPage.every(id => selectedBookings.includes(id));

        if (allSelectedOnPage) {
            this.setState({ selectedBookings: selectedBookings.filter(id => !allIdsOnPage.includes(id)) });
        } else {
            this.setState({ selectedBookings: [...new Set([...selectedBookings, ...allIdsOnPage])] });
        }
    }

    handleBulkDelete = () => {
        if (this.state.selectedBookings.length === 0) return;
        this.setState({ showBulkDeleteConfirm: true });
    }

    confirmBulkDelete = async () => {
        this.setState({ isLoading: true });
        let { selectedBookings } = this.state;
        let successCount = 0;
        for (let bookingId of selectedBookings) {
            let res = await deleteBookingServiceManual(bookingId);
            if (res && res.errCode === 0) successCount++;
        }
        
        if (successCount > 0) {
            toast.success(this.props.language === 'vi' ? `Đã xóa mềm ${successCount} lịch hẹn!` : `Soft deleted ${successCount} bookings!`);
        }
        
        this.setState({
            selectedBookings: [],
            showBulkDeleteConfirm: false,
            isLoading: false
        });
        this.loadData(this.state.currentPage);
    }

    handleOpenDelete = (id) => {
        this.setState({
            showDeleteConfirm: true,
            deleteId: id
        });
    }

    confirmDelete = async () => {
        this.setState({ isLoading: true });
        let res = await deleteBookingServiceManual(this.state.deleteId);
        if (res && res.errCode === 0) {
            toast.success(this.props.language === 'vi' ? "Đã xóa khỏi danh sách!" : "Removed from list!");
            this.setState({ showDeleteConfirm: false, deleteId: null });
            this.loadData(this.state.currentPage);
        } else {
            toast.error("Delete failed");
        }
        this.setState({ isLoading: false });
    }

    render() {
        let { dataBooking, total, currentPage, totalPages, isLoading, listDoctors, selectedDoctorId, selectedStatusId, selectedDate, searchKeyword, showEditModal, editData, showDeleteConfirm, selectedBookings, showBulkDeleteConfirm } = this.state;
        let { language, userInfo } = this.props;

        let isAllSelectedOnPage = dataBooking && dataBooking.length > 0 && dataBooking.every(b => selectedBookings.includes(b.id));

        return (
            <div className="manage-booking-history-container">
                <div className="header-section">
                    <h2 className="title">
                        {userInfo.roleId === 'R1' ?
                            <FormattedMessage id="manage-booking.title-admin" /> :
                            <FormattedMessage id="manage-booking.title" />
                        }
                    </h2>
                </div>

                <div className="filters-card">
                    <div className="form-grid">
                        <div className="input-group-apple">
                            <label><FormattedMessage id="manage-booking.date" /></label>
                            <div className="date-picker-wrapper">
                                <DatePicker
                                    onChange={this.handleOnChangeDatePicker}
                                    className="input"
                                    value={selectedDate === 'ALL' ? '' : selectedDate}
                                />
                                <button className="btn-clear-date" onClick={() => this.handleFilterChange('selectedDate', 'ALL')}>
                                    <i className="fas fa-history"></i>
                                </button>
                            </div>
                        </div>

                        {userInfo.roleId === 'R1' && (
                            <div className="input-group-apple">
                                <label><FormattedMessage id="manage-booking.doctor" /></label>
                                <select className="input" value={selectedDoctorId} onChange={(e) => this.handleFilterChange('selectedDoctorId', e.target.value)}>
                                    <option value="ALL">{language === 'vi' ? ' Tất cả bác sĩ ' : ' All Doctors '}</option>
                                    {listDoctors.map((item, index) => (
                                        <option key={index} value={item.id}>
                                            {language === 'vi' ? `${item.lastName} ${item.firstName}` : `${item.firstName} ${item.lastName}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div className="input-group-apple">
                            <label><FormattedMessage id="manage-booking.status" /></label>
                            <select className="input" value={selectedStatusId} onChange={(e) => this.handleFilterChange('selectedStatusId', e.target.value)}>
                                <option value="ALL">{language === 'vi' ? ' Tất cả trạng thái ' : ' All Status '}</option>
                                <option value="S1">{language === 'vi' ? 'Chờ thanh toán' : 'Pending'}</option>
                                <option value="S2">{language === 'vi' ? 'Đã thanh toán' : 'Paid'}</option>
                                <option value="S3">{language === 'vi' ? 'Đã khám' : 'Done'}</option>
                                <option value="S4">{language === 'vi' ? 'Đã hủy' : 'Cancelled'}</option>
                                <option value="S5">{language === 'vi' ? 'Lỡ hẹn' : 'Missed'}</option>
                            </select>
                        </div>
                        <div className="input-group-apple">
                            <label>Tìm kiếm</label>
                            <div className="search-wrapper">
                                <i className="fas fa-search"></i>
                                <input
                                    type="text"
                                    className="input search-input"
                                    placeholder="Tên, Email, SĐT..."
                                    value={searchKeyword}
                                    onChange={(e) => this.handleFilterChange('searchKeyword', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="table-wrapper">
                    {isLoading && <div className="loading-bar"></div>}
                    <div className="table-card">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th className="check-col">
                                        <input
                                            type="checkbox"
                                            checked={isAllSelectedOnPage}
                                            onChange={this.handleSelectAll}
                                        />
                                    </th>
                                    <th>ID</th>
                                    <th><FormattedMessage id="manage-booking.date" /></th>
                                    <th><FormattedMessage id="manage-booking.patient" /></th>
                                    {userInfo.roleId === 'R1' && <th><FormattedMessage id="manage-booking.doctor" /></th>}
                                    <th><FormattedMessage id="manage-booking.status" /></th>
                                    <th style={{ textAlign: 'right' }}>
                                        {selectedBookings.length > 0 ? (
                                            <div className="header-bulk-actions">
                                                <button className="btn-cancel-select" onClick={() => this.setState({ selectedBookings: [] })} title={language === 'vi' ? 'Hủy chọn' : 'Cancel'}>
                                                    <i className="fas fa-times"></i>
                                                </button>
                                                <button className="btn-bulk-delete" onClick={this.handleBulkDelete} title={language === 'vi' ? 'Xóa mục đã chọn' : 'Delete selected'}>
                                                    <i className="fas fa-trash-alt"></i>
                                                    <span>{selectedBookings.length}</span>
                                                </button>
                                            </div>
                                        ) : (
                                            <FormattedMessage id="manage-booking.actions" />
                                        )}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataBooking && dataBooking.length > 0 ? (
                                    dataBooking.map((item, index) => {
                                        let patientName = item.patientBookingData ? `${item.patientBookingData.lastName} ${item.patientBookingData.firstName}` : 'Unknown';
                                        let doctorName = item.doctorBookingData ? `${item.doctorBookingData.lastName} ${item.doctorBookingData.firstName}` : 'Unknown';
                                        return (
                                            <tr key={index} className={selectedBookings.includes(item.id) ? 'selected-row' : ''}>
                                                <td className="check-col">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedBookings.includes(item.id)}
                                                        onChange={() => this.handleSelectBooking(item.id)}
                                                    />
                                                </td>
                                                <td>#{item.id}</td>
                                                <td>
                                                    <div className="date-time">
                                                        <span className="date">{item.date}</span>
                                                        <span className="time">{item.timeTypeDataPatient ? (language === 'vi' ? item.timeTypeDataPatient.valueVi : item.timeTypeDataPatient.valueEn) : ''}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="user-info-cell">
                                                        <div className="user-name-block">
                                                            <span className="name">{patientName}</span>
                                                            <span className="email">{item.patientBookingData ? item.patientBookingData.email : ''}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                {userInfo.roleId === 'R1' && (
                                                    <td>{doctorName}</td>
                                                )}
                                                <td>
                                                    <span className={`status-badge ${item.statusId}`}>
                                                        {language === 'vi' ? item.statusData.valueVi : item.statusData.valueEn}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button className="btn-action edit" onClick={() => this.handleOpenEdit(item)}>
                                                            <i className="fas fa-pencil-alt"></i>
                                                        </button>
                                                        <button className="btn-action delete" onClick={() => this.handleOpenDelete(item.id)}>
                                                            <i className="fas fa-trash-alt"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="no-data">
                                            <FormattedMessage id="manage-booking.no-data" />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="pagination-wrapper">
                    <div className="pagination-pill">
                        <button className="nav-btn" disabled={currentPage === 1} onClick={() => this.handlePageChange(currentPage - 1)}>
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        <div className="page-info">
                            {currentPage} / {totalPages || 1}
                        </div>
                        <button className="nav-btn" disabled={currentPage === totalPages} onClick={() => this.handlePageChange(currentPage + 1)}>
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>

                {/* EDIT MODAL */}
                {showEditModal && editData && (
                    <div className="apple-modal-overlay">
                        <div className="apple-modal-content">
                            <div className="modal-header">
                                <h3><FormattedMessage id="manage-booking.edit-title" /> #{editData.id}</h3>
                                <button className="btn-close" onClick={() => this.setState({ showEditModal: false })}>&times;</button>
                            </div>
                            <div className="modal-body">
                                <div className="patient-summary">
                                    <strong>{editData.patientBookingData ? `${editData.patientBookingData.lastName} ${editData.patientBookingData.firstName}` : 'Unknown'}</strong>
                                    <p>{editData.date} • {editData.timeTypeDataPatient ? (language === 'vi' ? editData.timeTypeDataPatient.valueVi : editData.timeTypeDataPatient.valueEn) : ''}</p>
                                </div>
                                <div className="form-group">
                                    <label><FormattedMessage id="manage-booking.status" /></label>
                                    <select className="input" value={editData.statusId} onChange={(e) => this.handleEditChange('statusId', e.target.value)}>
                                        <option value="S1" disabled={true}>{language === 'vi' ? 'Chưa thanh toán' : 'Pending Payment'}</option>
                                        <option value="S2">{language === 'vi' ? 'Đã thanh toán (Chờ khám)' : 'Paid (Waiting)'}</option>
                                        <option value="S3">{language === 'vi' ? 'Đã khám' : 'Completed'}</option>
                                        <option value="S4" disabled={true}>{language === 'vi' ? 'Đã hủy' : 'Cancelled'}</option>
                                        <option value="S5">{language === 'vi' ? 'Lỡ hẹn' : 'Missed'}</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label><FormattedMessage id="manage-booking.reason" /></label>
                                    <textarea className="input" rows="3" value={editData.reason || ''} onChange={(e) => this.handleEditChange('reason', e.target.value)}></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn-cancel" onClick={() => this.setState({ showEditModal: false })}>Hủy</button>
                                <button className="btn-save" onClick={this.saveEdit}>Lưu thay đổi</button>
                            </div>
                        </div>
                    </div>
                )}

                {showDeleteConfirm && (
                    <div className="apple-confirm-overlay">
                        <div className="apple-confirm-popup">
                            <div className="popup-title">Xác nhận xóa?</div>
                            <div className="popup-desc"><FormattedMessage id="manage-booking.soft-delete-confirm" /></div>
                            <div className="popup-actions">
                                <button className="btn-cancel" onClick={() => this.setState({ showDeleteConfirm: false, deleteId: null })}>Hủy</button>
                                <button className="btn-delete" onClick={this.confirmDelete}>Xác nhận</button>
                            </div>
                        </div>
                    </div>
                )}

                {showBulkDeleteConfirm && (
                    <div className="apple-confirm-overlay">
                        <div className="apple-confirm-popup">
                            <div className="popup-title">Xóa {selectedBookings.length} mục đã chọn?</div>
                            <div className="popup-desc">Các lịch hẹn này sẽ bị xóa mềm khỏi danh sách. Bạn có chắc chắn muốn tiếp tục?</div>
                            <div className="popup-actions">
                                <button className="btn-cancel" onClick={() => this.setState({ showBulkDeleteConfirm: false })}>Hủy</button>
                                <button className="btn-delete" onClick={this.confirmBulkDelete}>Xác nhận</button>
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

export default withSocket(connect(mapStateToProps)(ManageBooking));
