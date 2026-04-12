import React, { Component } from 'react';
import { connect } from "react-redux";

import { postVeryfyAppointmentService } from '../../../../ReactJS/src/services/userService'
import { withRouter } from 'react-router'; // hoặc 'react-router-dom'
import { FormattedMessage } from 'react-intl';
import './VerifyEmail.scss'
import HomeHeader from '../HomePage/HomeHeader';
import HomePage from '../HomePage/HomePage';
class VerifyEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statusVerify: false,
            isVerifyCompleted: false
        }
    }



    async componentDidMount() {
        if (this.props.location && this.props.location.search) {
            let urlParams = new URLSearchParams(this.props.location.search);
            let token = urlParams.get('token');
            let doctorId = urlParams.get('doctorId');
            if (token && doctorId) {
                let res = await postVeryfyAppointmentService({
                    token: token,
                    doctorId: doctorId
                })
                if (res && res.errCode === 0) {
                    this.setState({
                        statusVerify: true,
                        isVerifyCompleted: true
                    });
                } else {
                    this.setState({
                        statusVerify: false,
                        isVerifyCompleted: true
                    });
                }
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {

    }


    render() {
        let { statusVerify, isVerifyCompleted } = this.state;
        // this.props.language đã được connect từ mapStateToProps
        let { language } = this.props;

        return (
            <React.Fragment>
                <HomeHeader />
                {/* <HomePage /> */}
                <div className="apple-verify-container">
                    <div className="apple-glass-card">
                        {/* KHỐI 1: LOADING (Đang xác thực) */}
                        {isVerifyCompleted === true && (
                            <div className="loader-wrapper fade-in">
                                <div className="apple-spinner"></div>
                                <p className="loading-text">
                                    <FormattedMessage id="verify-email.loading" defaultMessage="Verifying data..." />

                                </p>
                            </div>
                        )}

                        {/* KHỐI 2: KẾT QUẢ (Sau khi gọi API xong) */}
                        {isVerifyCompleted === false && (
                            <div className="result-wrapper fade-in-up">
                                {statusVerify === true ? (
                                    // TRƯỜNG HỢP THÀNH CÔNG
                                    <div className="result-content success">
                                        <div className="icon-circle">
                                            <i className="fas fa-check"></i>
                                        </div>
                                        <h1 className="apple-title">
                                            <FormattedMessage id="verify-email.success-title" defaultMessage="Verification Successful" />
                                        </h1>
                                        <p className="apple-desc">
                                            <FormattedMessage id="verify-email.success-desc" defaultMessage="Your appointment has been recorded. Thank you for choosing us." />
                                        </p>
                                        <button className="btn-apple-pill" onClick={() => this.props.history.push('/home')}>
                                            <FormattedMessage id="verify-email.back-home" defaultMessage="Back to Home" />
                                        </button>
                                    </div>
                                ) : (
                                    // TRƯỜNG HỢP THẤT BẠI
                                    <div className="result-content error">
                                        <div className="icon-circle">
                                            <i className="fas fa-times"></i>
                                        </div>
                                        <h1 className="apple-title">
                                            <FormattedMessage id="verify-email.failed-title" defaultMessage="Verification Failed" />
                                        </h1>
                                        <p className="apple-desc">
                                            <FormattedMessage id="verify-email.failed-desc" defaultMessage="The link is invalid or has expired. Please check your email again." />
                                        </p>
                                        <button className="btn-apple-pill secondary" onClick={() => this.props.history.push('/home')}>
                                            <FormattedMessage id="verify-email.back-home" defaultMessage="Back to Home" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        // // VerifyEmail: state.admin.VerifyEmail

    };
};

const mapDispatchToProps = dispatch => {
    return {

        // getVerifyEmail: (id) => dispatch(action.getVerifyEmail(id))
    };
};

// import { withRouter } from 'react-router'; // hoặc 'react-router-dom'
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(VerifyEmail));
