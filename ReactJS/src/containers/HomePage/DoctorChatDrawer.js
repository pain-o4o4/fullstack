import React, { Component } from 'react';
import './DoctorChatDrawer.scss';

const MOCK_DOCTORS = [
    {
        id: 1,
        name: 'BS. Nguyễn Văn Mai',
        specialty: 'Nội tổng quát',
        avatar: 'https://img.icons8.com/color/96/doctor-male.png',
        online: true,
    },
    {
        id: 2,
        name: 'BS. Trần Thị Lan',
        specialty: 'Tim mạch',
        avatar: 'https://img.icons8.com/color/96/doctor-female.png',
        online: true,
    },
    {
        id: 3,
        name: 'BS. Lê Minh Tuấn',
        specialty: 'Cơ xương khớp',
        avatar: 'https://img.icons8.com/color/96/doctor-male--v1.png',
        online: false,
    },
    {
        id: 4,
        name: 'BS. Phạm Thu Hà',
        specialty: 'Nhi khoa',
        avatar: 'https://img.icons8.com/color/96/caduceus.png',
        online: true,
    },
];

const MOCK_CHAT = [
    {
        id: 1,
        type: 'doctor',
        text: 'Chào bạn! Tôi có thể hỗ trợ giải đáp gì về triệu chứng của bạn hôm nay?',
        time: '09:01',
    },
    {
        id: 2,
        type: 'patient',
        text: 'Tôi bị nhức mỏi cổ vai gáy mấy hôm nay, không rõ nguyên nhân...',
        time: '09:02',
    },
    {
        id: 3,
        type: 'system',
        text: '📅 Lịch hẹn của bạn với bác sĩ này đã được xác nhận vào ngày mai lúc 10:00.',
        time: '09:03',
    },
    {
        id: 4,
        type: 'doctor',
        text: 'Tôi hiểu. Bạn nên thực hiện một số bài tập giãn cơ nhẹ và tránh ngồi sai tư thế. Nếu kéo dài hơn 3 ngày, hãy đặt lịch khám để tôi kiểm tra thêm nhé!',
        time: '09:04',
    },
];

class DoctorChatDrawer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDoctor: MOCK_DOCTORS[0],
            inputText: '',
            messages: MOCK_CHAT,
        };
        this.messagesEndRef = React.createRef();
    }

    componentDidUpdate(prevProps) {
        if (this.props.isOpen && !prevProps.isOpen) {
            this.scrollToBottom();
        }
    }

    scrollToBottom = () => {
        if (this.messagesEndRef.current) {
            this.messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }

    handleSelectDoctor = (doctor) => {
        this.setState({ selectedDoctor: doctor });
        setTimeout(this.scrollToBottom, 100);
    }

    handleSend = () => {
        const { inputText, messages } = this.state;
        if (!inputText.trim()) return;

        const newMsg = {
            id: Date.now(),
            type: 'patient',
            text: inputText.trim(),
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        };

        this.setState(
            { messages: [...messages, newMsg], inputText: '' },
            () => {
                this.scrollToBottom();
                // Simulate doctor reply after 1s
                setTimeout(() => {
                    const reply = {
                        id: Date.now() + 1,
                        type: 'doctor',
                        text: 'Cảm ơn bạn đã chia sẻ. Tôi sẽ xem xét và phản hồi sớm nhất có thể!',
                        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                    };
                    this.setState(
                        { messages: [...this.state.messages, reply] },
                        this.scrollToBottom
                    );
                }, 1000);
            }
        );
    }

    handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.handleSend();
        }
    }

    render() {
        const { isOpen, onClose } = this.props;
        const { selectedDoctor, inputText, messages } = this.state;

        return (
            <>
                {/* Overlay */}
                <div
                    className={`dcd-overlay ${isOpen ? 'visible' : ''}`}
                    onClick={onClose}
                />

                {/* Drawer Panel */}
                <div className={`dcd-drawer ${isOpen ? 'open' : ''}`}>
                    {/* Header */}
                    <div className="dcd-header">
                        <div className="dcd-header-info">
                            <div className="dcd-header-icon">
                                <i className="far fa-comments"></i>
                            </div>
                            <div>
                                <div className="dcd-header-title">Chat Bác sĩ</div>
                                <div className="dcd-header-sub">
                                    {MOCK_DOCTORS.filter(d => d.online).length} bác sĩ đang trực tuyến
                                </div>
                            </div>
                        </div>
                        <button className="dcd-close-btn" onClick={onClose}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    <div className="dcd-body">
                        {/* Sidebar: Doctor List */}
                        <div className="dcd-sidebar">
                            {MOCK_DOCTORS.map(doc => (
                                <div
                                    key={doc.id}
                                    className={`dcd-doc-item ${selectedDoctor.id === doc.id ? 'active' : ''}`}
                                    onClick={() => this.handleSelectDoctor(doc)}
                                >
                                    <div className="dcd-doc-avatar-wrap">
                                        <img src={doc.avatar} alt={doc.name} className="dcd-doc-avatar" />
                                        <span className={`dcd-online-dot ${doc.online ? 'online' : 'offline'}`}></span>
                                    </div>
                                    <div className="dcd-doc-info">
                                        <div className="dcd-doc-name">{doc.name}</div>
                                        <div className="dcd-doc-specialty">{doc.specialty}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Chat Area */}
                        <div className="dcd-chat-area">
                            <div className="dcd-chat-doctor-bar">
                                <img src={selectedDoctor.avatar} alt={selectedDoctor.name} className="dcd-mini-avatar" />
                                <div>
                                    <div className="dcd-chat-doctor-name">{selectedDoctor.name}</div>
                                    <div className="dcd-chat-doctor-spec">{selectedDoctor.specialty}</div>
                                </div>
                                <span className={`dcd-status-badge ${selectedDoctor.online ? 'online' : 'offline'}`}>
                                    {selectedDoctor.online ? '● Trực tuyến' : '○ Ngoại tuyến'}
                                </span>
                            </div>

                            <div className="dcd-messages">
                                {messages.map(msg => (
                                    <div key={msg.id} className={`dcd-msg dcd-msg--${msg.type}`}>
                                        {msg.type === 'system' ? (
                                            <div className="dcd-system-msg">{msg.text}</div>
                                        ) : (
                                            <div className="dcd-bubble">
                                                <span className="dcd-text">{msg.text}</span>
                                                <span className="dcd-time">{msg.time}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div ref={this.messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="dcd-input-bar">
                                <input
                                    type="text"
                                    className="dcd-input"
                                    placeholder="Nhập tin nhắn..."
                                    value={inputText}
                                    onChange={e => this.setState({ inputText: e.target.value })}
                                    onKeyDown={this.handleKeyDown}
                                />
                                <button className="dcd-send-btn" onClick={this.handleSend}>
                                    <i className="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default DoctorChatDrawer;
