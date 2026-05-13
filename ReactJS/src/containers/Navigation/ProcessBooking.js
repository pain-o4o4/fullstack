import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from '../../components/Navigator';
import HomeHeader from '../HomePage/HomeHeader';
import HomeFooter from '../HomePage/HomeFooter';
import './ProcessBooking.scss';
import bannerProcess from '../../assets/images/bannerProcess.png';

class ProcessBooking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeStep: 1
        };
    }

    renderSteps = () => {
        const { activeStep } = this.state;
        const stepsConfig = [
            {
                id: 1,
                title: 'Tìm bác sĩ',
                desc: 'Tìm kiếm chuyên khoa và bác sĩ phù hợp với nhu cầu.'
            },
            {
                id: 2,
                title: 'Chọn lịch',
                desc: 'Lựa chọn khung giờ thăm khám tối ưu cho lịch trình.'
            },
            {
                id: 3,
                title: 'Nhập thông tin',
                desc: 'Vui lòng cung cấp đầy đủ thông tin để quy trình mượt mà hơn.'
            },
            {
                id: 4,
                title: 'Thanh toán',
                desc: 'Nhận mã xác nhận và hướng dẫn check-in tự động tại viện.'
            }
        ];

        return (
            <div className="mindmap-nodes">
                {stepsConfig.map((step) => {
                    const isActive = activeStep >= step.id;
                    const isNext = activeStep + 1 === step.id;

                    return (
                        <div
                            key={step.id}
                            className={`mindmap-node step-${step.id} ${isActive ? 'active' : 'locked'} ${isNext ? 'next-available' : ''}`}
                        >
                            <div className="node-header">
                                <div className="node-pill">
                                    {isActive && activeStep > step.id ? <i className="fas fa-check"></i> : `0${step.id}`}
                                </div>
                                <div className="node-title">{step.title}</div>
                            </div>
                            <div className="node-body" data-title={step.title}>
                                <div className="node-desc">{step.desc}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    render() {
        const { activeStep } = this.state;
        return (
            <div className="process-booking-container">
                <HomeHeader />

                <div className="process-banner" style={{ backgroundImage: `url(${bannerProcess})` }}>
                    <div className="banner-overlay"></div>
                    <div className="banner-content">
                        <div className="hero-badge">
                            <span className="badge-dot"></span>
                            Quy trình chuẩn y tế
                        </div>
                        <div className="banner-title">
                            Đặt khám dễ dàng <span className="hero-accent">chăm sóc tận tâm</span>
                        </div>
                        <div className="banner-subtitle">
                            Kết nối bác sĩ chuyên khoa chỉ trong vài phút. Đơn giản và tin cậy.
                        </div>

                        <div className="banner-stats">
                            <div className="stat-item">
                                <span className="stat-value">04</span>
                                <span className="stat-label">Bước thực hiện</span>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <span className="stat-value">24/7</span>
                                <span className="stat-label">Hỗ trợ đặt lịch</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="process-booking-body">
                    <div className="process-content">
                        <div className="header-section">
                            <div className="title">Các bước đặt lịch khám</div>
                            <div className="subtitle">Quy trình đơn giản giúp bạn tiết kiệm thời gian</div>
                        </div>

                        <div className="mindmap-container">
                            <div className="central-hub">
                                <div className="hub-box">
                                    <div className="hub-desc">Quy trình 4 bước đơn giản</div>
                                </div>
                                <div className="branch-lines">
                                    {[1, 2, 3, 4].map(i => <div key={i} className={`line line-${i}`}></div>)}
                                </div>
                            </div>
                            {this.renderSteps()}
                        </div>

                        <div className="tips-section">
                            <div className="tip-box">
                                <div className="tip-icon">
                                    <i className="fas fa-lightbulb"></i>
                                </div>
                                <div className="tip-content">
                                    <div className="tip-text">
                                        <strong>Mẹo nhỏ:</strong> Bạn có thể theo dõi tiến độ đặt lịch ngay tại đây để không bỏ lỡ bất kỳ bước quan trọng nào.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="action-footer">
                            <button
                                className={`btn-start-booking ${activeStep < 4 ? 'disabled' : ''}`}
                                onClick={() => activeStep === 4 && this.props.navigate('/home')}
                            >
                                {activeStep < 4 ? `Hoàn thành bước ${activeStep}/4 để bắt đầu` : "Bắt đầu đặt lịch ngay"}
                            </button>
                        </div>
                    </div>
                </div>
                <HomeFooter />
            </div>
        );
    }
}

export default withRouter(connect()(ProcessBooking));
