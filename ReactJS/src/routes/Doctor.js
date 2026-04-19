import React, { Component } from 'react';
import { connect } from "react-redux";
import { Routes, Route, Navigate } from 'react-router-dom';
import UserManage from '../containers/System/UserManage';
import UserRedux from '../containers/System/Admin/UserRedux';
import ManageSchedule from '../containers/System/Doctor/ManageSchedule';
import ManageDoctor from '../containers/System/Admin/ManageDoctor';
import Header from '../containers/Header/Header';
class Doctor extends Component {
    render() {
        // {this.props.isLoggedIn && <Header />}

        const { SystemMenuPath, isLoggedIn } = this.props;
        return (
            <React.Fragment>
                {isLoggedIn && <Header />}
                <div className="System-container">
                    <div className="System-list">

                        <Routes>
                            <Route path="manage-schedule" element={<ManageSchedule />} />
                            <Route path="manage-doctor" element={<ManageDoctor />} />
                            <Route path="*" element={<Navigate to="manage-schedule" replace />} />
                        </Routes>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn

    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Doctor);
