import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { USER_ROLE } from '../utils'; // Import cái bảng role của ông vào

class Home extends Component {
    render() {
        const { isLoggedIn, userInfo } = this.props;
        let linkToRedirect = '/home';

        if (isLoggedIn && userInfo) {
            let role = userInfo.roleId;
            if (role === USER_ROLE.ADMIN) {
                linkToRedirect = '/system/user-manage';
            } else if (role === USER_ROLE.DOCTOR) {
                linkToRedirect = '/doctor/manage-schedule';
            } else {
                linkToRedirect = '/home';
            }
        }

        return (
            <Navigate to={linkToRedirect} replace />
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo // Lấy thêm userInfo để check role
    };
};

export default connect(mapStateToProps, null)(Home);