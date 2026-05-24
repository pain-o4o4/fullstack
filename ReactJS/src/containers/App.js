import React, { Component, Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { IntlProvider } from 'react-intl';

import {
    UserIsAdmin, UserIsDoctor,
    UserIsNotAuthenticated,
    UserIsAuthenticated,
    UserIsPatientOrAdmin
}
    from '../hoc/authentication';
import { path } from '../utils'

import Home from '../routes/Home';
import Login from './Auth/Login';
import Register from './Auth/Register.js';
import RegisterVerify from './Auth/RegisterVerify.js';
import ResetPassword from './Auth/ResetPassword.js';
import System from '../routes/System';
import HomePage from './HomePage/HomePage.js'
import Doctor from '../routes/Doctor'
import { CustomToastCloseButton } from '../components/CustomToast';
import ConfirmModal from '../components/ConfirmModal';
import CustomScrollbars from '../components/CustomScrollbars';
import VerifyEmail from '../containers/Patient/VerifyEmail.js';
import ResilienceBanner from './App/ResilienceBanner';

import DetailDoctor from './Patient/Doctor/DetailDoctor.js';
import DetailSpecialty from './Patient/Specialty/DetailSpecialty.js';
import DetailClinic from './Patient/Clinic/DetailClinic.js';
import DetailHandbook from './Patient/Handbook/DetailHandbook.js';

import AllSpecialty from '../containers/Navigation/AllSpecialty.js';
import AllClinic from '../containers/Navigation/AllClinics.js';
import AllDoctor from '../containers/Navigation/AllDoctor.js';
import AllHandbook from '../containers/Navigation/AllHandbook.js';
import ProcessBooking from '../containers/Navigation/ProcessBooking.js';
import SelectService from '../containers/Navigation/SelectService.js';

import MyBooking from './HomePage/SubMenuForUser/MyBooking';
import BookingHistory from './HomePage/SubMenuForUser/BookingHistory';
import DetailSchedulePatient from './HomePage/SubMenuForUser/DetailSchedulePatient';
import Payment from '../containers/Patient/Doctor/Modal/Payment';
import AISupportPage from './HomePage/AISupportPage';
// import ChatBot from './ChatBot/ChatBot';
import PrivacyPolicy from './HomePage/Legal/PrivacyPolicy';
import TermsOfUse from './HomePage/Legal/TermsOfUse';

const ScrollToTop = ({ scrollbarRef }) => {
    const { pathname } = useLocation();

    useEffect(() => {
        if (scrollbarRef && scrollbarRef.current) {
            const rawScrollbars = scrollbarRef.current.ref?.current;
            if (rawScrollbars && typeof rawScrollbars.scrollTop === 'function') {
                rawScrollbars.scrollTop(0);
            } else if (typeof scrollbarRef.current.scrollTo === 'function') {
                scrollbarRef.current.scrollTo(0);
            }
        }
        window.scrollTo(0, 0);
    }, [pathname, scrollbarRef]);

    return null;
};

class App extends Component {
    customScrollbarsRef = React.createRef();

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
        let { language, isLoggedIn } = this.props;
        if (!this.state.bootstrapped) {
            return null;
        }

        return (
            <Fragment>

                <BrowserRouter>
                    <ScrollToTop scrollbarRef={this.customScrollbarsRef} />
                    <div className="main-container">
                        <ResilienceBanner />
                        <ConfirmModal />
                        <div className="content-container">
                            <CustomScrollbars ref={this.customScrollbarsRef} style={{ height: '100vh', width: '100%' }}>
                                <Routes>
                                    <Route path={path.HOME} element={<Home />} />

                                    {/* //check roleId */}
                                    <Route path={path.LOGIN} element={<UserIsNotAuthenticated><Login /></UserIsNotAuthenticated>} />
                                    <Route path={path.REGISTER} element={<UserIsNotAuthenticated><Register /></UserIsNotAuthenticated>} />
                                    <Route path={path.REGISTER_VERIFY_OTP} element={<UserIsNotAuthenticated><RegisterVerify /></UserIsNotAuthenticated>} />
                                    <Route path={path.RESET_PASSWORD} element={<UserIsNotAuthenticated><ResetPassword /></UserIsNotAuthenticated>} />
                                    <Route path={path.SYSTEM + '/*'} element={<UserIsAuthenticated><System /></UserIsAuthenticated>} />
                                    <Route path={path.DOCTOR + '/*'} element={<UserIsDoctor><Doctor /></UserIsDoctor>} />

                                    {/* submenuforuser */}
                                    {/* <Route path={path.SETTINGS} element={<UserIsAuthenticated><PatientSettings /></UserIsAuthenticated>} /> */}
                                    <Route path={path.MY_BOOKING} element={<UserIsPatientOrAdmin><MyBooking /></UserIsPatientOrAdmin>} />
                                    <Route path={path.DETAIL_SCHEDULE_PATIENT} element={<UserIsPatientOrAdmin><DetailSchedulePatient /></UserIsPatientOrAdmin>} />
                                    <Route path={path.BOOKING_HISTORY} element={<UserIsPatientOrAdmin><BookingHistory /></UserIsPatientOrAdmin>} />

                                    {/* checkmail */}
                                    <Route path={path.VERIFY_EMAIL_BOOKING} element={<VerifyEmail />} />
                                    <Route path={path.PAYMENT} element={<UserIsPatientOrAdmin><Payment /></UserIsPatientOrAdmin>} />

                                    {/* user */}
                                    <Route path={path.HOMEPAGE} element={<HomePage />} />
                                    <Route path={path.DETAIL_DOCTOR} element={<DetailDoctor />} />
                                    <Route path={path.DETAIL_SPECIALTY} element={<DetailSpecialty />} />
                                    <Route path={path.DETAIL_CLINIC} element={<DetailClinic />} />
                                    <Route path={path.DETAIL_HANDBOOK} element={<DetailHandbook />} />

                                    <Route path={path.ALL_SPECIALTY} element={<AllSpecialty />} />
                                    <Route path={path.ALL_CLINIC} element={<AllClinic />} />
                                    <Route path={path.ALL_DOCTOR} element={<AllDoctor />} />
                                    <Route path={path.ALL_HANDBOOK} element={<AllHandbook />} />
                                    <Route path={path.SELECT_SERVICE} element={<SelectService />} />
                                    <Route path={path.PROCESS_BOOKING} element={<ProcessBooking />} />

                                    <Route path={path.AI_SUPPORT} element={<UserIsAuthenticated><AISupportPage /></UserIsAuthenticated>} />
                                    <Route path={path.PRIVACY_POLICY} element={<PrivacyPolicy />} />
                                    <Route path={path.TERMS_OF_USE} element={<TermsOfUse />} />


                                </Routes>
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
                        {/* {isLoggedIn && <ChatBot />} */}
                    </div>
                </BrowserRouter>
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