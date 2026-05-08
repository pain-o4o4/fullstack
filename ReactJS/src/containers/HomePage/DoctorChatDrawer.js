import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import { sendMessageApi, getMessagesApi, getChatHistorySidebarApi, searchUsersForChatApi } from '../../services/userService';
import { toast } from 'react-toastify';
import './DoctorChatDrawer.scss';

const MOCK_CHAT = [];

class DoctorChatDrawer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDoctor: null,
            inputText: '',
            messages: [],
            listDoctors: [],
            isSearching: false,
            searchQuery: '',
            chatHistory: [],
            searchResult: []
        };
        this.messagesEndRef = React.createRef();
        this.socketRegistered = false;
    }

    componentDidMount() {
        this.props.fetchAllDoctors();
    }

    componentWillUnmount() {
        const { socket } = this.props;
        if (socket) {
            socket.off('receive_message');
            socket.off('update_chat_history');
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { socket, isOpen, userInfo } = this.props;

        if (isOpen && !prevProps.isOpen) {
            this.scrollToBottom();
            this.loadChatHistory();
            if (this.state.selectedDoctor) this.loadMessages();
        }

        if (socket && !this.socketRegistered && userInfo?.id) {
            this.setupSocket(socket);
        }

        if (prevProps.allDoctors !== this.props.allDoctors) {
            let doctors = this.props.allDoctors;
            if (doctors && doctors.length > 0) {
                this.setState({
                    listDoctors: doctors,
                    selectedDoctor: doctors[0]
                }, () => {
                    if (this.props.isOpen) this.loadMessages();
                })
            }
        }

        if (prevState.selectedDoctor !== this.state.selectedDoctor) {
            this.loadMessages();
        }
    }

    setupSocket = (socket) => {
        socket.on('receive_message', (data) => {
            const { selectedDoctor } = this.state;
            const { userInfo } = this.props;

            // Nếu tin nhắn thuộc cuộc hội thoại đang mở
            if (selectedDoctor && (data.senderId === selectedDoctor.id || data.receiverId === selectedDoctor.id)) {
                this.setState(prevState => ({
                    messages: [...prevState.messages, {
                        ...data,
                        type: data.senderId === userInfo.id ? 'patient' : 'doctor',
                        time: new Date(data.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                    }]
                }), this.scrollToBottom);
            }
        });

        socket.on('update_chat_history', () => {
            this.loadChatHistory();
        });

        this.socketRegistered = true;
    }

    loadChatHistory = async () => {
        const { userInfo } = this.props;
        if (userInfo && userInfo.id) {
            let res = await getChatHistorySidebarApi(userInfo.id);
            if (res && res.errCode === 0) {
                this.setState({
                    chatHistory: res.data.map(item => ({
                        id: item.partner_id,
                        name: `${item.lastName} ${item.firstName}`,
                        lastMsg: item.text,
                        time: new Date(item.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                        avatar: item.image, // Base64 image from DB
                        online: true, // Tạm thời để true
                    }))
                });
            }
        }
    }

    loadMessages = async () => {
        const { selectedDoctor } = this.state;
        const { userInfo } = this.props;
        if (selectedDoctor && userInfo && userInfo.id) {
            let res = await getMessagesApi(userInfo.id, selectedDoctor.id);
            if (res && res.errCode === 0) {
                this.setState({
                    messages: res.data.map(m => ({
                        ...m,
                        type: m.senderId === userInfo.id ? 'patient' : 'doctor',
                        time: new Date(m.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                    }))
                }, this.scrollToBottom);
            }
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

    handleSend = async () => {
        const { inputText, selectedDoctor } = this.state;
        const { userInfo } = this.props;
        if (!inputText.trim() || !selectedDoctor || !userInfo) return;

        let res = await sendMessageApi({
            senderId: userInfo.id,
            receiverId: selectedDoctor.id,
            text: inputText.trim()
        });

        if (res && res.errCode === 0) {
            this.setState({
                inputText: '',
            }, this.scrollToBottom);
        } else if (res && res.errCode === 2) {
            toast.error(res.errMessage);
        }
    }

    handleSearchChange = async (query) => {
        this.setState({ searchQuery: query });
        const { userInfo } = this.props;
        if (userInfo && userInfo.id) {
            let res = await searchUsersForChatApi(userInfo.id, query);
            if (res && res.errCode === 0) {
                this.setState({ searchResult: res.data });
            }
        }
    }

    handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.handleSend();
        }
    }

    renderAvatar = (image) => {
        if (!image) return '';

        let processedImage = image;
        // Xử lý đối tượng Buffer thô từ Sequelize/Redux {type: 'Buffer', data: [...]}
        if (image.data && Array.isArray(image.data)) {
            let binary = '';
            let bytes = new Uint8Array(image.data);
            for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            processedImage = binary;
        }

        // Nếu đã là chuỗi base64 hoàn chỉnh có tiền tố
        if (typeof processedImage === 'string' && processedImage.startsWith('data:')) {
            return processedImage;
        }

        try {
            // Nếu là chuỗi binary, chuyển sang base64
            return `data:image/jpeg;base64,${btoa(processedImage)}`;
        } catch (e) {
            // Nếu không thể btoa (có thể đã là base64 nhưng thiếu tiền tố)
            return `data:image/jpeg;base64,${processedImage}`;
        }
    }

    render() {
        const { isOpen, onClose, userInfo } = this.props;
        const { selectedDoctor, inputText, messages } = this.state;

        console.log("data Bác Sĩ", selectedDoctor, "Người dùng", userInfo);
        return (
            <>
                <div
                    className={`dcd-overlay ${isOpen ? 'visible' : ''}`}
                    onClick={onClose}
                />

                <div className={`dcd-drawer ${isOpen ? 'open' : ''}`}>
                    <div className="dcd-body">
                        <div className="dcd-sidebar">
                            <div className="dcd-sidebar-header">
                                <h2 className="dcd-sidebar-title">Đoạn chat</h2>
                                <div className="dcd-sidebar-actions">
                                    <button className="dcd-action-btn"><i className="fas fa-ellipsis-h"></i></button>
                                    <button className="dcd-action-btn"><i className="fas fa-edit"></i></button>
                                </div>
                            </div>

                            <div className="dcd-search-container">
                                <div className="dcd-search-wrapper">
                                    <i className="fas fa-search"></i>
                                    <input
                                        type="text"
                                        placeholder={userInfo?.roleId === 'R2' ? "Tìm kiếm bệnh nhân..." : "Tìm kiếm bác sĩ..."}
                                        value={this.state.searchQuery}
                                        onFocus={() => {
                                            this.setState({ isSearching: true });
                                            this.handleSearchChange('');
                                        }}
                                        onChange={(e) => this.handleSearchChange(e.target.value)}
                                    />
                                    {this.state.isSearching &&
                                        <i className="fas fa-times-circle" onClick={() => this.setState({ isSearching: false, searchQuery: '', searchResult: [] })}></i>
                                    }
                                </div>
                            </div>

                            {!this.state.isSearching && (
                                <div className="dcd-filter-tabs">
                                    <span className="tab active">Tất cả</span>
                                    <span className="tab">Chưa đọc</span>
                                    <span className="tab">Nhóm</span>
                                </div>
                            )}

                            <div className="dcd-sidebar-list">
                                {this.state.isSearching ? (
                                    // Search Mode: Show Results from API
                                    this.state.searchResult && this.state.searchResult.map(d => (
                                        <div
                                            key={d.id}
                                            className={`dcd-doc-item ${selectedDoctor && selectedDoctor.id === d.id ? 'active' : ''}`}
                                            onClick={() => {
                                                this.handleSelectDoctor(d);
                                                this.setState({ isSearching: false, searchQuery: '', searchResult: [] });
                                            }}
                                        >
                                            <div className="dcd-doc-avatar-wrap">
                                                {d.image ? (
                                                    <div className="dcd-doc-avatar" style={{ backgroundImage: `url(${this.renderAvatar(d.image)})` }}></div>
                                                ) : (
                                                    <div className="dcd-doc-avatar dcd-avatar-none">
                                                        <i className="fas fa-user"></i>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="dcd-doc-info">
                                                <div className="dcd-doc-name">{d.lastName} {d.firstName}</div>
                                                <div className="dcd-doc-specialty">{userInfo?.roleId !== 'R2' ? 'Bác sĩ' : 'Bệnh nhân'}</div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    // History Mode: Show Recent Chats
                                    this.state.chatHistory.map(chat => (
                                        <div
                                            key={chat.id}
                                            className={`dcd-chat-history-item ${selectedDoctor && selectedDoctor.id === chat.id ? 'active' : ''}`}
                                            onClick={() => this.handleSelectDoctor({
                                                id: chat.id,
                                                firstName: chat.name.split(' ').pop(),
                                                lastName: chat.name.split(' ').slice(0, -1).join(' '),
                                                image: chat.avatar
                                            })}
                                        >
                                            <div className="dcd-doc-avatar-wrap">
                                                {chat.avatar ? (
                                                    <div className="dcd-doc-avatar" style={{ backgroundImage: `url(${this.renderAvatar(chat.avatar)})` }}></div>
                                                ) : (
                                                    <div className="dcd-doc-avatar dcd-avatar-none">
                                                        <i className="fas fa-user"></i>
                                                    </div>
                                                )}
                                                {chat.online && <span className="dcd-online-dot online"></span>}
                                            </div>
                                            <div className="dcd-history-info">
                                                <div className="dcd-history-name">{chat.name}</div>
                                                <div className="dcd-history-lastmsg">
                                                    <span className="msg-text">{chat.lastMsg}</span>
                                                    <span className="msg-time"> · {chat.time}</span>
                                                </div>
                                            </div>
                                            <div className="dcd-history-status">
                                                {chat.unread && <span className="unread-dot"></span>}
                                                {chat.isMuted && <i className="fas fa-volume-mute mute-icon"></i>}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="dcd-chat-area">
                            {selectedDoctor ? (
                                <>
                                    <div className="dcd-chat-doctor-bar">
                                        {selectedDoctor.image ? (
                                            <div className="dcd-mini-avatar" style={{ backgroundImage: `url(${this.renderAvatar(selectedDoctor.image)})` }}></div>
                                        ) : (
                                            <div className="dcd-mini-avatar dcd-avatar-none">
                                                <i className="fas fa-user"></i>
                                            </div>
                                        )}
                                        <div>
                                            <div className="dcd-chat-doctor-name">{selectedDoctor.lastName} {selectedDoctor.firstName}</div>
                                            <div classNamedcd-chat-doctor-spec="">
                                                {selectedDoctor.positionData?.valueVi}
                                            </div>
                                        </div>
                                        <span className="dcd-status-badge online">● Trực tuyến</span>
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

                                    <div className="dcd-input-bar">
                                        <input
                                            type="text"
                                            className="dcd-input"
                                            placeholder="Nhắn tin cho bác sĩ..."
                                            value={inputText}
                                            onChange={e => this.setState({ inputText: e.target.value })}
                                            onKeyDown={this.handleKeyDown}
                                        />
                                        <button className="dcd-send-btn" onClick={this.handleSend}>
                                            <i className="fas fa-paper-plane"></i>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="dcd-no-chat">Chọn một bác sĩ để bắt đầu tư vấn</div>
                            )}
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        allDoctors: state.admin.allDoctors,
        userInfo: state.user.userInfo,
        socket: state.socket.socket
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorChatDrawer);
