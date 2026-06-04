import React, { Component } from 'react';
import { withRouter } from '../../../components/Navigator';
import { getAllUsers, getDetailDoctorByIdService, getScheduleByDate } from '../../../services/userService';
import './ChatBox.scss';
import ChatActionsMenu from './ChatActionsMenu';
import MarkdownIt from 'markdown-it';
import moment from 'moment';
import 'moment/locale/vi';
import { LANGUAGES } from '../../../utils/constant';
import BookingModal from '../../Patient/Doctor/Modal/BookingModal';
import AppointmentCard from './AppointmentCard';

const mdParser = new MarkdownIt({
    html: false,
    linkify: true,
    typographer: true,
    breaks: true
});

const REACTION_LIST = [
    { id: 'heart', img: 'https://emojicdn.elk.sh/%E2%9D%A4%EF%B8%8F?style=apple', alt: 'heart' },
    { id: 'laugh', img: 'https://emojicdn.elk.sh/%F0%9F%98%82?style=apple', alt: 'laugh' },
    { id: 'wow', img: 'https://emojicdn.elk.sh/%F0%9F%98%AE?style=apple', alt: 'wow' },
    { id: 'sad', img: 'https://emojicdn.elk.sh/%F0%9F%98%A2?style=apple', alt: 'sad' },
    { id: 'angry', img: 'https://emojicdn.elk.sh/%F0%9F%98%A1?style=apple', alt: 'angry' },
    { id: 'like', img: 'https://emojicdn.elk.sh/%F0%9F%91%8D?style=apple', alt: 'like' }
];

class ChatBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showReactionFor: null,
            showProfileDrawer: false,
            dbUserData: null,
            isLoadingProfile: false,
            showScheduleSelector: false,
            scheduleDates: [],
            selectedScheduleDate: '',
            scheduleSlots: [],
            selectedScheduleSlot: null,
            isLoadingScheduleSlots: false,
            isBookingModalOpen: false,
            bookingModalData: null,
            isBannerHidden: false
        };
        this.reactionRef = React.createRef();
        this.textareaRef = React.createRef();
    }

    handleShowDoctorProfile = async () => {
        const { showProfileDrawer } = this.state;
        const { selectedDoctor, userInfo } = this.props;

        if (selectedDoctor && selectedDoctor.isAI) {
            this.setState({ showProfileDrawer: !showProfileDrawer, dbUserData: null, isLoadingProfile: false });
            return;
        }

        if (!showProfileDrawer && selectedDoctor && selectedDoctor.id) {
            this.setState({ isLoadingProfile: true, showProfileDrawer: true, dbUserData: null });
            try {
                let res;
                if (userInfo && userInfo.roleId === 'R2') {
                    // Doctor viewing Patient
                    res = await getAllUsers(selectedDoctor.id);
                    if (res && res.errCode === 0) {
                        this.setState({ dbUserData: res.users, isLoadingProfile: false });
                    } else {
                        this.setState({ dbUserData: selectedDoctor, isLoadingProfile: false });
                    }
                } else {
                    // Patient viewing Doctor
                    res = await getDetailDoctorByIdService(selectedDoctor.id);
                    if (res && res.errCode === 0) {
                        this.setState({ dbUserData: res.data, isLoadingProfile: false });
                    } else {
                        this.setState({ dbUserData: selectedDoctor, isLoadingProfile: false });
                    }
                }
            } catch (error) {
                console.error("Error loading profile from DB:", error);
                this.setState({ dbUserData: selectedDoctor, isLoadingProfile: false });
            }
        } else {
            this.setState({ showProfileDrawer: !this.state.showProfileDrawer });
        }
    }

    getArrDays = () => {
        const language = this.props.language || 'vi';
        let allDays = [];
        for (let i = 0; i < 30; i++) {
            let object = {};
            if (i === 0) {
                let ddMM = moment(new Date()).format('DD/MM');
                let todayVi = `Hôm nay - ${ddMM}`;
                let todayEn = `Today - ${ddMM}`;
                object.label = language === 'vi' ? todayVi : todayEn;
            } else {
                let label = moment(new Date()).add(i, 'days').locale(language).format('ddd - DD/MM');
                object.label = label.charAt(0).toUpperCase() + label.slice(1);
            }

            object.value = moment(new Date()).add(i, 'days').startOf('day').valueOf();
            allDays.push(object);
        }
        return allDays;
    }

    handleOpenScheduleSelector = () => {
        const dates = this.getArrDays();
        if (dates.length > 0) {
            this.setState({
                showScheduleSelector: true,
                scheduleDates: dates,
                selectedScheduleDate: dates[0].value,
                selectedScheduleSlot: null,
                scheduleSlots: []
            }, () => {
                this.loadScheduleSlots(dates[0].value);
            });
        }
    }

    loadScheduleSlots = async (date) => {
        const { userInfo } = this.props;
        if (!userInfo || !userInfo.id) return;

        this.setState({ isLoadingScheduleSlots: true });
        try {
            let res = await getScheduleByDate(userInfo.id, date);
            if (res && res.errCode === 0) {
                const slots = res.data ? res.data.filter(item => item.isFull !== true) : [];
                this.setState({
                    scheduleSlots: slots,
                    isLoadingScheduleSlots: false
                });
            } else {
                this.setState({
                    scheduleSlots: [],
                    isLoadingScheduleSlots: false
                });
            }
        } catch (e) {
            console.error("Error loading doctor schedule slots:", e);
            this.setState({
                scheduleSlots: [],
                isLoadingScheduleSlots: false
            });
        }
    }

    handleChangeScheduleDate = (e) => {
        const dateVal = e.target.value;
        this.setState({
            selectedScheduleDate: dateVal,
            selectedScheduleSlot: null,
            scheduleSlots: []
        }, () => {
            this.loadScheduleSlots(dateVal);
        });
    }

    handleSelectScheduleSlot = (slot) => {
        this.setState({ selectedScheduleSlot: slot });
    }

    handleSendScheduleSuggestion = () => {
        const { selectedScheduleSlot, selectedScheduleDate } = this.state;
        const { userInfo, onSendCustomMessage } = this.props;
        if (!selectedScheduleSlot || !userInfo || !onSendCustomMessage) return;

        const schedulePayload = {
            doctorId: userInfo.id,
            date: selectedScheduleDate,
            timeType: selectedScheduleSlot.timeType
        };

        const customMessageText = `[APPOINTMENT_SCHEDULE]${JSON.stringify(schedulePayload)}`;
        onSendCustomMessage(customMessageText);

        this.setState({
            showScheduleSelector: false,
            selectedScheduleSlot: null
        });
    }

    handleOpenBookingModalFromCard = (slotObj) => {
        this.setState({
            isBookingModalOpen: true,
            bookingModalData: slotObj
        });
    }

    loadHeaderUserData = async (selectedDoctor) => {
        if (!selectedDoctor || selectedDoctor.isAI || !selectedDoctor.id) {
            this.setState({ dbUserData: null });
            return;
        }
        try {
            const { userInfo } = this.props;
            let res;
            if (userInfo && userInfo.roleId === 'R2') {
                // Doctor viewing Patient
                res = await getAllUsers(selectedDoctor.id);
                if (res && res.errCode === 0) {
                    this.setState({ dbUserData: res.users });
                }
            } else {
                // Patient viewing Doctor
                res = await getDetailDoctorByIdService(selectedDoctor.id);
                if (res && res.errCode === 0) {
                    this.setState({ dbUserData: res.data });
                }
            }
        } catch (e) {
            console.error("Error pre-loading header user data:", e);
        }
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
        if (this.props.selectedDoctor) {
            this.loadHeaderUserData(this.props.selectedDoctor);
        }
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (this.reactionRef && this.reactionRef.current && !this.reactionRef.current.contains(event.target)) {
            this.setState({ showReactionFor: null });
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.messages !== this.props.messages) {
            this.props.messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }

        // Tự động reset chiều cao textarea khi nội dung bị xóa (sau khi gửi)
        if (prevProps.inputText && !this.props.inputText) {
            if (this.textareaRef.current) {
                this.textareaRef.current.style.height = '40px';
            }
        }

        if (prevProps.selectedDoctor?.id !== this.props.selectedDoctor?.id) {
            this.loadHeaderUserData(this.props.selectedDoctor);
        }

        if (prevProps.isOpen === false && this.props.isOpen === true) {
            this.setState({ isBannerHidden: false });
        }
    }

    render() {
        const {
            isSidebarHidden,
            onToggleSidebar,
            filterTab,
            selectedDoctor,
            userInfo,
            messages,
            inputText,
            previewImage,
            isAutoReplyActive,
            quickReplies,
            isAITyping,
            messagesEndRef,
            onMarkAsRead,
            handleOnChangeImage,
            handleSelectQuickReply,
            handleToggleAutoReply,
            handleInputChange,
            handleKeyDown,
            handleSend,
            onClearImage,
            showConfirmDelete,
            onCancelDelete,
            onConfirmDeleteConversation,
            replyingTo,
            onSetReply,
            onCancelReply,
            onClose,
            language
        } = this.props;

        const isAIMode = selectedDoctor?.isAI;

        return (
            <div className="dcd-chat-main-wrapper">
                <div className={`dcd-chat-area ${this.state.showProfileDrawer ? 'dcd-chat-area-hidden' : ''}`}>
                    {selectedDoctor ? (
                        <>
                            <div className="dcd-chat-header">
                                <div
                                    className="dcd-header-info"
                                    onClick={this.handleShowDoctorProfile}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {isSidebarHidden && (
                                        <button
                                            className="dcd-action-btn show-sidebar-btn mobile-back-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onToggleSidebar();
                                            }}
                                            title="Quay lại danh sách"
                                        >
                                            <i className="fas fa-chevron-left"></i>
                                        </button>

                                    )}
                                    <div className="dcd-header-avatar-wrap">
                                        {isAIMode ? (
                                            <div className="dcd-header-avatar-placeholder ai"><i className="fas fa-robot"></i></div>
                                        ) : (selectedDoctor.image || selectedDoctor.avatar) ? (
                                            <img className="dcd-header-avatar" src={selectedDoctor.image || selectedDoctor.avatar} alt="Avatar" />
                                        ) : (
                                            <div className="dcd-header-avatar-placeholder"><i className="fas fa-user-md"></i></div>
                                        )}
                                        <span className="dcd-status-dot online"></span>
                                    </div>
                                    <div className="dcd-header-text">
                                        <div className="dcd-header-name">
                                            {isAIMode ? 'AI Support Assistant' : (
                                                selectedDoctor.name ? selectedDoctor.name : (
                                                    (selectedDoctor.lastName || selectedDoctor.firstName)
                                                        ? `${selectedDoctor.lastName || ''} ${selectedDoctor.firstName || ''}`
                                                        : 'Bác sĩ'
                                                )
                                            )}
                                        </div>
                                        <div className="dcd-header-status">{isAIMode ? 'Sẵn sàng hỗ trợ 24/7' : 'Đang trực tuyến'}</div>
                                    </div>
                                </div>
                                <div className="dcd-header-actions">
                                    {!isAIMode && (this.state.dbUserData?.phonenumber || selectedDoctor.phonenumber) && (
                                        <a
                                            href={`tel:${this.state.dbUserData?.phonenumber || selectedDoctor.phonenumber}`}
                                            className="dcd-action-btn phone-btn"
                                            title={`Gọi điện thoại trực tiếp cho ${selectedDoctor.lastName || ''} ${selectedDoctor.firstName || ''}`}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <i className="fas fa-phone-alt"></i>
                                        </a>
                                    )}
                                    <button
                                        className="dcd-action-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            this.handleShowDoctorProfile();
                                        }}
                                        title="Xem thông tin chi tiết"
                                    >
                                        <i className="fas fa-info-circle"></i>
                                    </button>
                                </div>
                            </div>

                            {userInfo && userInfo.roleId === 'R3' && !this.state.isBannerHidden && (
                                <div className="dcd-emergency-banner">
                                    <i className="fas fa-exclamation-triangle"></i>
                                    <span>{this.props.language === 'vi'
                                        ? 'Lưu ý: Nền tảng tư vấn từ xa không dùng cho các trường hợp cấp cứu. Nếu bạn đang gặp tình trạng nguy hiểm đến tính mạng, vui lòng gọi ngay 115 hoặc đến cơ sở y tế gần nhất.'
                                        : 'Notice: Telehealth consulting is not for emergencies. If you are experiencing a life-threatening medical situation, please call emergency services immediately or go to the nearest hospital.'}</span>
                                    <button
                                        className="close-banner-btn"
                                        onClick={() => this.setState({ isBannerHidden: true })}
                                        title={this.props.language === 'vi' ? 'Đóng' : 'Close'}
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            )}

                            <div className="dcd-messages" onClick={onMarkAsRead} ref={this.reactionRef}>
                                {(() => {
                                    let lastSentIndex = -1;
                                    for (let i = messages.length - 1; i >= 0; i--) {
                                        if (messages[i] && userInfo && Number(messages[i].senderId) === Number(userInfo.id)) {
                                            lastSentIndex = i;
                                            break;
                                        }
                                    }
                                    return (
                                        <>
                                            {messages.map((msg, index) => {
                                                const prevMsg = messages[index - 1];
                                                const nextMsg = messages[index + 1];

                                                // Logic Messenger: Nhận diện vị trí trong khối để bo góc
                                                const isFirstInBlock = !prevMsg ||
                                                    Number(prevMsg.senderId) !== Number(msg.senderId) ||
                                                    (new Date(msg.createdAt) - new Date(prevMsg.createdAt) > 5 * 60 * 1000);

                                                const isLastInBlock = !nextMsg ||
                                                    Number(nextMsg.senderId) !== Number(msg.senderId) ||
                                                    (new Date(nextMsg.createdAt) - new Date(msg.createdAt) > 5 * 60 * 1000);

                                                // Logic Messenger: Hiện giờ ở giữa nếu cách nhau > 15 phút hoặc là tin nhắn đầu tiên
                                                const showTimeDivider = !prevMsg ||
                                                    (new Date(msg.createdAt) - new Date(prevMsg.createdAt) > 5 * 60 * 1000);

                                                let messageReactions = [];
                                                if (msg.reactions) {
                                                    try {
                                                        messageReactions = JSON.parse(msg.reactions);
                                                    } catch (e) {
                                                        messageReactions = [];
                                                    }
                                                }

                                                return (
                                                    <React.Fragment key={msg.id}>
                                                        {showTimeDivider && (
                                                            <div className="dcd-time-divider">
                                                                {new Date(msg.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                            </div>
                                                        )}
                                                        <div
                                                            className={`dcd-msg dcd-msg--${msg.type}`}
                                                            style={{ marginBottom: isLastInBlock ? '12px' : '1px' }}
                                                        >
                                                            {msg.type === 'system' ? (
                                                                <div className="dcd-system-msg">{msg.text}</div>
                                                            ) : (
                                                                <>
                                                                    {!isAIMode && msg.type === 'doctor' && (
                                                                        <div className="dcd-msg-avatar-wrap">
                                                                            {isLastInBlock ? (
                                                                                selectedDoctor.image ? (
                                                                                    <img className="dcd-msg-avatar" src={selectedDoctor.image} alt="Avatar" />
                                                                                ) : (
                                                                                    <div className="dcd-msg-avatar-placeholder"><i className="fas fa-user-md"></i></div>
                                                                                )
                                                                            ) : (
                                                                                <div className="dcd-msg-avatar-empty" style={{ width: '28px' }}></div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                    <div className="dcd-bubble-container">
                                                                        {msg.parentData && (
                                                                            <div className="dcd-quoted-msg">
                                                                                <div className="quoted-sender">
                                                                                    <i className="fas fa-reply"></i>
                                                                                    {Number(msg.parentData.senderId) === Number(userInfo.id) ? 'Bạn' : (isAIMode ? 'AI' : selectedDoctor.firstName)}
                                                                                </div>
                                                                                <div className="quoted-text">
                                                                                    {msg.parentData.image ? '[Hình ảnh]' : msg.parentData.text}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        <div className={`dcd-bubble ${isFirstInBlock ? 'is-first' : ''} ${isLastInBlock ? 'is-last' : ''}`}>
                                                                            {msg.isTyping ? (
                                                                                <div className="dcd-typing-indicator">
                                                                                    <span></span><span></span><span></span>
                                                                                </div>
                                                                            ) : (
                                                                                <>
                                                                                    {msg.image && (
                                                                                        <div className="dcd-msg-image-wrap">
                                                                                            <img src={msg.image} alt="Sent" className="dcd-msg-image" />
                                                                                        </div>
                                                                                    )}
                                                                                    {msg.text && (() => {
                                                                                        let isAppointmentSchedule = false;
                                                                                        let scheduleData = null;
                                                                                        let cleanText = msg.text;

                                                                                        let isAiSearchData = false;
                                                                                        let aiSearchData = null;

                                                                                        if (cleanText.includes('[AI_ACTION_DATA]')) {
                                                                                            const regex = /\[AI_ACTION_DATA\]([\s\S]*?)\[\/AI_ACTION_DATA\]/g;
                                                                                            const match = regex.exec(cleanText);
                                                                                            if (match) {
                                                                                                try {
                                                                                                    aiSearchData = JSON.parse(match[1]);
                                                                                                    isAiSearchData = true;
                                                                                                    cleanText = cleanText.replace(match[0], '');
                                                                                                } catch (e) {
                                                                                                    console.error("Error parsing AI Action JSON:", e);
                                                                                                }
                                                                                            } else {
                                                                                                // Xoá text cũ nếu bị lỗi
                                                                                                cleanText = cleanText.replace(/\[AI_ACTION_DATA\][\s\S]*/g, '');
                                                                                            }
                                                                                        }

                                                                                        if (cleanText.startsWith('[APPOINTMENT_SCHEDULE]')) {
                                                                                            try {
                                                                                                scheduleData = JSON.parse(cleanText.replace('[APPOINTMENT_SCHEDULE]', ''));
                                                                                                isAppointmentSchedule = true;
                                                                                                cleanText = '';
                                                                                            } catch (e) {
                                                                                                console.error("Error parsing appointment JSON:", e);
                                                                                            }
                                                                                        }

                                                                                        if (isAppointmentSchedule && scheduleData) {
                                                                                            return (
                                                                                                <AppointmentCard
                                                                                                    doctorId={scheduleData.doctorId}
                                                                                                    date={scheduleData.date}
                                                                                                    timeType={scheduleData.timeType}
                                                                                                    language={this.props.language}
                                                                                                    userInfo={userInfo}
                                                                                                    onBook={this.handleOpenBookingModalFromCard}
                                                                                                    onLoadComplete={() => {
                                                                                                        if (this.props.messagesEndRef && this.props.messagesEndRef.current) {
                                                                                                            this.props.messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
                                                                                                        }
                                                                                                    }}
                                                                                                />
                                                                                            );
                                                                                        }

                                                                                        const renderAiCards = () => {
                                                                                            if (!isAiSearchData || !aiSearchData || !aiSearchData.data) return null;
                                                                                            const { doctors, clinics, specialties, handbooks } = aiSearchData.data;
                                                                                            
                                                                                            return (
                                                                                                <div className="ai-search-results-wrapper">
                                                                                                    {doctors && doctors.length > 0 && (
                                                                                                        <div className="ai-doctors-list">
                                                                                                            <div className="ai-list-title"><i className="fas fa-user-md"></i> {language === 'vi' ? 'Bác sĩ gợi ý' : 'Suggested Doctors'}</div>
                                                                                                            <div className="ai-cards-container">
                                                                                                                {doctors.map(doc => (
                                                                                                                    <div className="ai-doctor-card" key={`doc-${doc.id}`} onClick={() => this.props.navigate(`/detail-doctor/${doc.id}`)}>
                                                                                                                        <div className="ai-doc-avatar">
                                                                                                                            {doc.image ? (
                                                                                                                                <img src={doc.image} alt={doc.lastName} />
                                                                                                                            ) : (
                                                                                                                                <i className="fas fa-user-md"></i>
                                                                                                                            )}
                                                                                                                        </div>
                                                                                                                        <div className="ai-doc-info">
                                                                                                                            <div className="ai-doc-name">{doc.lastName} {doc.firstName}</div>
                                                                                                                            <button className="ai-doc-btn">{language === 'vi' ? 'Xem chi tiết' : 'View Details'}</button>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                ))}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    )}
                                                                                                    
                                                                                                    {specialties && specialties.length > 0 && (
                                                                                                        <div className="ai-doctors-list">
                                                                                                            <div className="ai-list-title"><i className="fas fa-stethoscope"></i> {language === 'vi' ? 'Chuyên khoa phù hợp' : 'Suggested Specialties'}</div>
                                                                                                            <div className="ai-cards-container">
                                                                                                                {specialties.map(spec => (
                                                                                                                    <div className="ai-doctor-card" key={`spec-${spec.id}`} onClick={() => this.props.navigate(`/detail-specialty/${spec.id}`)}>
                                                                                                                        <div className="ai-doc-avatar rounded">
                                                                                                                            {spec.image ? (
                                                                                                                                <img src={spec.image} alt={spec.name} />
                                                                                                                            ) : (
                                                                                                                                <i className="fas fa-stethoscope"></i>
                                                                                                                            )}
                                                                                                                        </div>
                                                                                                                        <div className="ai-doc-info">
                                                                                                                            <div className="ai-doc-name">{spec.name}</div>
                                                                                                                            <button className="ai-doc-btn">{language === 'vi' ? 'Xem chi tiết' : 'View Details'}</button>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                ))}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    )}

                                                                                                    {clinics && clinics.length > 0 && (
                                                                                                        <div className="ai-doctors-list">
                                                                                                            <div className="ai-list-title"><i className="far fa-hospital"></i> {language === 'vi' ? 'Cơ sở y tế' : 'Suggested Clinics'}</div>
                                                                                                            <div className="ai-cards-container">
                                                                                                                {clinics.map(clinic => (
                                                                                                                    <div className="ai-doctor-card" key={`clinic-${clinic.id}`} onClick={() => this.props.navigate(`/detail-clinic/${clinic.id}`)}>
                                                                                                                        <div className="ai-doc-avatar rounded">
                                                                                                                            {clinic.image ? (
                                                                                                                                <img src={clinic.image} alt={clinic.name} />
                                                                                                                            ) : (
                                                                                                                                <i className="far fa-hospital"></i>
                                                                                                                            )}
                                                                                                                        </div>
                                                                                                                        <div className="ai-doc-info">
                                                                                                                            <div className="ai-doc-name">{clinic.name}</div>
                                                                                                                            <button className="ai-doc-btn">{language === 'vi' ? 'Xem chi tiết' : 'View Details'}</button>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                ))}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    )}
                                                                                                    
                                                                                                    {handbooks && handbooks.length > 0 && (
                                                                                                        <div className="ai-doctors-list">
                                                                                                            <div className="ai-list-title"><i className="fas fa-book-medical"></i> {language === 'vi' ? 'Bài viết liên quan' : 'Related Articles'}</div>
                                                                                                            <div className="ai-cards-container">
                                                                                                                {handbooks.map(article => (
                                                                                                                    <div className="ai-doctor-card" key={`hb-${article.id}`} onClick={() => this.props.navigate(`/detail-handbook/${article.id}`)}>
                                                                                                                        <div className="ai-doc-avatar rounded">
                                                                                                                            {article.image ? (
                                                                                                                                <img src={article.image} alt={article.name} />
                                                                                                                            ) : (
                                                                                                                                <i className="fas fa-book-medical"></i>
                                                                                                                            )}
                                                                                                                        </div>
                                                                                                                        <div className="ai-doc-info">
                                                                                                                            <div className="ai-doc-name multiline">{article.name}</div>
                                                                                                                            <button className="ai-doc-btn">{language === 'vi' ? 'Đọc bài viết' : 'Read Article'}</button>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                ))}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    )}
                                                                                                </div>
                                                                                            );
                                                                                        };

                                                                                        return (
                                                                                            <>
                                                                                                {cleanText && (
                                                                                                    <div
                                                                                                        className="dcd-text markdown-content"
                                                                                                        dangerouslySetInnerHTML={{ __html: mdParser.render(cleanText) }}
                                                                                                    />
                                                                                                )}
                                                                                                {renderAiCards()}
                                                                                            </>
                                                                                        );
                                                                                    })()}

                                                                                    {messageReactions.length > 0 && (
                                                                                        <div className="dcd-bubble-reactions"
                                                                                            onClick={(e) => {
                                                                                                e.stopPropagation();
                                                                                                const myReaction = messageReactions.find(r => Number(r.userId) === Number(userInfo.id));
                                                                                                if (myReaction) {
                                                                                                    this.props.onUpdateReaction(msg.id, myReaction.reaction);
                                                                                                }
                                                                                            }}
                                                                                            title="Gỡ cảm xúc"
                                                                                        >
                                                                                            {messageReactions.map((r, i) => {
                                                                                                const reactionObj = REACTION_LIST.find(item => item.id === r.reaction);
                                                                                                return (
                                                                                                    <span key={i} className="dcd-reaction-img-wrap">
                                                                                                        {reactionObj ? <img src={reactionObj.img} alt={reactionObj.alt} /> : r.reaction}
                                                                                                    </span>
                                                                                                );
                                                                                            })}
                                                                                        </div>
                                                                                    )}
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                        {!isAIMode && !msg.isTyping && (
                                                                            <div className="dcd-msg-actions">
                                                                                <button
                                                                                    className="dcd-msg-action-btn"
                                                                                    onClick={() => this.setState({ showReactionFor: msg.id })}
                                                                                    title="Cảm xúc"
                                                                                >
                                                                                    <i className="far fa-smile"></i>
                                                                                </button>
                                                                                <button
                                                                                    className="dcd-msg-action-btn"
                                                                                    onClick={() => onSetReply(msg)}
                                                                                    title="Trả lời"
                                                                                >
                                                                                    <i className="fas fa-reply"></i>
                                                                                </button>

                                                                                {this.state.showReactionFor === msg.id && (
                                                                                    <div className="dcd-reaction-popover">
                                                                                        {REACTION_LIST.map(item => (
                                                                                            <span
                                                                                                key={item.id}
                                                                                                onClick={() => {
                                                                                                    this.props.onUpdateReaction(msg.id, item.id);
                                                                                                    this.setState({ showReactionFor: null });
                                                                                                }}
                                                                                                className="dcd-popover-item"
                                                                                            >
                                                                                                <img src={item.img} alt={item.alt} />
                                                                                            </span>
                                                                                        ))}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </>
                                                            )}
                                                            {index === lastSentIndex && Number(msg.isRead) === 1 && !isAIMode && (
                                                                <div className="dcd-seen-status">Đã xem</div>
                                                            )}
                                                            {msg.isPending && (
                                                                <div className="dcd-pending-status">
                                                                    <i className="far fa-clock"></i> Đang chờ kết nối...
                                                                </div>
                                                            )}
                                                        </div>
                                                    </React.Fragment>
                                                );
                                            })}
                                            {isAITyping && (
                                                <div className="dcd-msg dcd-msg--doctor">
                                                    <div className="dcd-bubble">
                                                        <div className="dcd-typing-indicator">
                                                            <span></span><span></span><span></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
                                <div ref={messagesEndRef} />
                            </div>

                            {replyingTo && (
                                <div className="dcd-reply-preview">
                                    <div className="reply-content">
                                        <div className="reply-title">
                                            Trả lời {Number(replyingTo.senderId) === Number(userInfo.id) ? 'chính mình' : (isAIMode ? 'AI' : selectedDoctor.firstName)}
                                        </div>
                                        <div className="reply-text">
                                            {replyingTo.image ? '[Hình ảnh]' : replyingTo.text}
                                        </div>
                                    </div>
                                    <button className="cancel-reply" onClick={onCancelReply}>
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            )}

                            <div className="dcd-input-bar">
                                <input
                                    type="file"
                                    id="chatImage"
                                    hidden
                                    onChange={handleOnChangeImage}
                                />

                                <ChatActionsMenu
                                    userInfo={userInfo}
                                    filterTab={this.props.filterTab}
                                    onSendImage={() => document.getElementById('chatImage').click()}
                                    onSelectQuickReply={handleSelectQuickReply}
                                    onToggleAutoReply={handleToggleAutoReply}
                                    isAutoReplyActive={isAutoReplyActive}
                                    quickReplies={quickReplies}
                                    onOpenScheduleSelector={this.handleOpenScheduleSelector}
                                />

                                <div className="dcd-input-container">
                                    {previewImage && (
                                        <div className="dcd-preview-wrap">
                                            <img src={previewImage} alt="Preview" />
                                            <i className="fas fa-times-circle" onClick={onClearImage}></i>
                                        </div>
                                    )}
                                    <textarea
                                        ref={this.textareaRef}
                                        className="dcd-input"
                                        placeholder="Nhắn tin cho bác sĩ..."
                                        value={inputText}
                                        rows="1"
                                        onChange={(e) => {
                                            const target = e.target;
                                            target.style.height = 'auto';
                                            target.style.height = `${target.scrollHeight}px`;
                                            handleInputChange(e);
                                        }}
                                        onKeyDown={handleKeyDown}
                                        onFocus={onMarkAsRead}
                                        onClick={onMarkAsRead}
                                    />
                                </div>

                                <button
                                    className="dcd-send-btn"
                                    onClick={handleSend}
                                    disabled={!inputText.trim() && !previewImage}
                                >
                                    <i className="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="dcd-no-chat">Chọn một bác sĩ để bắt đầu tư vấn</div>
                    )}
                </div>

                {this.state.showProfileDrawer && selectedDoctor && (
                    <div className="dcd-patient-drawer">
                        {this.state.isLoadingProfile ? (
                            <>
                                <div className="dcd-drawer-header">
                                    <div className="header-content">
                                        <h3 className="skeleton-text" style={{ width: '120px', height: '18px', background: '#e5e5ea', borderRadius: '4px' }}></h3>
                                        <button className="close-btn" onClick={() => this.setState({ showProfileDrawer: false })}>
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="dcd-drawer-body" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                                    <div className="skeleton-avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#e5e5ea' }}></div>
                                    <div className="skeleton-name" style={{ width: '180px', height: '22px', background: '#e5e5ea', borderRadius: '4px' }}></div>
                                    <div className="skeleton-info-box" style={{ width: '100%', height: '160px', background: '#f2f2f7', borderRadius: '12px' }}></div>
                                </div>
                            </>
                        ) : (() => {
                            const { dbUserData } = this.state;
                            return userInfo && userInfo.roleId === 'R2' ? (
                                // DOCTOR VIEWING PATIENT
                                <>
                                    <div className="dcd-drawer-header">
                                        <div className="header-content">
                                            <h3>Hồ sơ Bệnh nhân</h3>
                                            <button className="close-btn" onClick={() => this.setState({ showProfileDrawer: false })}>
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="dcd-drawer-body">
                                        <div className="patient-avatar-wrap">
                                            {(dbUserData?.image || selectedDoctor.image) ? (
                                                <img className="patient-avatar" src={dbUserData?.image || selectedDoctor.image} alt="Avatar" />
                                            ) : (
                                                <div className="patient-avatar-placeholder"><i className="fas fa-user"></i></div>
                                            )}
                                        </div>
                                        <div className="patient-name">
                                            {`${dbUserData?.lastName || selectedDoctor.lastName || ''} ${dbUserData?.firstName || selectedDoctor.firstName || ''}`}
                                        </div>

                                        <div className="info-section">
                                            <div className="info-item">
                                                <span className="label">Số điện thoại</span>
                                                <span className="value">{dbUserData?.phonenumber || selectedDoctor.phonenumber || 'Chưa cập nhật'}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="label">Email liên hệ</span>
                                                <span className="value">{dbUserData?.email || selectedDoctor.email || 'Chưa cập nhật'}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="label">Giới tính</span>
                                                <span className="value">
                                                    {(() => {
                                                        const g = dbUserData?.gender || selectedDoctor.gender;
                                                        return g === 'M' ? 'Nam' : g === 'F' ? 'Nữ' : 'Khác';
                                                    })()}
                                                </span>
                                            </div>
                                            <div className="info-item">
                                                <span className="label">Địa chỉ đăng ký</span>
                                                <span className="value">{dbUserData?.address || selectedDoctor.address || 'Chưa cập nhật'}</span>
                                            </div>
                                        </div>

                                        <div className="security-badge">
                                            <i className="fas fa-shield-alt"></i>
                                            <span>Thông tin bảo mật tuyệt đối theo tiêu chuẩn Bộ Y Tế. Vui lòng không chia sẻ ra ngoài.</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                // PATIENT VIEWING DOCTOR
                                <>
                                    <div className="dcd-drawer-header">
                                        <div className="header-content">
                                            <h3>Thông tin Bác sĩ</h3>
                                            <button className="close-btn" onClick={() => this.setState({ showProfileDrawer: false })}>
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="dcd-drawer-body">
                                        <div className="patient-avatar-wrap">
                                            {(dbUserData?.image || selectedDoctor.image) ? (
                                                <img className="patient-avatar" src={dbUserData?.image || selectedDoctor.image} alt="Avatar" />
                                            ) : (
                                                <div className="patient-avatar-placeholder"><i className="fas fa-user-md"></i></div>
                                            )}
                                        </div>
                                        <div className="patient-name">
                                            {`${dbUserData?.positionData ? dbUserData.positionData.valueVi : 'BS.'} ${dbUserData?.lastName || selectedDoctor.lastName || ''} ${dbUserData?.firstName || selectedDoctor.firstName || ''}`}
                                        </div>

                                        {dbUserData?.doctorinforData?.specialtyData?.name && (
                                            <div className="specialty-badge-wrap" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '-10px' }}>
                                                <span style={{ background: 'rgba(0, 113, 227, 0.08)', color: '#0071e3', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: '600' }}>
                                                    {dbUserData.doctorinforData.specialtyData.name}
                                                </span>
                                            </div>
                                        )}

                                        <div className="info-section">
                                            {dbUserData?.doctorinforData?.clinicData?.name && (
                                                <div className="info-item">
                                                    <span className="label">Bệnh viện / Phòng khám</span>
                                                    <span className="value" style={{ fontWeight: '600', color: '#0071e3' }}>
                                                        {dbUserData.doctorinforData.clinicData.name}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="info-item">
                                                <span className="label">Địa chỉ phòng khám</span>
                                                <span className="value">{dbUserData?.address || selectedDoctor.address || 'Chưa cập nhật'}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="label">Số điện thoại hỗ trợ</span>
                                                <span className="value">{dbUserData?.phonenumber || selectedDoctor.phonenumber || 'Chưa cập nhật'}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="label">Email liên lạc</span>
                                                <span className="value">{dbUserData?.email || selectedDoctor.email || 'Chưa cập nhật'}</span>
                                            </div>
                                            {dbUserData?.doctorinforData?.priceTypeData?.valueVi && (
                                                <div className="info-item">
                                                    <span className="label">Giá khám tham khảo</span>
                                                    <span className="value" style={{ color: '#ff3b30', fontWeight: '600' }}>
                                                        {dbUserData.doctorinforData.priceTypeData.valueVi}
                                                    </span>
                                                </div>
                                            )}
                                            {dbUserData?.doctorinforData?.paymentTypeData?.valueVi && (
                                                <div className="info-item">
                                                    <span className="label">Phương thức thanh toán</span>
                                                    <span className="value">
                                                        {dbUserData.doctorinforData.paymentTypeData.valueVi}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {dbUserData?.markdownData?.description && (
                                            <div className="info-section" style={{ background: '#f5f5f7' }}>
                                                <div className="info-item" style={{ gap: '6px' }}>
                                                    <span className="label">Giới thiệu ngắn</span>
                                                    <span className="value" style={{ fontSize: '13px', lineHeight: '1.5', fontStyle: 'italic', color: '#515154' }}>
                                                        {dbUserData.markdownData.description}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="submit-container" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                                            <button
                                                className="submit"
                                                style={{ width: '100%', height: '40px', background: '#0071e3', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                                                onClick={() => {
                                                    this.props.onClose();
                                                    this.props.navigate(`/detail-doctor/${selectedDoctor.id}`);
                                                }}
                                            >
                                                Đặt lịch khám bệnh
                                            </button>

                                        </div>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                )}

                {this.state.showScheduleSelector && (
                    <div className="dcd-schedule-selector-overlay">
                        <div className="dcd-schedule-selector-popup">
                            <div className="selector-header">
                                <h3>Đề xuất lịch khám bệnh</h3>
                                <button
                                    className="close-selector-btn"
                                    onClick={() => this.setState({ showScheduleSelector: false, selectedScheduleSlot: null })}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                            <div className="selector-body">
                                <div className="selector-field">
                                    <label>Chọn ngày đề xuất:</label>
                                    <select
                                        value={this.state.selectedScheduleDate}
                                        onChange={this.handleChangeScheduleDate}
                                    >
                                        {this.state.scheduleDates.map((item, idx) => (
                                            <option key={idx} value={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="selector-field">
                                    <label>Chọn khung giờ trống:</label>
                                    {this.state.isLoadingScheduleSlots ? (
                                        <div className="selector-loading">
                                            <i className="fas fa-spinner fa-spin"></i> Đang tìm lịch khám...
                                        </div>
                                    ) : this.state.scheduleSlots.length > 0 ? (
                                        <div className="slots-grid">
                                            {this.state.scheduleSlots.map((slot, idx) => {
                                                const isSelected = this.state.selectedScheduleSlot?.id === slot.id;
                                                return (
                                                    <button
                                                        key={idx}
                                                        className={`slot-pill ${isSelected ? 'selected' : ''}`}
                                                        onClick={() => this.handleSelectScheduleSlot(slot)}
                                                    >
                                                        {this.props.language === 'vi' ? slot.timeTypeData?.valueVi : slot.timeTypeData?.valueEn}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="no-slots-alert">
                                            <i className="fas fa-exclamation-circle"></i> Bác sĩ chưa đăng ký lịch khám cho ngày này. Vui lòng chọn ngày khác hoặc cập nhật lịch trước.
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="selector-footer">
                                <button
                                    className="send-proposal-btn"
                                    disabled={!this.state.selectedScheduleSlot}
                                    onClick={this.handleSendScheduleSuggestion}
                                >
                                    Gửi đề xuất lịch khám
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {this.state.isBookingModalOpen && this.state.bookingModalData && (
                    <BookingModal
                        isTheModalOpen={this.state.isBookingModalOpen}
                        closeModal={() => this.setState({ isBookingModalOpen: false })}
                        dataTimeModal={this.state.bookingModalData}
                        doctorId={this.state.bookingModalData?.doctorId || ''}
                    />
                )}
            </div>
        );
    }
}

export default withRouter(ChatBox);
