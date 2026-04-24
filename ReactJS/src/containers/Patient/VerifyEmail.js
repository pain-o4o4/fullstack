import React, { Component } from 'react';
import { connect } from "react-redux";

import { postVerifyAppointmentService } from '../../services/userService'
import { withRouter } from '../../components/Navigator';
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
            let status = urlParams.get('status');

            if (token && doctorId) {
                this.setState({ isVerifyCompleted: false }); // Start loading
                let res = await postVerifyAppointmentService({
                    token: token,
                    doctorId: doctorId,
                    status: status
                })

                if (res && res.errCode === 0) {
                    this.setState({
                        statusVerify: true,
                        isVerifyCompleted: true,
                        isCancelled: res.errMessage === "CANCELLED"
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

    render() {
        let { statusVerify, isVerifyCompleted, isCancelled } = this.state;
        let { language } = this.props;

        return (
            <React.Fragment>
                <HomeHeader />
                <div className="verify-container">
                    <div className="glass-card">
                        {/* KHỐI 1: LOADING (Đang xử lý) */}
                        {!isVerifyCompleted && (
                            <div className="loader-wrapper fade-in">
                                <div className="spinner"></div>
                                <p className="loading-text">
                                    <FormattedMessage id="verify-email.loading" defaultMessage="Verifying data..." />
                                </p>
                            </div>
                        )}

                        {/* KHỐI 2: KẾT QUẢ (Sau khi gọi API xong) */}
                        {isVerifyCompleted && (
                            <div className="result-wrapper fade-in-up">
                                {isCancelled ? (
                                    // TRƯỜNG HỢP HỦY THANH TOÁN
                                    <div className="result-content warning">
                                        <div className="icon-circle warning">
                                            <i className="fas fa-exclamation-triangle"></i>
                                        </div>
                                        <h1 className="title">
                                            {language === 'vi' ? 'Đã hủy thanh toán' : 'Payment Cancelled'}
                                        </h1>
                                        <p className="desc">
                                            {language === 'vi' 
                                                ? 'Bạn đã hủy quá trình thanh toán. Lịch hẹn này đã được giải phóng.' 
                                                : 'You have cancelled the payment. This appointment slot has been released.'}
                                        </p>
                                        <button className="btn-pill secondary" onClick={() => this.props.navigate('/home')}>
                                            <FormattedMessage id="verify-email.back-home" defaultMessage="Back to Home" />
                                        </button>
                                    </div>
                                ) : statusVerify ? (
                                    // TRƯỜNG HỢP XÁC THỰC THÀNH CÔNG
                                    <div className="result-content success">
                                        <div className="icon-circle">
                                            <i className="fas fa-check"></i>
                                        </div>
                                        <h1 className="title">
                                            <FormattedMessage id="verify-email.success-title" defaultMessage="Verification Successful" />
                                        </h1>
                                        <p className="desc">
                                            <FormattedMessage id="verify-email.success-desc" defaultMessage="Your appointment has been recorded. Thank you for choosing us." />
                                        </p>
                                        <button className="btn-pill" onClick={() => this.props.navigate('/home')}>
                                            <FormattedMessage id="verify-email.back-home" defaultMessage="Back to Home" />
                                        </button>
                                    </div>
                                ) : (
                                    // TRƯỜNG HỢP THẤT BẠI
                                    <div className="result-content error">
                                        <div className="icon-circle">
                                            <i className="fas fa-times"></i>
                                        </div>
                                        <h1 className="title">
                                            <FormattedMessage id="verify-email.failed-title" defaultMessage="Verification Failed" />
                                        </h1>
                                        <p className="desc">
                                            <FormattedMessage id="verify-email.failed-desc" defaultMessage="The link is invalid or has expired. Please check your email again." />
                                        </p>
                                        <button className="btn-pill secondary" onClick={() => this.props.navigate('/home')}>
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
