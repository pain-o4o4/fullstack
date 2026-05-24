import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from '../../../components/Navigator';
import { toast } from 'react-toastify';
import { getAllAppointmentsByIdService } from '../../../services/userService';
import moment from 'moment';
import * as actions from "../../../store/actions";
import './PersonalDashboardTab.scss';

class PersonalDashboardTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            heartRate: 72,
            bloodPressure: '120/80',
            spo2: 98,
            showVitalsModal: false,
            tempHeartRate: '',
            tempBloodPressure: '',
            tempSpo2: '',
            nextAppointment: null,
            isLoadingAppointment: true,
        };
    }

    async componentDidMount() {
        const { userInfo } = this.props;
        if (userInfo && userInfo.id) {
            try {
                const res = await getAllAppointmentsByIdService(userInfo.id);
                if (res && res.errCode === 0 && res.data && res.data.length > 0) {
                    // Lấy lịch hẹn sắp tới gần nhất (status = S1 = chờ xác nhận, hoặc S2 = đã xác nhận)
                    const upcoming = res.data
                        .filter(b => b.statusId === 'S1' || b.statusId === 'S2')
                        .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
                    this.setState({ nextAppointment: upcoming || null });
                }
            } catch (e) {
                console.error(e);
            } finally {
                this.setState({ isLoadingAppointment: false });
            }
        } else {
            this.setState({ isLoadingAppointment: false });
        }
    }



    // Lấy chữ viết tắt từ tên (Apple Contacts style)
    getInitials = (firstName, lastName) => {
        const f = firstName ? firstName.charAt(0).toUpperCase() : '';
        const l = lastName ? lastName.charAt(0).toUpperCase() : '';
        return (l + f) || '?';
    };

    handleOpenVitalsModal = () => {
        this.setState({
            showVitalsModal: true,
            tempHeartRate: String(this.state.heartRate),
            tempBloodPressure: this.state.bloodPressure,
            tempSpo2: String(this.state.spo2)
        });
    }

    handleCloseVitalsModal = () => {
        this.setState({ showVitalsModal: false });
    }

    handleSaveVitals = (e) => {
        e.preventDefault();
        const { tempHeartRate, tempBloodPressure, tempSpo2 } = this.state;
        const hr = tempHeartRate ? parseInt(tempHeartRate) : 72;
        const bp = tempBloodPressure || '120/80';
        const sp = tempSpo2 ? parseInt(tempSpo2) : 98;

        this.setState({
            heartRate: hr,
            bloodPressure: bp,
            spo2: sp,
            showVitalsModal: false
        }, () => {
            toast.success("Cập nhật chỉ số sinh hiệu thành công!", {
                position: "top-right",
                autoClose: 2000
            });
        });
    }

    handleComingSoon = (feature) => {
        toast.info(` "${feature}" sắp ra mắt. Hãy đón chờ!`, {
            autoClose: 3000,
        });
    }

    render() {
        const { isLoggedIn, userInfo, navigate } = this.props;
        const { heartRate, bloodPressure, spo2, showVitalsModal, tempHeartRate, tempBloodPressure, tempSpo2, nextAppointment, isLoadingAppointment } = this.state;

        // Decode avatar
        let avatarSrc = '';
        if (userInfo && userInfo.image) {
            avatarSrc = userInfo.image;
        }

        const fullName = userInfo
            ? `${userInfo.lastName || ''} ${userInfo.firstName || ''}`.trim()
            : '';
        const initials = this.getInitials(userInfo?.firstName, userInfo?.lastName);

        return (
            <div className="personal-dashboard-tab">
                <div className="pdt-wrapper">
                    {/* ── Profile Card ───────────────────────────────── */}
                    <div className="pdt-profile-card">
                        <div className="pdt-avatar-container" onClick={() => isLoggedIn && navigate('/system/patient-profile')}>
                            {avatarSrc ? (
                                <img src={avatarSrc} alt="avatar" className="pdt-avatar-img" />
                            ) : (
                                <div className="pdt-avatar-initials">
                                    {isLoggedIn ? initials : '?'}
                                </div>
                            )}
                            <div className="pdt-avatar-ring"></div>
                        </div>

                        {isLoggedIn ? (
                            <>
                                <h3 className="pdt-user-name">{fullName || 'Người dùng'}</h3>
                                <p className="pdt-user-tagline">
                                    {userInfo?.email || userInfo?.phoneNumber || 'Hộ chiếu sức khỏe điện tử'}
                                </p>
                                <div className="pdt-profile-badges">
                                    <span className="pdt-badge pdt-badge--green">● Đã kích hoạt</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3 className="pdt-user-name">Chào mừng!</h3>
                                <p className="pdt-user-tagline">Đăng nhập để xem hộ chiếu sức khỏe</p>
                                <div className="pdt-auth-actions">
                                    <button className="pdt-btn-primary" onClick={() => navigate('/login')}>Đăng nhập</button>
                                    <button className="pdt-btn-secondary" onClick={() => navigate('/register')}>Đăng ký</button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Card 1: Vitals Tracker */}
                    <div className="pdt-health-card pdt-biometric">
                        <div className="pdt-card-header">
                            <span className="pdt-card-icon"><i className="fas fa-heartbeat"></i></span>
                            <h4>Chỉ số sinh hiệu sinh học</h4>
                        </div>

                        <div className="pdt-vitals-grid">
                            <div className="pdt-vital-item heart-rate">
                                <div className="vital-icon-pulse">
                                    <i className="fas fa-heart"></i>
                                </div>
                                <div className="vital-info">
                                    <span className="vital-label">Nhịp tim</span>
                                    <span className="vital-value">{heartRate} <span className="vital-unit">bpm</span></span>
                                </div>
                            </div>

                            <div className="pdt-vital-item blood-pressure">
                                <div className="vital-icon-pulse bp">
                                    <i className="fas fa-tint"></i>
                                </div>
                                <div className="vital-info">
                                    <span className="vital-label">Huyết áp</span>
                                    <span className="vital-value">{bloodPressure} <span className="vital-unit">mmHg</span></span>
                                </div>
                            </div>

                            <div className="pdt-vital-item spo2">
                                <div className="vital-icon-pulse oxygen">
                                    <i className="fas fa-wind"></i>
                                </div>
                                <div className="vital-info">
                                    <span className="vital-label">Nồng độ SpO2</span>
                                    <span className="vital-value">{spo2}%</span>
                                </div>
                            </div>
                        </div>

                        <button className="pdt-scan-btn" onClick={this.handleOpenVitalsModal}>
                            <i className="fas fa-plus"></i> Cập nhật chỉ số
                        </button>
                    </div>

                    {/* Card 2: Next Appointment (dynamic) */}
                    <div className="pdt-health-card pdt-appointment">
                        <div className="pdt-card-header">
                            <span className="pdt-card-icon"><i className="fas fa-calendar-alt"></i></span>
                            <h4>Lịch hẹn tiếp theo</h4>
                        </div>
                        {isLoadingAppointment ? (
                            <div className="pdt-skeleton-wrapper">
                                <div className="pdt-skeleton pdt-skeleton--line"></div>
                                <div className="pdt-skeleton pdt-skeleton--line short"></div>
                                <div className="pdt-skeleton pdt-skeleton--line shorter"></div>
                            </div>
                        ) : nextAppointment ? (
                            <div
                                className="pdt-appointment-card"
                                onClick={() => navigate('/patient/history')}
                            >
                                <div className="appt-doctor-name">
                                    {nextAppointment.doctorData
                                        ? `${nextAppointment.doctorData.lastName} ${nextAppointment.doctorData.firstName}`
                                        : 'Bác sĩ'}
                                </div>
                                <div className="appt-specialty">
                                    {nextAppointment.doctorData?.Doctor_Info?.specialtyData?.name || 'Chuyên khoa'}
                                </div>
                                <div className="appt-datetime">
                                    {nextAppointment.timeTypeData?.valueVi || ''} —{' '}
                                    {nextAppointment.date
                                        ? moment(nextAppointment.date, 'YYYYMMDD').format('DD/MM/YYYY')
                                        : ''}
                                </div>
                                <div className="appt-status">
                                    <span className={`appt-badge appt-badge--${nextAppointment.statusId === 'S1' ? 'pending' : 'confirmed'}`}>
                                        {nextAppointment.statusId === 'S1' ? 'Chờ xác nhận' : 'Đã xác nhận'}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="pdt-no-appt">
                                <p>Bạn chưa có lịch hẹn nào</p>
                                <button
                                    className="pdt-appt-cta"
                                    onClick={() => navigate('/select-service')}
                                >
                                    Đặt lịch ngay <i className="fas fa-arrow-right"></i>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Card 3: Quick Actions */}
                    <div className="pdt-health-card pdt-actions">
                        <div className="pdt-card-header">
                            <span className="pdt-card-icon"><i className="fas fa-bolt"></i></span>
                            <h4>Tiện ích nhanh</h4>
                        </div>
                        <div className="pdt-action-list">
                            <div className="pdt-action-item" onClick={() => navigate('/patient/history')}>
                                <span>Lịch sử khám bệnh</span>
                                <span className="action-arrow"><i className="fas fa-arrow-right"></i></span>
                            </div>
                            <div className="pdt-action-item" onClick={() => this.handleComingSoon('Toa thuốc điện tử')}>
                                <span>Toa thuốc điện tử</span>
                                <span className="action-arrow"><i className="fas fa-arrow-right"></i></span>
                            </div>
                            <div className="pdt-action-item" onClick={() => this.handleComingSoon('Thẻ bảo hiểm y tế')}>
                                <span>Thẻ bảo hiểm y tế</span>
                                <span className="action-arrow"><i className="fas fa-arrow-right"></i></span>
                            </div>
                            <div className="pdt-action-item" onClick={() => navigate('/select-service')}>
                                <span>Đặt lịch khám mới</span>
                                <span className="action-arrow"><i className="fas fa-arrow-right"></i></span>
                            </div>
                            <div className="pdt-action-item" onClick={() => this.props.openChatWithTab('DOCTOR')}>
                                <span>Chat Bác sĩ</span>
                                <span className="action-arrow"><i className="fas fa-arrow-right"></i></span>
                            </div>
                            <div className="pdt-action-item" onClick={() => this.props.openChatWithTab('AISUPPORT')}>
                                <span>Chat với AI</span>
                                <span className="action-arrow"><i className="fas fa-arrow-right"></i></span>
                            </div>
                        </div>
                    </div>

                    {/* Card 4: AI Promo */}
                    <div className="pdt-health-card pdt-ai-promo" onClick={() => this.props.openChatWithTab('AISUPPORT')}>
                        <div className="pdt-ai-badge">Gemini AI Premium</div>
                        <h3>Phân tích dữ liệu y tế thông minh</h3>
                        <p>Sử dụng AI để phân tích xu hướng sức khỏe từ lịch sử khám bệnh của bạn.</p>
                        <button className="pdt-ai-btn" onClick={(e) => { e.stopPropagation(); this.props.openChatWithTab('AISUPPORT'); }}>
                            Thử ngay <i className="fas fa-arrow-right"></i>
                        </button>
                    </div>

                    {/* ── Glassmorphic Modal for Vitals Update ── */}
                    {showVitalsModal && (
                        <div className="pdt-modal-overlay" onClick={this.handleCloseVitalsModal}>
                            <div className="pdt-modal-content" onClick={(e) => e.stopPropagation()}>
                                <div className="pdt-modal-header">
                                    <h3><i className="fas fa-heartbeat"></i> Cập nhật chỉ số sinh hiệu</h3>
                                    <button className="pdt-modal-close" onClick={this.handleCloseVitalsModal}>&times;</button>
                                </div>
                                <form onSubmit={this.handleSaveVitals}>
                                    <div className="pdt-form-group">
                                        <label>Nhịp tim (bpm):</label>
                                        <input
                                            type="number"
                                            value={tempHeartRate}
                                            onChange={(e) => this.setState({ tempHeartRate: e.target.value })}
                                            placeholder="Ví dụ: 75"
                                            min="40"
                                            max="200"
                                            required
                                        />
                                    </div>

                                    <div className="pdt-form-group">
                                        <label>Huyết áp (mmHg):</label>
                                        <input
                                            type="text"
                                            value={tempBloodPressure}
                                            onChange={(e) => this.setState({ tempBloodPressure: e.target.value })}
                                            placeholder="Ví dụ: 120/80"
                                            required
                                        />
                                    </div>

                                    <div className="pdt-form-group">
                                        <label>Nồng độ Oxy SpO2 (%):</label>
                                        <input
                                            type="number"
                                            value={tempSpo2}
                                            onChange={(e) => this.setState({ tempSpo2: e.target.value })}
                                            placeholder="Ví dụ: 98"
                                            min="50"
                                            max="100"
                                            required
                                        />
                                    </div>

                                    <div className="pdt-modal-actions">
                                        <button type="button" className="pdt-btn-cancel" onClick={this.handleCloseVitalsModal}>Hủy</button>
                                        <button type="submit" className="pdt-btn-save">Lưu lại</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
});

const mapDispatchToProps = dispatch => {
    return {
        openChatWithTab: (tab) => dispatch(actions.openChatWithTab(tab))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PersonalDashboardTab));
