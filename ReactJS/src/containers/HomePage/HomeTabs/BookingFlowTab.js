import React, { Component } from 'react';
import { withRouter } from '../../../components/Navigator';
import { getAllSpecialtyService, getTopDoctorHomeService, getAllClinicService } from '../../../services/userService';
import './BookingFlowTab.scss';

class BookingFlowTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeStep: 0,
            specialtyCount: 0,
            listSpecialty: [],
            topDoctors: [],
            listClinics: []
        };
    }

    async componentDidMount() {
        try {
            let [resSpecialty, resDoctors, resClinics] = await Promise.all([
                getAllSpecialtyService(),
                getTopDoctorHomeService(4),
                getAllClinicService()
            ]);

            if (resSpecialty && resSpecialty.errCode === 0) {
                this.setState({
                    specialtyCount: resSpecialty.data.length,
                    listSpecialty: resSpecialty.data.slice(0, 6)
                });
            }

            if (resDoctors && resDoctors.errCode === 0) {
                this.setState({ topDoctors: resDoctors.data });
            }

            if (resClinics && resClinics.errCode === 0) {
                this.setState({ listClinics: resClinics.data.slice(0, 4) });
            }
        } catch (e) {
            console.error(e);
        }
    }

    getSteps = (specialtyCount) => [
        {
            id: 'discovery',
            number: '1',
            title: 'Khám phá',
            label: 'Tìm kiếm',
            desc: 'Duyệt theo chuyên khoa, bác sĩ hoặc bệnh viện hàng đầu.',
            details: [`Hơn ${specialtyCount} chuyên khoa`, 'Bác sĩ uy tín', 'Cơ sở y tế đạt chuẩn']
        },
        {
            id: 'selection',
            number: '2',
            title: 'Lựa chọn',
            label: 'Đặt lịch',
            desc: 'Chọn bác sĩ và khung giờ khám phù hợp với lịch trình.',
            details: ['Xem đánh giá thật', 'Giá khám minh bạch', 'Đặt trong 60 giây']
        },
        {
            id: 'confirmation',
            number: '3',
            title: 'Xác thực',
            label: 'Hồ sơ',
            desc: 'Điền thông tin và xác nhận đặt khám qua mã OTP/FaceID.',
            details: ['Hồ sơ điện tử', 'Thanh toán an toàn', 'Xác nhận tức thì']
        },
        {
            id: 'journey',
            number: '4',
            title: 'Hành trình',
            label: 'Khám bệnh',
            desc: 'Đến cơ sở y tế, quét mã QR và tiến hành thăm khám.',
            details: ['Check-in tự động', 'Không chờ đợi', 'Kết quả số hóa']
        }
    ];

    renderStepContent = (stepIndex) => {
        const { listSpecialty, topDoctors, listClinics } = this.state;
        
        switch(stepIndex) {
            case 0: // Discovery - Specialties
                return (
                    <div className="step-content-grid">
                        {listSpecialty.map((item, idx) => (
                            <div 
                                key={idx} 
                                className="step-item-card specialty"
                                onClick={() => this.props.navigate(`/detail-specialty/${item.id}`)}
                            >
                                <div className="item-icon" style={{ backgroundImage: `url(${item.image})` }}></div>
                            </div>
                        ))}
                    </div>
                );
            case 1: // Selection - Doctors
                return (
                    <div className="step-content-list">
                        {topDoctors.map((doc, idx) => (
                            <div 
                                key={idx} 
                                className="step-item-row doctor"
                                onClick={() => this.props.navigate(`/detail-doctor/${doc.id}`)}
                            >
                                <div className="item-avatar" style={{ backgroundImage: `url(${doc.image})` }}></div>
                                <div className="item-info">
                                    <div className="item-title">{doc.lastName} {doc.firstName}</div>
                                    <div className="item-subtitle">{doc.positionData?.valueVi || 'Bác sĩ'}</div>
                                </div>
                                <div className="item-action">Đặt lịch</div>
                            </div>
                        ))}
                    </div>
                );
            case 2: // Confirmation - Clinics
                return (
                    <div className="step-content-list">
                        {listClinics.map((clinic, idx) => (
                            <div 
                                key={idx} 
                                className="step-item-row clinic"
                                onClick={() => this.props.navigate(`/detail-clinic/${clinic.id}`)}
                            >
                                <div className="item-img" style={{ backgroundImage: `url(${clinic.image})` }}></div>
                                <div className="item-info">
                                    <div className="item-title">{clinic.name}</div>
                                    <div className="item-subtitle">Cơ sở y tế uy tín</div>
                                </div>
                                <i className="fas fa-chevron-right"></i>
                            </div>
                        ))}
                    </div>
                );
            case 3: // Journey - Ticket Mockup
                return (
                    <div className="step-content-ticket">
                        <div className="ticket-header">
                            <div className="ticket-brand">BookingCare</div>
                            <div className="ticket-status">CONFIRMED</div>
                        </div>
                        <div className="ticket-body">
                            <div className="ticket-info">
                                <label>Bệnh nhân</label>
                                <span>Nguyễn Văn A</span>
                            </div>
                            <div className="ticket-info">
                                <label>Thời gian</label>
                                <span>08:30 - 09:00</span>
                            </div>
                            <div className="ticket-qr">
                                <i className="fas fa-qrcode"></i>
                                <span>Quét tại quầy lễ tân</span>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }

    render() {
        const { activeStep, specialtyCount } = this.state;
        const steps = this.getSteps(specialtyCount);
        const currentData = steps[activeStep];

        return (
            <div className="booking-flow-tab">
                <div className="bf-overview-container">
                    <div className="bf-sidebar">
                        <div className="bf-eyebrow">Hệ thống đặt khám</div>
                        <h2 className="bf-main-title">Quy trình <span>Số hóa</span></h2>
                        <p className="bf-main-desc">Trải nghiệm chăm sóc sức khỏe liền mạch từ lúc tìm kiếm đến khi nhận kết quả.</p>
                        
                        <div className="bf-step-list">
                            {steps.map((step, i) => (
                                <div 
                                    key={step.id} 
                                    className={`bf-step-nav-item ${activeStep === i ? 'active' : ''}`}
                                    onClick={() => this.setState({ activeStep: i })}
                                >
                                    <div className="step-dot"></div>
                                    <div className="step-info">
                                        <div className="step-label">{step.label}</div>
                                        <div className="step-title">{step.title}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bf-main-visual">
                        <div className="bf-visual-card">
                            <div className="visual-header">
                                <div className="step-badge">Bước {currentData.number}</div>
                                <h3>{currentData.title}</h3>
                            </div>
                            <p className="visual-desc">{currentData.desc}</p>
                            
                            <div className="detail-grid">
                                {currentData.details.map((detail, idx) => (
                                    <div key={idx} className="detail-item">
                                        <div className="detail-check"><i className="fas fa-check"></i></div>
                                        <span>{detail}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="visual-mockup">
                                <div className="mockup-inner">
                                    {this.renderStepContent(activeStep)}
                                </div>
                                <div className="mockup-overlay">
                                    <div className="pulse-circle"></div>
                                </div>
                            </div>

                            <button 
                                className="bf-action-btn"
                                onClick={() => this.props.navigate(activeStep < 2 ? '/select-service' : '/all-doctor')}
                            >
                                Bắt đầu ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(BookingFlowTab);
