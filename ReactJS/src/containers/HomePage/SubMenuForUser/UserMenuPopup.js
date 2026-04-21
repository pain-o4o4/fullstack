import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import * as actions from "../../../store/actions";
import './UserMenuPopup.scss';

class UserMenuPopup extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }


    async componentDidMount() {

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {

    }
    handleViewList = (page) => {
        this.props.handleViewList(page)
    }
    render() {
        const { isLoggedIn, userInfo, handleViewList, processLogout } = this.props;

        return (
            <div className="popup-menu">
                {isLoggedIn ? (
                    <React.Fragment>
                        <div className="menu-header">
                            <div className="user-name">{userInfo?.firstName} {userInfo?.lastName}</div>
                            <div className="user-email">{userInfo?.email}</div>
                        </div>
                        <div className="menu-body">
                            <div className="menu-item" onClick={() => handleViewList('SETTINGS')}>
                                <i className="fas fa-user-edit"></i>
                                <span>Chỉnh sửa thông tin</span>
                            </div>
                            {userInfo && userInfo.roleId !== 'R2' &&
                                <div className="menu-item" onClick={() => handleViewList('MY_BOOKING')}>
                                    <i className="fas fa-calendar-check"></i>
                                    <span>Theo dõi trạng thái lịch khám</span>
                                </div>}
                            {userInfo && userInfo.roleId !== 'R2' &&
                                <div className="menu-item" onClick={() => handleViewList('BOOKING_HISTORY')}>
                                    <i className="fas fa-history"></i>
                                    <span>Lịch sử đặt lịch</span>
                                </div>}

                            <div className="divider"></div>

                            <div className="menu-item logout" onClick={processLogout}>
                                <i className="fas fa-sign-out-alt"></i>
                                <span>Đăng xuất</span>
                            </div>
                        </div>
                    </React.Fragment>
                ) : (
                    <div className="menu-body">
                        <div className="menu-item" onClick={() => handleViewList('LOGIN')}>
                            <i className="fas fa-sign-in-alt"></i>
                            <span>Đăng nhập (Log In)</span>
                        </div>
                        <div className="menu-item" onClick={() => handleViewList('REGISTER')}>
                            <i className="fas fa-user-plus"></i>
                            <span>Đăng ký (Sign Up)</span>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserMenuPopup);