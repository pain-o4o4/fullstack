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
            }
        }
    }
    handleChangeSelect = async (e) => {
        if (this.props.params && this.props.params.id) {
            let doctorId = this.props.params.id;
            let date = e.target.value;
            let res = await getScheduleByDate(doctorId, date);
            // if (res && res.errCode === 0) {
            //     this.setState({
            //         allAvalabelTime: res.data ? res.data : []
            //     })
            // }
            this.setState({
                allAvalabelTime: res.data
            })
            console.log('check  getScheduleByDate(doctorId, date);', doctorId, "date", date, "res get form api", res);
        }
    }
    handleClickSheduleTime = (time) => {
        this.setState({
            isTheModalOpen: true,
            dataTimeModal: time
        })
    }
    closeModal = () => {
        this.setState({
            isTheModalOpen: false
        })
    }
    render() {
        let { allDay, allAvalabelTime, isTheModalOpen, dataTimeModal } = this.state
        let { language } = this.props
        // console.log('check state', this.state.allAvalabelTime);
        let doctorId = this.props.params ? this.props.params.id : '';
        console.log('check doctorId', this.state);
        return (
            <React.Fragment>
                {/* <HomeHeader isShowBanner={false} /> */}
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
                    <div className='all-schedule-time'></div>
                    <div className='text-calendar'>
                        <span>
                            <img src={calendar_icon} alt="calendar" />
                            <FormattedMessage id="schedule-doctor.calendar" />
                        </span>

                    </div>
                    <div className="time-content">
                        {allAvalabelTime && allAvalabelTime.length > 0 ?
                            <>
                                {allAvalabelTime.map((item, index) => {
                                    return (
                                        <button
                                            key={index}
                                            className="time-content-btn"
                                            onClick={() => {
                                                console.log("Dữ liệu item khi click:", item);
                                                this.handleClickSheduleTime(item);
                                            }}
                                        >
                                            <div className="btn-time">
                                                {language === 'vi'
                                                    ? item.timeTypeData.valueVi
                                                    : item.timeTypeData.valueEn
                                                }
                                            </div>
                                            {item.clinicData && (
                                                <div className="btn-location">
                                                    <i className="fas fa-map-marker-alt"></i> {item.clinicData.name}
                                                </div>
                                            )}
                                        </button>
                                    )
                                })}
                            </>
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
