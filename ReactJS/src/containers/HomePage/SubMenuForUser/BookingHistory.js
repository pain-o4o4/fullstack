import React, { Component } from 'react';
import { connect } from "react-redux";
import { getBookingHistoryById } from '../../../services/userService'
import HomeHeader from '../../HomePage/HomeHeader'
import { withRouter } from 'react-router'; // hoặc 'react-router-dom'
import { FormattedMessage } from 'react-intl';
import './BookingHistory.scss'
class BookingHistory extends Component {
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
        // // BookingHistory: state.admin.BookingHistory

    };
};

const mapDispatchToProps = dispatch => {
    return {

        // getBookingHistory: (id) => dispatch(action.getBookingHistory(id))
    };
};

// import { withRouter } from 'react-router'; // hoặc 'react-router-dom'
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BookingHistory));
