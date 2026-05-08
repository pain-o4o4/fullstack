import React, { Component } from 'react';
import { withRouter } from '../../../components/Navigator';
import { getAllClinicService } from '../../../services/userService';
import ExaminationPackages from './ExaminationPackages';
import DoctorMiniChat from './DoctorMiniChat';
import ChatBot from './ChatBot';
import './ClinicFlowTab.scss';

const UTILITIES = [
    {
        id: 'tele',
        title: 'Chat với bác sĩ',
        tag: 'Instant Chat',
        desc: 'Kết nối và nhận tư vấn trực tiếp từ bác sĩ chuyên khoa qua tin nhắn.',
        accent: '#0071e3',
        action: 'DOCTOR_CHAT'
    },
    {
        id: 'package',
        title: 'Gói khám tổng quát',
        tag: 'Tiết kiệm',
        desc: 'Các gói khám đa dạng từ cơ bản đến chuyên sâu cho mọi lứa tuổi.',
        accent: '#34c759',
        action: 'PACKAGES'
    },
    {
        id: 'lab',
        title: 'AI tư vấn',
        tag: 'Thông minh',
        desc: 'Hỏi đáp triệu chứng và nhận gợi ý y tế từ trợ lý AI Gemini.',
        accent: '#af52de',
        action: 'AI_CHAT'
    },
    {
        id: 'pharmacy',
        title: 'Nhà thuốc số',
        tag: 'Giao nhanh',
        desc: 'Mua thuốc theo toa bác sĩ và thực phẩm chức năng chính hãng.',
        accent: '#ff9500',
        action: 'PHARMACY'
    }
];

class ClinicFlowTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeView: 'MAIN', // MAIN, PACKAGES, DOCTOR_CHAT, AI_CHAT
            numClinics: 200,
            numPharmacies: 500
        };
    }

    async componentDidMount() {
        try {
            let res = await getAllClinicService();
            if (res && res.errCode === 0) {
                this.setState({
                    numClinics: res.data.length
                });
            }
        } catch (e) {
            console.error(e);
        }
    }

    handleCardClick = (action) => {
        switch (action) {
            case 'DOCTOR_CHAT':
                this.setState({ activeView: 'DOCTOR_CHAT' });
                break;
            case 'PACKAGES':
                this.setState({ activeView: 'PACKAGES' });
                break;
            case 'AI_CHAT':
                this.setState({ activeView: 'AI_CHAT' });
                break;
            case 'PHARMACY':
                this.props.navigate('/pharmacy');
                break;
            default:
                break;
        }
    };

    renderView = () => {
        const { activeView } = this.state;
        switch (activeView) {
            case 'PACKAGES':
                return <ExaminationPackages onBack={() => this.setState({ activeView: 'MAIN' })} />;
            case 'DOCTOR_CHAT':
                return <DoctorMiniChat onBack={() => this.setState({ activeView: 'MAIN' })} />;
            case 'AI_CHAT':
                return <ChatBot onBack={() => this.setState({ activeView: 'MAIN' })} />;
            default:
                return null;
        }
    };

    render() {
        const { activeView, numClinics, numPharmacies } = this.state;

        return (
            <div className="clinic-flow-tab">
                {activeView !== 'MAIN' ? (
                    this.renderView()
                ) : (
                    <>
                        <div className="cf-header">
                            <div className="cf-eyebrow">Dịch vụ nền tảng</div>
                            <h2 className="cf-title">Tiện ích <span>Y tế Số</span></h2>
                            <p className="cf-subtitle">Giải pháp chăm sóc sức khỏe toàn diện, hỗ trợ bạn ở mọi nơi.</p>
                        </div>

                        <div className="cf-utilities-grid">
                            {UTILITIES.map((util) => (
                                <div
                                    key={util.id}
                                    className="cf-util-card"
                                    style={{ '--accent': util.accent }}
                                    onClick={() => this.handleCardClick(util.action)}
                                >
                                    <div className="util-tag">{util.tag}</div>
                                    <h3 className="util-title">{util.title}</h3>
                                    <p className="util-desc">{util.desc}</p>

                                    <div className="util-visual">
                                        <div className="util-shape"></div>
                                    </div>

                                    <button className="util-action">Khám phá ngay <i className="fas fa-arrow-right"></i></button>
                                </div>
                            ))}
                        </div>

                        <div className="cf-ecosystem-banner">
                            <div className="eco-content">
                                <h4>Hệ sinh thái BookingCare</h4>
                                <p>Kết nối hơn {numClinics} bệnh viện và {numPharmacies} đối tác trên toàn quốc.</p>
                            </div>
                            <div className="eco-visual">
                                <div className="eco-node"></div>
                                <div className="eco-node"></div>
                                <div className="eco-node"></div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    }
}

export default withRouter(ClinicFlowTab);
