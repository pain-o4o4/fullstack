import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ManageBooking.scss';
import { LANGUAGES, dateFormat } from '../../../utils/constant';
import Select from 'react-select';
import { fetchAllDoctors } from '../../../store/actions';
import * as action from '../../../store/actions'
import DatePicker from '../../../components/Input/DatePicker';
import moment from 'moment';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { bulkCreateScheduleService } from '../../../services/userService'
class ManageBooking extends Component {
    constructor(props) {
        super(props);
        this.state = {


        };
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }



    render() {

        return (
            <div className="manage-booking-container">

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

export default connect(mapStateToProps, mapDispatchToProps)(ManageBooking);