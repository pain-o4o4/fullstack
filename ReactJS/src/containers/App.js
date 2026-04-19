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
    userIsAuthenticated,
    userIsPatientOrAdmin
}
    from '../hoc/authentication';
import { path } from '../utils'

import Home from '../routes/Home';
import Login from './Auth/Login';
import Register from './Auth/Register.js';
import System from '../routes/System';
import Admin from '../routes/Admin';
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
import Payment from '../containers/Patient/Doctor/Modal/Payment';
class App extends Component {
    state = {
        bootstrapped: false
    };


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
        } else {
            const unsubscribe = persistor.subscribe(() => {
                let { bootstrapped } = persistor.getState();
                if (bootstrapped) {
                    unsubscribe();
                    if (this.props.onBeforeLift) {
                        Promise.resolve(this.props.onBeforeLift())
                            .then(() => this.setState({ bootstrapped: true }))
                            .catch(() => this.setState({ bootstrapped: true }));
                    } else {
                        this.setState({ bootstrapped: true });
                    }
                }
            });
        }
    };

    componentDidMount() {
        this.handlePersistorState();
    }

    render() {
        let { language } = this.props;
        if (!this.state.bootstrapped) {
            return null;
        }

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
                                    <Route path={path.REGISTER} component={userIsNotAuthenticated(Register)} />
                                    <Route path={path.SYSTEM} component={userIsAdmin(System)} />
                                    <Route path={path.DOCTOR} component={userIsDoctor(Doctor)} />
                                    <Route path={path.ADMIN} component={userIsAdmin(Admin)} />
                                    {/* <Route path={'/patient'} component={userIsPatient(PatientProfile)} /> */}

                                    //submenuforuser
                                    <Route path={path.SETTINGS} component={userIsAuthenticated(PatientSettings)} />
                                    <Route path={path.MY_BOOKING} component={userIsPatientOrAdmin(MyBooking)} />
                                    <Route path={path.BOOKING_HISTORY} component={userIsPatientOrAdmin(BookingHistory)} />

                                    //checkmail
                                    <Route path={path.VERIFY_EMAIL_BOOKING} component={VerifyEmail} />
                                    <Route path={path.PAYMENT} component={userIsPatientOrAdmin(Payment)} />
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