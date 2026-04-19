import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from '../components/Navigator';
import { toast } from "react-toastify";
import { first } from 'lodash';
import SystemLayout from '../containers/System/SystemLayout';
class AdminSettings extends Component {
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
                <SystemLayout>
                    <div className="system-container" style={{ padding: '20px' }}>
                        <div className="system-list">
                            <h1>TRANG QUẢN TRỊ ADMIN</h1>
                            <p>Chào mừng ông đã vào được đây!</p>
                        </div>
                    </div>
                </SystemLayout>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        userInfo: state.user.userInfo,

    };
};

const mapDispatchToProps = dispatch => {
    return {

        // updateUserSuccess: (userInfo) => dispatch(action.updateUserSuccess(userInfo))
    };
};

// import { withRouter } from 'react-router'; // hoặc 'react-router-dom'
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AdminSettings));
