import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from 'react-router';
import HomeHeader from '../../../HomePage/HomeHeader';
import { postBookAppointment } from '../../../../services/userService';
import { toast } from 'react-toastify';
import _ from 'lodash';
import './Payment.scss';

class Payment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeLeft: 900, // 15 phút
            bookingData: null
        }
    }

    componentDidMount() {
        // Ưu tiên lấy từ location state (nhận từ BookingModal)
        if (this.props.location.state && this.props.location.state.bookingData) {
            this.setState({
                bookingData: this.props.location.state.bookingData
            });
            this.startTimer();
        } else {
            // Trường hợp user F5 hoặc vào trực tiếp link mà không có data
            toast.error("Không tìm thấy thông tin đơn hàng!");
            this.props.history.push('/home');
        }
    }

    componentWillUnmount() {
        if (this.timer) clearInterval(this.timer);
    }

    startTimer = () => {
        this.timer = setInterval(() => {
            this.setState(prevState => {
                if (prevState.timeLeft <= 1) {
                    clearInterval(this.timer);
                    toast.error("Hết thời gian thanh toán!");
                    this.props.history.push('/home');
                }
                return { timeLeft: prevState.timeLeft - 1 };
            });
        }, 1000);
    }

    handleConfirmPaid = async () => {
        let { bookingData } = this.state;
        if (bookingData) {
            try {
                let res = await postBookAppointment(bookingData);
                if (res && res.errCode === 0 && res.data) {
                    // toast.success(res.errMessage || "Thanh toán thanh cong!");
                    window.location.href = res.data;
                } else {
                    toast.error(res.errMessage || "Lỗi khởi tạo thanh toán!");
                }
            } catch (e) {
                console.log(e);
                toast.error("Không thể kết nối đến máy chủ thanh toán!");
            }
        }
    }

    render() {
        let { timeLeft, bookingData } = this.state;
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;

        return (
            <React.Fragment>
                <HomeHeader isShowBanner={false} />
                <div className="payment-page">
                    <div className="payment-container">
                        <div className="payment-header">
                            <h2>XÁC NHẬN THANH TOÁN</h2>
                            <div className="timer-box">
                                <i className="fas fa-clock"></i>
                                <span>Thời gian giữ chỗ: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span>
                            </div>
                        </div>

                        {bookingData ? (
                            <div className="payment-body">
                                <div className="info-grid">
                                    {/* Cột 1: Thông tin bác sĩ */}
                                    <div className="info-card">
                                        <div className="card-title"><i className="fas fa-user-md"></i> Thông tin bác sĩ</div>
                                        <div className="card-content">
                                            <p><span className="label">Bác sĩ:</span> <strong>{bookingData.doctorName}</strong></p>
                                            <p><span className="label">Chuyên khoa:</span> <span>{bookingData.specialtyName}</span></p>
                                            <p><span className="label">Phòng khám:</span> <span>{bookingData.clinicName}</span></p>
                                            <p><span className="label">Địa chỉ:</span> <span className="address">{bookingData.addressClinic}</span></p>
                                        </div>
                                    </div>

                                    {/* Cột 2: Thông tin bệnh nhân */}
                                    <div className="info-card">
                                        <div className="card-title"><i className="fas fa-user-injured"></i> Thông tin bệnh nhân</div>
                                        <div className="card-content">
                                            <p><span className="label">Họ tên:</span> <strong>{bookingData.fullName}</strong></p>
                                            <p><span className="label">Số điện thoại:</span> <span>{bookingData.phoneNumber}</span></p>
                                            <p><span className="label">Email:</span> <span>{bookingData.email}</span></p>
                                            <p><span className="label">Lý do khám:</span> <i>{bookingData.reason || 'Khám sức khỏe'}</i></p>
                                        </div>
                                    </div>
                                </div>

                                {/* Tổng tiền */}
                                <div className="total-section">
                                    <div className="total-label">Tổng chi phí thanh toán:</div>
                                    <div className="total-amount">{bookingData.priceId}</div>
                                </div>

                                <div className="payment-note">
                                    <i className="fas fa-info-circle"></i>
                                    Hệ thống sử dụng cổng thanh toán PayOS. Vui lòng không tắt trình duyệt cho đến khi nhận được thông báo thành công.
                                </div>
                            </div>
                        ) : (
                            <div className="loading-state">Đang tải dữ liệu đơn hàng...</div>
                        )}

                        <div className="payment-footer">
                            <button className="btn-confirm" onClick={this.handleConfirmPaid}>
                                <i className="fas fa-credit-card"></i> THANH TOÁN NGAY
                            </button>
                            <button className="btn-cancel" onClick={() => this.props.history.goBack()}>
                                QUAY LẠI
                            </button>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    language: state.app.language,
});

export default withRouter(connect(mapStateToProps, null)(Payment));