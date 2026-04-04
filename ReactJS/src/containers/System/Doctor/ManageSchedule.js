import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ManageSchedule.scss';
import { LANGUAGES } from '../../../utils/constant';
import Select from 'react-select';
import { fetchAllDoctors } from '../../../store/actions';
import * as action from '../../../store/actions'
import DatePicker from '../../../components/Input/DatePicker';
import moment from 'moment';

class ManageSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listAllDoctors: [],
            selectedOption: {},
            currentDate: '',
            listAllScheduleTime: [],

        };
    }

    componentDidMount() {
        this.props.fetchAllDoctors();
        this.props.fetchAllScheduleTime();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // Check Doctors - Nhớ thêm 'USERS'
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInput(this.props.allDoctors, 'USERS');
            this.setState({
                listAllDoctors: dataSelect
            });
        }

        // Check Schedule Time - Nhớ thêm 'TIME'
        if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
            let dataSelect = this.buildDataInput(this.props.allScheduleTime, 'TIME');
            this.setState({
                listAllScheduleTime: dataSelect
            })
        }

        // Check Language
        if (prevProps.language !== this.props.language) {
            let dataSelectDoctors = this.buildDataInput(this.props.allDoctors, 'USERS');
            let dataSelectTime = this.buildDataInput(this.props.allScheduleTime, 'TIME');
            this.setState({
                listAllDoctors: dataSelectDoctors,
                listAllScheduleTime: dataSelectTime
            })
        }
    }

    buildDataInput = (dataInput, type) => {
        let result = []
        let { language } = this.props;

        if (dataInput && dataInput.length > 0) {
            dataInput.map((item) => {
                let object = {};

                if (type === 'USERS') {
                    // Logic cho Bác sĩ: LastName + FirstName
                    let labelVi = `${item.lastName} ${item.firstName}`;
                    let labelEn = `${item.firstName} ${item.lastName}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.id;
                }

                if (type === 'TIME') {
                    // Logic cho Thời gian: Lấy trực tiếp từ valueVi/valueEn trong JSON của ông
                    object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                    object.value = item.keyMap; // Nên dùng keyMap (T1, T2...) để lưu xuống DB sau này
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
        this.setState({
            currentDate: date[0]
        })
    }
    handleClickBtnTime = (time) => {
        let { listAllScheduleTime } = this.state;
        if (listAllScheduleTime && listAllScheduleTime.length > 0) {
            // Duyệt mảng và tìm thằng vừa được click để đảo trạng thái isSelected
            listAllScheduleTime = listAllScheduleTime.map(item => {
                if (item.id === time.id) {
                    item.isSelected = !item.isSelected; // Click 1: true, Click 2: false
                }
                return item;
            });

            this.setState({
                listAllScheduleTime: listAllScheduleTime
            });
        }
    }

    render() {
        console.log('did update', this.props.allScheduleTime);

        let { language } = this.props;
        let { listAllScheduleTime } = this.state;
        console.log('check state: ', this.state);
        return (
            <div className="manage-schedule-container">
                <div className="m-s-title">
                    <FormattedMessage id='manage-schedule.title' />
                </div>

                <div className="container">
                    <div className='row'>
                        <div className='col-6 form-group'>
                            <label><FormattedMessage id='manage-schedule.choose-doctor' /></label>
                            <Select
                                value={this.state.selectedDoctor}
                                onChange={this.handleChange}
                                options={this.state.listAllDoctors}
                            />
                        </div>
                        <div className='col-6 form-group'>
                            <label><FormattedMessage id='manage-schedule.choose-day' /></label>
                            <DatePicker
                                className='form-control'
                                value={this.state.currentDate}
                                onChange={this.handleChangeDate}
                            />

                        </div>

                        <div className='col-12 pick-hour-container'>

                            {listAllScheduleTime && listAllScheduleTime.length > 0 &&
                                listAllScheduleTime.map((item, index) => {
                                    return (
                                        <button
                                            className={item.isSelected === true ? "btn btn-schedule active" : "btn btn-schedule"}
                                            key={index}
                                            onClick={() => this.handleClickBtnTime(item)} // Phải truyền item vào đây
                                        >
                                            {item.label}
                                        </button>
                                    )
                                })
                            }

                            {/* {
                                this.state.listAllScheduleTime &&
                                this.state.listAllScheduleTime.length > 0 &&
                                this.state.listAllScheduleTime.map((item, index) => {
                                    return (
                                        <button
                                            className={
                                                this.state.currentDate === item.label
                                                    ? 'btn btn-schedule active'
                                                    : 'btn btn-schedule'
                                            }
                                            key={index}
                                            onClick={() => this.handleSaveTime(item)}
                                        >
                                            {language === LANGUAGES.VI
                                                ? item.valueVi
                                                : item.valueEn}
                                        </button>
                                    );
                                })
                            } */}
                        </div>

                        <div className='col-12'>
                            <button className='btn btn-primary btn-save-schedule'>
                                <FormattedMessage id='manage-schedule.save' />
                            </button>
                        </div>
                    </div>
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
        allScheduleTime: state.admin.allScheduleTime
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(action.fetchAllDoctors()),
        fetchAllScheduleTime: () => dispatch(action.fetchAllScheduleTime()),
    };

};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);