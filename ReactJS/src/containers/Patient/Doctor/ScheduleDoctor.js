import React, { Component } from 'react';
import { connect } from "react-redux";
import { getScheduleByDate } from '../../../services/userService'
import { LANGUAGES } from '../../../utils/constant'
import './ScheduleDoctor.scss'
import moment from 'moment'
import { withRouter } from '../../../components/Navigator';
import 'moment/locale/vi';
import calendar_icon from '../../../assets/images/calendar_icon.svg'
import { FormattedMessage } from 'react-intl';
import BookingModal from './Modal/BookingModal';
import _ from 'lodash';

class ScheduleDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ScheduleDoctor: {},
            allDay: [],
            allTime: [],
            allAvalabelTime: [],
            isTheModalOpen: false,

            dataTimeModal: {}
        }
    }
    // 1. Tạo một hàm riêng để build mảng ngày
    getArrDays = (language) => {
        let allDays = [];
        for (let i = 0; i < 7; i++) {
            let object = {};
            if (i === 0) {
                // Nếu là ngày hiện tại, hiển thị "Hôm nay" thay vì "Thứ ..."
                let ddMM = moment(new Date()).format('DD/MM');
                let todayVi = `Hôm nay - ${ddMM}`;
                let todayEn = `Today - ${ddMM}`;
                object.label = language === LANGUAGES.VI ? todayVi : todayEn;
            } else {
                let label = moment(new Date()).add(i, 'days').locale(language).format('ddd - DD/MM');
                object.label = label.charAt(0).toUpperCase() + label.slice(1);
            }

            object.value = moment(new Date()).add(i, 'days').startOf('day').valueOf();
            allDays.push(object);
        }
        return allDays;
    }

    async componentDidMount() {
        let { language } = this.props;
        let allDay = this.getArrDays(language);
        this.setState({
            allDay: allDay
        });
        if (this.props.params && this.props.params.id) {
            let doctorId = this.props.params.id;
            let today = allDay[0].value;

            let res = await getScheduleByDate(doctorId, today);
            if (res && res.errCode === 0) {
                this.setState({
                    allAvalabelTime: res.data ? res.data : []
                });
                // Mặc định chọn clinic đầu tiên nếu có dữ liệu
                if (res.data && res.data.length > 0 && res.data[0].clinicData) {
                    this.props.handleClinicSelection(res.data[0].clinicData);
                }
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
            let allDay = this.getArrDays(this.props.language);
            this.setState({
                allDay: allDay
            });
        }
        if (this.props.params && prevProps.params && this.props.params.id !== prevProps.params.id) {
            let doctorId = this.props.params.id;
            let today = this.state.allDay[0].value;
            let res = await getScheduleByDate(doctorId, today);
            if (res && res.errCode === 0) {
                this.setState({
                    allAvalabelTime: res.data ? res.data : []
                });
                if (res.data && res.data.length > 0 && res.data[0].clinicData) {
                    this.props.handleClinicSelection(res.data[0].clinicData);
                }
            }
        }
    }
    handleChangeSelect = async (e) => {
        if (this.props.params && this.props.params.id) {
            let doctorId = this.props.params.id;
            let date = e.target.value;
            let res = await getScheduleByDate(doctorId, date);

            this.setState({
                allAvalabelTime: res.data
            })
            if (res.data && res.data.length > 0 && res.data[0].clinicData) {
                this.props.handleClinicSelection(res.data[0].clinicData);
            }
            console.log('check  getScheduleByDate(doctorId, date);', doctorId, "date", date, "res get form api", res);
        }
    }
    handleClickSheduleTime = (time) => {
        this.setState({
            isTheModalOpen: true,
            dataTimeModal: time
        })
        if (time.clinicData) {
            this.props.handleClinicSelection(time.clinicData);
        }
    }
    closeModal = () => {
        this.setState({
            isTheModalOpen: false
        })
    }
    render() {
        let { allDay, allAvalabelTime, isTheModalOpen, dataTimeModal } = this.state
        let { language } = this.props
        let doctorId = this.props.params ? this.props.params.id : '';

        // Nhóm lịch theo clinicId
        let groupedTime = _.groupBy(allAvalabelTime, (item) => item.clinicData ? item.clinicData.id : 'unknown');

        return (
            <React.Fragment>
                <div className="schedule-doctor-container">
                    <div className='all-schedule'>
                        <select
                            onChange={(e) => this.handleChangeSelect(e)}
                        >
                            {allDay && allDay.length > 0 &&
                                allDay.map((item, index) => {
                                    return (
                                        <option
                                            key={index}
                                            value={item.value}>
                                            {item.label}
                                        </option>
                                    )
                                })}
                        </select>
                    </div>
                    <div className='text-calendar'>
                        <span>
                            <img src={calendar_icon} alt="calendar" />
                            <FormattedMessage id="schedule-doctor.calendar" />
                        </span>
                    </div>
                    <div className="time-content">
                        {allAvalabelTime && allAvalabelTime.length > 0 ?
                            Object.keys(groupedTime).map((clinicId, clinicIndex) => {
                                let clinicData = groupedTime[clinicId][0].clinicData;
                                return (
                                    <div key={clinicId} className="clinic-group">
                                        {clinicData && (
                                            <div className="clinic-name-header">
                                                <i className="fas fa-hospital"></i> {clinicData.name}
                                            </div>
                                        )}
                                        <div className="time-grid">
                                            {groupedTime[clinicId]
                                                .filter(item => item.isFull !== true) // CHỈ HIỆN NHỮNG SLOT CHƯA ĐẦY
                                                .map((item, index) => {
                                                    return (
                                                        <button
                                                        key={index}
                                                        className="time-slot-btn"
                                                        onMouseEnter={() => {
                                                            if (item.clinicData) this.props.handleClinicSelection(item.clinicData);
                                                        }}
                                                        onClick={() => {
                                                            this.handleClickSheduleTime(item);
                                                        }}
                                                    >
                                                        <span className="time-label">
                                                            {language === 'vi'
                                                                ? item.timeTypeData.valueVi
                                                                : item.timeTypeData.valueEn
                                                            }
                                                        </span>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })
                            :
                            <div className="no-schedule">
                                <FormattedMessage id="patient.detail-doctor.no-schedule" />
                            </div>
                        }
                    </div>
                </div>
                <>

                    <BookingModal
                        isTheModalOpen={isTheModalOpen}
                        closeModal={this.closeModal}
                        dataTimeModal={dataTimeModal}
                        doctorId={doctorId}
                    />
                </>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo


    };
};

const mapDispatchToProps = dispatch => {
    return {

        // getScheduleDoctor: (id) => dispatch(action.getScheduleDoctor(id))
    };
};

// import { withRouter } from 'react-router'; // hoặc 'react-router-dom'
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ScheduleDoctor));
