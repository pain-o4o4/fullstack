import React, { Component } from 'react';
import { connect } from "react-redux";
import { Routes, Route, Navigate } from 'react-router-dom';
import ManageSchedule from '../containers/System/Doctor/ManageSchedule';
import ManageDoctor from '../containers/System/Admin/ManageDoctor';
import ManagePatient from '../containers/System/Doctor/ManagePatient';
import SystemLayout from '../containers/System/SystemLayout';
class Doctor extends Component {
    render() {
        // {this.props.isLoggedIn && <Header />}

        const { SystemMenuPath, isLoggedIn } = this.props;
        return (
            <React.Fragment>
                {isLoggedIn ? (
                    <SystemLayout>
                        <Routes>
                            <Route path="manage-schedule" element={<ManageSchedule />} />
                            <Route path="manage-doctor" element={<ManageDoctor />} />
                            <Route path="manage-booking" element={<ManagePatient />} />
                            <Route path="*" element={<Navigate to="manage-schedule" replace />} />
                        </Routes>
                    </SystemLayout>
                ) : (
                    <Navigate to="/login" replace />
                )}
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
