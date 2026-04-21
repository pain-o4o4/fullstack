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

class ManageSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listAllDoctors: [],
            selectedOption: null,
            currentDate: '',
            listAllScheduleTime: [],
            resultBulk: []
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

            // Re-translate pre-fixed selected option for Doctor role
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

        // Whenever doctor OR date changes, fetch existing schedules!
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
                let existingSchedules = res.data; // Array of objects
                let { listAllScheduleTime } = this.state;

                if (listAllScheduleTime && listAllScheduleTime.length > 0) {
                    let updatedScheduleTime = listAllScheduleTime.map(item => {
                        let isBooked = existingSchedules.some(ex => ex.timeType === item.value);
                        return { ...item, isSelected: isBooked };
                    });

                    this.setState({
                        listAllScheduleTime: updatedScheduleTime
                    });
                }
            } else {
                toast.error("Không thể tải lịch trình bác sĩ!");
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
        let result = [];
        if (!currentDate) {
            toast.error('Vui lòng chọn ngày khám!');
            return;
        }

        let formartedDate = new Date(currentDate).getTime();

        if (!selectedOption || _.isEmpty(selectedOption)) {
            toast.error('Vui lòng chọn Bác sĩ!');
            return;
        }

        if (listAllScheduleTime && listAllScheduleTime.length > 0) {
            let schedule = listAllScheduleTime.filter(item => item.isSelected === true);
            if (schedule && schedule.length >= 0) {
                // Allows emptying schedules.
                schedule.forEach(item => {
                    let object = {};
                    object.doctorId = selectedOption.value;
                    object.date = formartedDate;
                    object.timeType = item.value;
                    result.push(object);
                });
            }
        }

        let res = await bulkCreateScheduleService({
            arrSchedule: result,
            doctorId: selectedOption.value,
            date: formartedDate
        });

        if (res && res.errCode === 0) {
            toast.success("Lưu thông tin lịch khám thành công!");
            this.setState({ resultBulk: result });
            await this.fetchExistingSchedules();
        } else {
            toast.error("Lưu thông tin lịch khám thất bại!");
        }
    }

    render() {
        let { language, userInfo } = this.props;
        let { listAllScheduleTime } = this.state;
        let isDoctorRole = userInfo && userInfo.roleId === 'R2';

        return (
            <div className="manage-schedule-container">
                <div className="header-section">
                    <h2 className="title">
                        <FormattedMessage id='manage-schedule.title' defaultMessage="Quản Lý Lịch Khám Bệnh" />
                    </h2>
                </div>

                <div className="settings-grid">
                    {/* Card 1: Planning Details */}
                    <div className="info-card">
                        <div className="card-header">
                            <span className="card-title">
                                <FormattedMessage id="manage-schedule.planning" defaultMessage="Thông Tin Lên Lịch" />
                            </span>
                            <i className="fas fa-calendar-alt card-icon"></i>
                        </div>
                        <div className="card-body">
                            <div className="input-group-apple">
                                <label><FormattedMessage id='manage-schedule.choose-doctor' defaultMessage="Chọn Bác Sĩ" /></label>
                                <Select
                                    value={this.state.selectedOption}
                                    onChange={this.handleChange}
                                    options={this.state.listAllDoctors}
                                    isDisabled={isDoctorRole}
                                    classNamePrefix="react-select"
                                    placeholder={language === LANGUAGES.VI ? 'Tìm kiếm bác sĩ...' : 'Search doctor...'}
                                />
                            </div>
                            <div className="input-group-apple">
                                <label><FormattedMessage id='manage-schedule.choose-day' defaultMessage="Chọn Ngày Khám" /></label>
                                <DatePicker
                                    className="date-picker"
                                    value={this.state.currentDate}
                                    onChange={this.handleChangeDate}
                                    minDate={new Date()}
                                    placeholder={language === LANGUAGES.VI ? 'Chọn ngày...' : 'Select date...'}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="time-selection-section">
                    <div className="card-header">
                        <span className="card-title">
                            <FormattedMessage id="manage-schedule.available-hours" defaultMessage="Các Khung Giờ Có Sẵn" />
                        </span>
                        <i className="fas fa-clock card-icon"></i>
                    </div>
                    <div className="pick-hour-container">
                        {listAllScheduleTime && listAllScheduleTime.length > 0 ? (
                            listAllScheduleTime.map((item, index) => {
                                return (
                                    <button
                                        key={index}
                                        className={`pill-btn ${item.isSelected ? 'active' : ''}`}
                                        onClick={() => this.handleClickBtnTime(item)}
                                    >
                                        {item.label}
                                    </button>
                                )
                            })
                        ) : (
                            <div style={{ color: '#86868b' }}>
                                <FormattedMessage id="manage-schedule.no-time" defaultMessage="Vui lòng chọn bác sĩ để xem khung giờ" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="action-footer">
                    <button className="btn-save-apple" onClick={() => this.handleSaveSchedule()}>
                        <i className="fas fa-save"></i>
                        <FormattedMessage id='manage-schedule.save' defaultMessage="Lưu Lịch Khám" />
                    </button>
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        allScheduleTime: state.admin.allScheduleTime,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(action.fetchAllDoctors()),
        fetchAllScheduleTime: () => dispatch(action.fetchAllScheduleTime()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);