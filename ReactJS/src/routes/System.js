import React, { Component } from 'react';
import { connect } from "react-redux";
import { Routes, Route, Navigate } from 'react-router-dom';
import { UserIsAdmin, UserIsPatientOrAdmin } from '../hoc/authentication';

import UserManage from '../containers/System/UserManage';
import ManageDoctor from '../containers/System/Admin/ManageDoctor';
import SystemLayout from '../containers/System/SystemLayout';
import ManageSpecialty from '../containers/System/Specialty/ManageSpecialty';
import ManageClinic from '../containers/System/Clinic/ManageClinic';
import ManageSchedule from '../containers/System/Doctor/ManageSchedule';
import PatientProfile from '../containers/System/Patient/PatientProfile';

class System extends Component {

    render() {
        const { isLoggedIn } = this.props;

        return (
            <React.Fragment>
                {isLoggedIn ? (
                    <SystemLayout>
                        <Routes>
                            <Route path="user-manage" element={<UserIsAdmin><UserManage /></UserIsAdmin>} />
                            <Route path="manage-doctor" element={<UserIsAdmin><ManageDoctor /></UserIsAdmin>} />
                            <Route path="manage-specialty" element={<UserIsAdmin><ManageSpecialty /></UserIsAdmin>} />
                            <Route path="manage-clinic" element={<UserIsAdmin><ManageClinic /></UserIsAdmin>} />
                            <Route path="manage-schedule" element={<UserIsAdmin><ManageSchedule /></UserIsAdmin>} />
                            <Route path="patient-profile" element={<UserIsPatientOrAdmin><PatientProfile /></UserIsPatientOrAdmin>} />
                            <Route path="*" element={<Navigate to="patient-profile" replace />} />
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