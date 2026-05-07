import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from '../../../components/Navigator';
import { toast } from 'react-toastify';
import { getAllAppointmentsByIdService } from '../../../services/userService';
import moment from 'moment';
import './PersonalDashboardTab.scss';

class PersonalDashboardTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isScanning: false,
            scanSuccess: false,
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

    // Decode buffer image như HomeHeader
    decodeBase64Buffer = (imgObj) => {
        if (imgObj && imgObj.data) {
            let bytes = new Uint8Array(imgObj.data);
            let binary = '';
            for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return `data:image/jpeg;base64,${btoa(binary)}`;
        } else if (typeof imgObj === 'string') {
            return imgObj;
        }
        return '';
    };

    // Lấy chữ viết tắt từ tên (Apple Contacts style)
    getInitials = (firstName, lastName) => {
        const f = firstName ? firstName.charAt(0).toUpperCase() : '';
        const l = lastName ? lastName.charAt(0).toUpperCase() : '';
        return (l + f) || '?';
    };

    handleFaceIDScan = () => {
        this.setState({ isScanning: true });
        setTimeout(() => {
            this.setState({ isScanning: false, scanSuccess: true });
            console.log('Xác thực sinh trắc học thành công!');
        }, 2000);
    }

    handleComingSoon = (feature) => {
        toast.info(`🚀 "${feature}" sắp ra mắt. Hãy đón chờ!`, {
            autoClose: 3000,
        });
    }

    render() {
        const { isLoggedIn, userInfo, navigate } = this.props;
        const { isScanning, scanSuccess, nextAppointment, isLoadingAppointment } = this.state;

        // Decode avatar
        let avatarSrc = '';
        if (userInfo && userInfo.image) {
            avatarSrc = this.decodeBase64Buffer(userInfo.image);
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
                        <div className="pdt-avatar-container" onClick={() => isLoggedIn && navigate('/patient/profile')}>
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

                    {/* ── All Cards (Bento Grid layout) ── */}
                    {/* Card 1: Biometric Auth */}
                    <div className="pdt-health-card pdt-biometric">
                        <div className="pdt-card-header">
                            <span className="pdt-card-icon"><i className="fas fa-lock"></i></span>
                            <h4>Bảo mật sinh trắc học</h4>
                        </div>
                        <div className="pdt-biometric-visual">
                            <div className={`faceid-icon ${isScanning ? 'scanning' : ''} ${scanSuccess ? 'success' : ''}`}>
                                <i className="fas fa-user-shield pdt-faceid-icon"></i>
                            </div>
                            <p>{isScanning ? 'Đang nhận diện...' : scanSuccess ? <span><i className="fas fa-check"></i> Xác thực thành công</span> : 'Chưa kích hoạt FaceID'}</p>
                        </div>
                        {!scanSuccess ? (
                            <button
                                className="pdt-scan-btn"
                                onClick={this.handleFaceIDScan}
                                disabled={isScanning}
                            >
                                {isScanning ? 'Đang quét...' : 'Thử quét FaceID'}
                            </button>
                        ) : (
                            <button
                                className="pdt-scan-btn pdt-scan-btn--success"
                                onClick={() => navigate('/patient/profile')}
                            >
                                Xem hồ sơ của tôi <i className="fas fa-arrow-right"></i>
                            </button>
                        )}
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
                        </div>
                    </div>

                    {/* Card 4: AI Promo */}
                    <div className="pdt-health-card pdt-ai-promo" onClick={() => navigate('/ai-support')}>
                        <div className="pdt-ai-badge">Gemini AI Premium</div>
                        <h3>Phân tích dữ liệu y tế thông minh</h3>
                        <p>Sử dụng AI để phân tích xu hướng sức khỏe từ lịch sử khám bệnh của bạn.</p>
                        <button className="pdt-ai-btn" onClick={(e) => { e.stopPropagation(); navigate('/ai-support'); }}>
                            Thử ngay <i className="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
});

export default withRouter(connect(mapStateToProps)(PersonalDashboardTab));
