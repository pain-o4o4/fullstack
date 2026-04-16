import React, { Component } from 'react';
import { connect } from "react-redux";
import { getMyBookingById } from '../../../services/userService'
import HomeHeader from '../../HomePage/HomeHeader'
import { withRouter } from 'react-router'; // hoặc 'react-router-dom'
import { FormattedMessage } from 'react-intl';
import './MyBooking.scss'
class MyBooking extends Component {
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
        // // MyBooking: state.admin.MyBooking

    };
};

const mapDispatchToProps = dispatch => {
    return {

        // getMyBooking: (id) => dispatch(action.getMyBooking(id))
    };
};

// import { withRouter } from 'react-router'; // hoặc 'react-router-dom'
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MyBooking));
