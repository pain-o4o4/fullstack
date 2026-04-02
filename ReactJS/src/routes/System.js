import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import UserManage from '../containers/System/UserManage';
import UserRedux from '../containers/System/Admin/UserRedux';
import ManageDoctor from '../containers/System/Admin/ManageDoctor';
// import RegisterPackageGroupOrAcc from '../containers/System/RegisterPackageGroupOrAcc';
import Header from '../containers/Header/Header';
class System extends Component {
    render() {
        // {this.props.isLoggedIn && <Header />}

        const { systemMenuPath, isLoggedIn } = this.props;
        return (
            <React.Fragment>
                {isLoggedIn && <Header />}
                <div className="system-container">
                    <div className="system-list">
                        {/* <Switch>
                            <Route path="/system/crud" component={UserManage} />
                            <Route path="/system/crud-redux" component={UserRedux} />
                            {/* <Route path="/system/register-package-group-or-account" component={RegisterPackageGroupOrAcc} /> */}
                        {/* <Route component={() => { return (<Redirect to={systemMenuPath} />) }} /> */}
                        {/* </Switch> */}
                        <Switch>
                            <Route path="/system/crud" component={UserManage} />
                            <Route path="/system/crud-redux" component={UserRedux} />
                            <Route path="/system/manage-doctor" component={ManageDoctor} />

                            {/* Thêm dòng này để xử lý khi chỉ vào /system */}
                            <Route exact path="/system" render={() => <Redirect to="/system/crud-redux" />} />

                            {/* Sửa lại dòng Redirect mặc định cuối cùng cho an toàn */}
                            <Redirect from="/system" to="/system/crud-redux" />
                        </Switch>
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

export default connect(mapStateToProps, mapDispatchToProps)(System);
