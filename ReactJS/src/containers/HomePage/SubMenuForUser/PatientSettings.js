import React, { Component } from 'react';
import { connect } from "react-redux";
import { getPatientSettingsById } from '../../../services/userService'
import HomeHeader from '../../HomePage/HomeHeader'
import { withRouter } from 'react-router'; // hoặc 'react-router-dom'
import { FormattedMessage } from 'react-intl';
import './PatientSettings.scss'
class PatientSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }


    async componentDidMount() {

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {

    }


    render() {
        return (
            <div className="my-booking">
                <HomeHeader />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        // language: state.app.language,
        // // PatientSettings: state.admin.PatientSettings

    };
};

const mapDispatchToProps = dispatch => {
    return {

        // getPatientSettings: (id) => dispatch(action.getPatientSettings(id))
    };
};

// import { withRouter } from 'react-router'; // hoặc 'react-router-dom'
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PatientSettings));
