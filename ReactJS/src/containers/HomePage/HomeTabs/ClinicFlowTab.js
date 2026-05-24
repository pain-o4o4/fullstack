import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from '../../../components/Navigator';
import { getAllClinicService } from '../../../services/userService';
import ExaminationPackages from './ExaminationPackages';
import DoctorConsultationTab from './DoctorConsultationTab';
import ChatBot from './ChatBot';
import './ClinicFlowTab.scss';

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
        // Listen for quick chat trigger from detailed doctor page
        const triggerChat = localStorage.getItem('telehealth_trigger_chat');
        if (triggerChat === 'true') {
            localStorage.removeItem('telehealth_trigger_chat');
            this.setState({ activeView: 'DOCTOR_CHAT' });
        }

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

    getUtilities = (language) => {
        return [
            {
                id: 'tele',
                title: language === 'vi' ? 'Tư vấn trực tuyến' : 'Telehealth Consultation',
                tag: 'Telehealth',
                desc: language === 'vi'
                    ? 'Đặt lịch hẹn trực tuyến và nhận tư vấn chuyên sâu từ bác sĩ chuyên khoa.'
                    : 'Book online appointments and receive in-depth expert consultation.',
                accent: '#0071e3',
                action: 'DOCTOR_CHAT'
            },
            {
                id: 'package',
                title: language === 'vi' ? 'Gói khám tổng quát' : 'General Checkup Packages',
                tag: language === 'vi' ? 'Tiết kiệm' : 'Savings',
                desc: language === 'vi'
                    ? 'Các gói khám đa dạng từ cơ bản đến chuyên sâu cho mọi lứa tuổi.'
                    : 'Diverse checkup packages from basic to advanced for all ages.',
                accent: '#34c759',
                action: 'PACKAGES'
            },
            {
                id: 'lab',
                title: language === 'vi' ? 'AI tư vấn' : 'AI Assistant',
                tag: language === 'vi' ? 'Thông minh' : 'Smart AI',
                desc: language === 'vi'
                    ? 'Hỏi đáp triệu chứng và nhận gợi ý y tế từ trợ lý AI Gemini.'
                    : 'Check symptoms and get smart medical suggestions from Gemini AI.',
                accent: '#af52de',
                action: 'AI_CHAT'
            },
            {
                id: 'pharmacy',
                title: language === 'vi' ? 'Nhà thuốc số' : 'Digital Pharmacy',
                tag: language === 'vi' ? 'Giao nhanh' : 'Fast Delivery',
                desc: language === 'vi'
                    ? 'Mua thuốc theo toa bác sĩ và thực phẩm chức năng chính hãng.'
                    : 'Buy prescription medicine and genuine health supplements.',
                accent: '#ff9500',
                action: 'PHARMACY'
            }
        ];
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
                return <DoctorConsultationTab onBack={() => this.setState({ activeView: 'MAIN' })} />;
            case 'AI_CHAT':
                return <ChatBot onBack={() => this.setState({ activeView: 'MAIN' })} />;
            default:
                return null;
        }
    };

    render() {
        const { activeView, numClinics, numPharmacies } = this.state;
        const { language } = this.props;
        const utilitiesList = this.getUtilities(language);

        return (
            <div className="clinic-flow-tab">
                {activeView !== 'MAIN' ? (
                    this.renderView()
                ) : (
                    <>
                        <div className="cf-header">
                            <div className="cf-eyebrow">
                                {language === 'vi' ? 'Dịch vụ nền tảng' : 'Platform Services'}
                            </div>
                            <h2 className="cf-title">
                                {language === 'vi' ? (
                                    <>Tiện ích <span>Y tế Số</span></>
                                ) : (
                                    <>Digital <span>Healthcare Services</span></>
                                )}
                            </h2>
                            <p className="cf-subtitle">
                                {language === 'vi'
                                    ? 'Giải pháp chăm sóc sức khỏe toàn diện, hỗ trợ bạn ở mọi nơi.'
                                    : 'Comprehensive healthcare solutions, supporting you everywhere.'}
                            </p>
                        </div>

                        <div className="cf-utilities-grid">
                            {utilitiesList.map((util) => (
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

                                    <button className="util-action">
                                        {language === 'vi' ? 'Khám phá ngay' : 'Explore Now'} <i className="fas fa-arrow-right"></i>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="cf-ecosystem-banner">
                            <div className="eco-content">
                                <h4>{language === 'vi' ? 'Hệ sinh thái BookingCare' : 'BookingCare Ecosystem'}</h4>
                                <p>
                                    {language === 'vi'
                                        ? `Kết nối hơn ${numClinics} bệnh viện và ${numPharmacies} đối tác trên toàn quốc.`
                                        : `Connecting more than ${numClinics} hospitals and ${numPharmacies} partners nationwide.`}
                                </p>
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

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

export default withRouter(connect(mapStateToProps)(ClinicFlowTab));
