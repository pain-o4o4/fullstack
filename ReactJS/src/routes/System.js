import React, { Component } from 'react';
import { connect } from "react-redux";
import { Routes, Route, Navigate } from 'react-router-dom';

import UserManage from '../containers/System/UserManage';
import ManageDoctor from '../containers/System/Admin/ManageDoctor';
import SystemLayout from '../containers/System/SystemLayout';
import ManageSpecialty from '../containers/System/Specialty/ManageSpecialty';
import ManageClinic from '../containers/System/Clinic/ManageClinic';
import ManageSchedule from '../containers/System/Doctor/ManageSchedule';

class System extends Component {

    render() {
        const { isLoggedIn } = this.props;

        return (
            <React.Fragment>
                {isLoggedIn ? (
                    <SystemLayout>
                        <Routes>
                            <Route path="user-manage" element={<UserManage />} />
                            <Route path="manage-doctor" element={<ManageDoctor />} />
                            <Route path="manage-specialty" element={<ManageSpecialty />} />
                            <Route path="manage-clinic" element={<ManageClinic />} />
                            <Route path="manage-schedule" element={<ManageSchedule />} />
                            <Route path="*" element={<Navigate to="user-manage" replace />} />
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
        isLoggedIn: state.user.isLoggedIn,
    };
};

export default connect(mapStateToProps)(System);