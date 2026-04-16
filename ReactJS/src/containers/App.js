import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'connected-react-router';
import { history } from '../redux'
import { ToastContainer } from 'react-toastify';
import { IntlProvider } from 'react-intl';
import { language } from '../utils'

import {
    userIsAdmin, userIsDoctor,
    userIsNotAuthenticated,
    userIsAuthenticated
}
    from '../hoc/authentication';
import { path } from '../utils'

import Home from '../routes/Home';
import Login from './Auth/Login';
// import Header from './Header/Header';
import System from '../routes/System';
import HomePage from './HomePage/HomePage.js'
import Doctor from '../routes/Doctor'
import { CustomToastCloseButton } from '../components/CustomToast';
import ConfirmModal from '../components/ConfirmModal';
import CustomScrollbars from '../components/CustomScrollbars';
import VerifyEmail from '../containers/Patient/VerifyEmail.js';

import DetailDoctor from './Patient/Doctor/DetailDoctor.js';
import DetailSpecialty from './Patient/Specialty/DetailSpecialty.js';
import DetailClinic from './Patient/Clinic/DetailClinic.js';

import AllSpecialty from '../containers/Navigation/AllSpecialty.js';
import AllClinic from '../containers/Navigation/AllClinics.js';
import AllDoctor from '../containers/Navigation/AllDoctor.js';

import PatientSettings from './HomePage/SubMenuForUser/PatientSettings';
import MyBooking from './HomePage/SubMenuForUser/MyBooking';
import BookingHistory from './HomePage/SubMenuForUser/BookingHistory';
class App extends Component {

    handlePersistorState = () => {
        const { persistor } = this.props;
        let { bootstrapped } = persistor.getState();
        if (bootstrapped) {
            if (this.props.onBeforeLift) {
                Promise.resolve(this.props.onBeforeLift())
                    .then(() => this.setState({ bootstrapped: true }))
                    .catch(() => this.setState({ bootstrapped: true }));
            } else {
                this.setState({ bootstrapped: true });
            }
        }
    };

    componentDidMount() {
        this.handlePersistorState();
    }

    render() {
        let { language } = this.props;
        return (
            <Fragment>

                <Router history={history}>
                    <div className="main-container">
                        <ConfirmModal />
                        {/* {this.props.isLoggedIn && <Header />} */}
                        <div className="content-container">
                            <CustomScrollbars style={{ height: '100vh', width: '100%' }}>
                                <Switch>
                                    <Route path={path.HOME} exact component={(Home)} />

                                    {/* //check roleId */}
                                    <Route path={path.LOGIN} component={userIsNotAuthenticated(Login)} />
                                    <Route path={path.SYSTEM} component={userIsAdmin(System)} />
                                    <Route path={'/doctor'} component={userIsDoctor(Doctor)} />
                                    {/* <Route path={'/patient'} component={userIsPatient(PatientProfile)} /> */}


                                    //submenudoruser
                                    <Route path={path.SETTINGS} component={userIsAuthenticated(PatientSettings)} />
                                    <Route path={path.MY_BOOKING} component={userIsAuthenticated(MyBooking)} />
                                    <Route path={path.BOOKING_HISTORY} component={userIsAuthenticated(BookingHistory)} />

                                    //checkmail
                                    <Route path={path.VERIFY_EMAIL_BOOKING} component={VerifyEmail} />

                                    //user
                                    <Route path={path.HOMEPAGE} component={HomePage} />
                                    <Route path={path.DETAIL_DOCTOR} component={DetailDoctor} />
                                    <Route path={path.DETAIL_SPECIALTY} component={DetailSpecialty} />
                                    <Route path={path.DETAIL_CLINIC} component={DetailClinic} />

                                    <Route path={path.ALL_SPECIALTY} component={AllSpecialty} />
                                    <Route path={path.ALL_CLINIC} component={AllClinic} />
                                    <Route path={path.ALL_DOCTOR} component={AllDoctor} />


                                </Switch>
                            </CustomScrollbars>
                        </div>
                        <ToastContainer
                            position='bottom-right'
                            aotuClose={1000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                        />
                    </div>
                </Router>
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        started: state.app.started,
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);