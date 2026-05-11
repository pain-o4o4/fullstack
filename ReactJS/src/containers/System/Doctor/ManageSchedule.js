import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ManageSchedule.scss';
import { LANGUAGES } from '../../../utils/constant';
import Select from 'react-select';
import * as action from '../../../store/actions'
import DatePicker from '../../../components/Input/DatePicker';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { bulkCreateScheduleService, getScheduleByDate } from '../../../services/userService'
import { withSocket } from '../../../hoc/withSocket';
import moment from 'moment';

class ManageSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listAllDoctors: [],
            selectedOption: null,
            currentDate: '',
            listAllScheduleTime: [],
            showConfirm: false,
            isLoading: false
        };
    }

    async componentDidMount() {
        this.props.fetchAllDoctors();
        this.props.fetchAllScheduleTime();

        // Lock doctor immediately if user is R2
        let { userInfo, language } = this.props;
        if (userInfo && userInfo.roleId === 'R2') {
            let labelVi = `${userInfo.lastName} ${userInfo.firstName}`;
            let labelEn = `${userInfo.firstName} ${userInfo.lastName}`;

            this.setState({
                selectedOption: {
                    value: userInfo.id,
                    label: language === LANGUAGES.VI ? labelVi : labelEn
                }
            });
        }

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
        if (data && (data.entity === 'SCHEDULE' || data.entity === 'BOOKING')) {
            if (this.state.selectedOption && this.state.selectedOption.value && this.state.currentDate) {
                this.fetchExistingSchedules();
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInput(this.props.allDoctors, 'USERS');
            this.setState({ listAllDoctors: dataSelect });
        }

        if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
            let dataSelect = this.buildDataInput(this.props.allScheduleTime, 'TIME');
            this.setState({ listAllScheduleTime: dataSelect });
        }

        if (prevProps.language !== this.props.language) {
            let dataSelectDoctors = this.buildDataInput(this.props.allDoctors, 'USERS');
            let dataSelectTime = this.buildDataInput(this.props.allScheduleTime, 'TIME');
            this.setState({
                listAllDoctors: dataSelectDoctors,
                listAllScheduleTime: dataSelectTime
            });

            let { userInfo } = this.props;
            if (userInfo && userInfo.roleId === 'R2' && this.state.selectedOption) {
                let labelVi = `${userInfo.lastName} ${userInfo.firstName}`;
                let labelEn = `${userInfo.firstName} ${userInfo.lastName}`;
                this.setState({
                    selectedOption: {
                        value: userInfo.id,
                        label: this.props.language === LANGUAGES.VI ? labelVi : labelEn
                    }
                });
            }
        }

        if (prevState.selectedOption !== this.state.selectedOption || prevState.currentDate !== this.state.currentDate) {
            if (this.state.selectedOption && this.state.selectedOption.value && this.state.currentDate) {
                await this.fetchExistingSchedules();
            }
        }
    }

    fetchExistingSchedules = async () => {
        let doctorId = this.state.selectedOption.value;
        let formattedDate = new Date(this.state.currentDate).getTime();

        try {
            let res = await getScheduleByDate(doctorId, formattedDate);
            if (res && res.errCode === 0) {
                let existingSchedules = res.data; 
                let { listAllScheduleTime } = this.state;

                if (listAllScheduleTime && listAllScheduleTime.length > 0) {
                    let updatedScheduleTime = listAllScheduleTime.map(item => {
                        let isBooked = existingSchedules.some(ex => ex.timeType === item.value);
                        return { ...item, isSelected: isBooked };
                    });

                    this.setState({ listAllScheduleTime: updatedScheduleTime });
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    buildDataInput = (dataInput, type) => {
        let result = []
        let { language } = this.props;

        if (dataInput && dataInput.length > 0) {
            dataInput.forEach((item) => {
                let object = {};
                if (type === 'USERS') {
                    let labelVi = `${item.lastName} ${item.firstName}`;
                    let labelEn = `${item.firstName} ${item.lastName}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.id;
                }
                if (type === 'TIME') {
                    object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                    object.value = item.keyMap;
                    object.isSelected = false;
                }

                result.push(object);
            });
        }
        return result;
    }

    handleChange = (selectedDoctor) => {
        this.setState({ selectedOption: selectedDoctor });
    };

    handleChangeDate = (date) => {
        this.setState({ currentDate: date[0] });
    }

    handleClickBtnTime = (time) => {
        let { listAllScheduleTime } = this.state;
        if (listAllScheduleTime && listAllScheduleTime.length > 0) {
            let data = listAllScheduleTime.map(item => {
                if (item.value === time.value) {
                    item.isSelected = !item.isSelected;
                }
                return item;
            });
            this.setState({ listAllScheduleTime: data });
        }
    }

    handleSaveSchedule = async () => {
        let { listAllScheduleTime, selectedOption, currentDate } = this.state;
        if (!currentDate || !selectedOption || _.isEmpty(selectedOption)) {
            toast.error("Vui lòng chọn đầy đủ thông tin!");
            return;
        }

        this.setState({ showConfirm: true });
    }

    confirmSave = async () => {
        let { listAllScheduleTime, selectedOption, currentDate } = this.state;
        let formartedDate = new Date(currentDate).getTime();
        let result = [];

        if (listAllScheduleTime && listAllScheduleTime.length > 0) {
            let schedule = listAllScheduleTime.filter(item => item.isSelected === true);
            schedule.forEach(item => {
                result.push({
                    doctorId: selectedOption.value,
                    date: formartedDate,
                    timeType: item.value
                });
            });
        }

        this.setState({ isLoading: true });
        let res = await bulkCreateScheduleService({
            arrSchedule: result,
            doctorId: selectedOption.value,
            date: formartedDate
        });

        if (res && res.errCode === 0) {
            toast.success("Lưu lịch khám thành công!");
            this.setState({ showConfirm: false, isLoading: false });
            await this.fetchExistingSchedules();
        } else {
            toast.error("Lưu lịch khám thất bại!");
            this.setState({ isLoading: false });
        }
    }

    handleClearSelection = () => {
        let { listAllScheduleTime } = this.state;
        let reset = listAllScheduleTime.map(item => ({ ...item, isSelected: false }));
        this.setState({ listAllScheduleTime: reset });
    }

    render() {
        let { language, userInfo } = this.props;
        let { listAllScheduleTime, selectedOption, currentDate, showConfirm, isLoading } = this.state;
        let isDoctorRole = userInfo && userInfo.roleId === 'R2';
        let selectedCount = listAllScheduleTime.filter(i => i.isSelected).length;

        return (
            <div className="manage-schedule-container">
                <div className="manage-header">
                    <div className="header-info">
                        <h1><FormattedMessage id='manage-schedule.title' /></h1>
                        <span>Lên kế hoạch thời gian khám bệnh chi tiết</span>
                    </div>
                </div>

                <div className="schedule-main-layout">
                    {/* Sidebar: Configuration */}
                    <div className="config-sidebar">
                        <div className="sidebar-card">
                            <span className="card-label">Bác sĩ phụ trách</span>
                            <div className="apple-select">
                                <Select
                                    value={selectedOption}
                                    onChange={this.handleChange}
                                    options={this.state.listAllDoctors}
                                    isDisabled={isDoctorRole}
                                    placeholder={language === LANGUAGES.VI ? 'Tìm bác sĩ...' : 'Search doctor...'}
                                    menuPortalTarget={document.body}
                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                />
                            </div>
                            {selectedOption && (
                                (() => {
                                    let doc = this.props.allDoctors.find(d => d.id === selectedOption.value);
                                    let image = '';
                                    let position = language === LANGUAGES.VI ? 'Bác sĩ hệ thống' : 'System Doctor';
                                    if (doc) {
                                        image = doc.image || '';
                                        if (doc.positionData) {
                                            position = language === LANGUAGES.VI ? doc.positionData.valueVi : doc.positionData.valueEn;
                                        }
                                    }
                                    return (
                                        <div className="doctor-summary">
                                            <div className="doc-avatar">
                                                {image ? <img src={image} alt="doc" /> : <i className="fas fa-user-md"></i>}
                                            </div>
                                            <div className="doc-info">
                                                <div className="doc-name">{selectedOption.label}</div>
                                                <div className="doc-role">{position}</div>
                                            </div>
                                        </div>
                                    );
                                })()
                            )}
                        </div>

                        <div className="sidebar-card">
                            <span className="card-label">Ngày khám bệnh</span>
                            <DatePicker
                                className="apple-datepicker"
                                value={currentDate}
                                onChange={this.handleChangeDate}
                                minDate={new Date()}
                            />
                            {currentDate && (
                                <div className="doctor-summary">
                                    <div className="doc-avatar" style={{ color: '#ff3b30' }}>
                                        <i className="fas fa-calendar-day"></i>
                                    </div>
                                    <div className="doc-info">
                                        <div className="doc-name">{moment(currentDate).format('DD/MM/YYYY')}</div>
                                        <div className="doc-role">{moment(currentDate).format('dddd')}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Content: Time Picker */}
                    <div className="time-picker-area">
                        <div className="area-header">
                            <div className="title-wrap">
                                <h2>Khung giờ làm việc</h2>
                                <p>Chọn các khung giờ bác sĩ có thể tiếp nhận bệnh nhân</p>
                            </div>
                            {selectedCount > 0 && (
                                <div className="selection-badge">
                                    Đã chọn {selectedCount} khung giờ
                                </div>
                            )}
                        </div>

                        <div className="time-slots-grid">
                            {listAllScheduleTime && listAllScheduleTime.length > 0 ? (
                                listAllScheduleTime.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`time-pill ${item.isSelected ? 'selected' : ''}`}
                                        onClick={() => this.handleClickBtnTime(item)}
                                    >
                                        <span className="time-label">{item.label}</span>
                                        <span className="status-tag">
                                            {item.isSelected ? 'Đã chọn' : 'Trống'}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="no-time-msg">Vui lòng chọn thông tin để hiển thị khung giờ</div>
                            )}
                        </div>

                        <div className="footer-actions">
                            {selectedCount > 0 && (
                                <button className="btn-clear" onClick={this.handleClearSelection}>Xóa chọn</button>
                            )}
                            <button 
                                className="btn-save-schedule" 
                                disabled={!selectedOption || !currentDate}
                                onClick={this.handleSaveSchedule}
                            >
                                <i className="fas fa-save" style={{ marginRight: '8px' }}></i>
                                Lưu lịch khám
                            </button>
                        </div>
                    </div>
                </div>

                {/* CONFIRMATION POPUP */}
                {showConfirm && (
                    <div className="apple-confirm-overlay">
                        <div className="apple-confirm-popup">
                            <div className="popup-title">Lưu thay đổi?</div>
                            <div className="popup-desc">
                                Bạn đang thiết lập {selectedCount} khung giờ khám cho bác sĩ vào ngày {moment(currentDate).format('DD/MM/YYYY')}. Dữ liệu cũ (nếu có) sẽ bị thay thế.
                            </div>
                            <div className="popup-actions">
                                <button className="btn-cancel" disabled={isLoading} onClick={() => this.setState({ showConfirm: false })}>Hủy</button>
                                <button className="btn-delete" style={{ background: '#0071e3' }} disabled={isLoading} onClick={this.confirmSave}>
                                    {isLoading ? 'Đang lưu...' : 'Xác nhận lưu'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    language: state.app.language,
    allDoctors: state.admin.allDoctors,
    allScheduleTime: state.admin.allScheduleTime,
    userInfo: state.user.userInfo
});

const mapDispatchToProps = dispatch => ({
    fetchAllDoctors: () => dispatch(action.fetchAllDoctors()),
    fetchAllScheduleTime: () => dispatch(action.fetchAllScheduleTime()),
});

export default withSocket(connect(mapStateToProps, mapDispatchToProps)(ManageSchedule));