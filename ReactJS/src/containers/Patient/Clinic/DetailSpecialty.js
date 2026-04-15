import React, { Component } from 'react';
import { connect } from "react-redux";
import { getDetailClinic } from '../../../services/userService'
import { LANGUAGES } from '../../../utils/constant'
import { withRouter } from 'react-router'; // hoặc 'react-router-dom'
import { FormattedMessage } from 'react-intl';
import './DetailClinic.scss'
import HomeHeader from '../../HomePage/HomeHeader';

class DetailClinic extends Component {
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
            <React.Fragment>
                <HomeHeader />
                <div className="section-detail-specialty">


                    99999999999</div>
            </React.Fragment>


        )
    }
}

const mapStateToProps = state => {
    return {
        // language: state.app.language,
        // // DetailClinic: state.admin.DetailClinic

    };
};

const mapDispatchToProps = dispatch => {
    return {

        // getDetailClinic: (id) => dispatch(action.getDetailClinic(id))
    };
};

// import { withRouter } from 'react-router'; // hoặc 'react-router-dom'
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DetailClinic));
