import React, { Component } from 'react';
import { connect } from "react-redux";
import { getDefaultClassById } from '../../../services/userService'
import { LANGUAGES } from '../../../utils/constant'
import { withRouter } from 'react-router'; // hoặc 'react-router-dom'
import { FormattedMessage } from 'react-intl';
import './DefaultClass.scss'
class DefaultClass extends Component {
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
            <div className="section-share section-default-class">

            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        // language: state.app.language,
        // // DefaultClass: state.admin.DefaultClass

    };
};

const mapDispatchToProps = dispatch => {
    return {

        // getDefaultClass: (id) => dispatch(action.getDefaultClass(id))
    };
};

// import { withRouter } from 'react-router'; // hoặc 'react-router-dom'
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DefaultClass));
