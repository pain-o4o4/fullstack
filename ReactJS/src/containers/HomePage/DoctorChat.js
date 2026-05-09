import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import { sendMessageApi, getMessagesApi, getChatHistorySidebarApi, searchUsersForChatApi, deleteConversationApi, markMessagesAsReadApi } from '../../services/userService';
import { toast } from 'react-toastify';
import { CommonUtils } from '../../utils';
import './DoctorChat.scss';

const MOCK_CHAT = [];

class DoctorChat extends Component {
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
            searchResult: [],
            selectedImage: '',
            previewImage: '',
            filterTab: 'ALL',
            showConfirmDelete: false,
            partnerIdToDelete: null
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
            socket.off('messages_marked_as_read');
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
                    listDoctors: doctors
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
            const senderId = Number(data.senderId);
            const receiverId = Number(data.receiverId);
            const currentSelectedId = Number(selectedDoctor?.id);
            const currentUserId = Number(userInfo?.id);

            if (currentSelectedId && (senderId === currentSelectedId || receiverId === currentSelectedId)) {
                // Tránh trùng lặp tin nhắn nếu Server có cơ chế echo
                this.setState(prevState => {
                    const isExist = prevState.messages.some(m => Number(m.id) === Number(data.id));
                    if (isExist) return null;

                    return {
                        messages: [...prevState.messages, {
                            ...data,
                            type: senderId === currentUserId ? 'patient' : 'doctor',
                            time: new Date(data.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                        }]
                    };
                }, this.scrollToBottom);
            }
        });

        socket.on('messages_marked_as_read', (data) => {
            const { selectedDoctor } = this.state;
            const readerId = Number(data.readerId);
            const currentSelectedId = Number(selectedDoctor?.id);

            if (currentSelectedId && readerId === currentSelectedId) {
                this.setState(prevState => ({
                    messages: prevState.messages.map(msg =>
                        Number(msg.receiverId) === readerId ? { ...msg, isRead: 1 } : msg
                    )
                }));
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
                        unreadCount: item.unreadCount || 0,
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

    handleMarkAsRead = async () => {
        const { selectedDoctor } = this.state;
        const { userInfo, socket } = this.props;
        if (selectedDoctor && userInfo?.id && socket) {
            // 1. Gọi API lưu vào DB
            await markMessagesAsReadApi({
                userId: userInfo.id,
                partnerId: selectedDoctor.id
            });
            // 2. Bắn Socket báo cho đối phương
            socket.emit('mark_as_read', {
                readerId: userInfo.id,
                partnerId: selectedDoctor.id
            });
            // 3. Cập nhật local để mất badge unread (nếu cần)
            this.loadChatHistory();
        }
    }

    handleSelectDoctor = async (doctor) => {
        this.setState({ selectedDoctor: doctor }, async () => {
            this.scrollToBottom();
            await this.handleMarkAsRead();
        });
    }

    handleSend = async () => {
        const { inputText, selectedDoctor, selectedImage } = this.state;
        const { userInfo } = this.props;
        if ((!inputText.trim() && !selectedImage) || !selectedDoctor || !userInfo) return;

        let res = await sendMessageApi({
            senderId: userInfo.id,
            receiverId: selectedDoctor.id,
            text: inputText.trim(),
            image: selectedImage
        });

        if (res && res.errCode === 0) {
            this.setState({
                inputText: '',
                selectedImage: '',
                previewImage: ''
            }, this.scrollToBottom);
        } else if (res && res.errCode === 2) {
            toast.error(res.errMessage);
        }
    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                selectedImage: base64,
                previewImage: objectUrl
            });
            event.target.value = null;
        }
    }

    handleSearchChange = async (query) => {
        this.setState({ searchQuery: query });
        const { userInfo } = this.props;
        if (userInfo && userInfo.id) {
            let res = await searchUsersForChatApi(userInfo.id, query);
            if (res && res.errCode === 0 && res.data) {
                // Lọc trùng lặp dựa trên ID (đề phòng backend chưa group by)
                const seen = new Set();
                const uniqueResults = res.data.filter(item => {
                    const id = item.id || item.partner_id;
                    if (seen.has(id)) return false;
                    seen.add(id);
                    return true;
                });
                this.setState({ searchResult: uniqueResults });
            }
        }
    }

    handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            if (e.nativeEvent.isComposing) return; // Tránh gửi 2 lần khi gõ tiếng Việt
            e.preventDefault();
            this.handleSend();
        }
    }



    confirmDelete = (e, partnerId) => {
        e.stopPropagation();
        this.setState({
            showConfirmDelete: true,
            partnerIdToDelete: partnerId
        });
    }

    cancelDelete = () => {
        this.setState({
            showConfirmDelete: false,
            partnerIdToDelete: null
        });
    }

    handleDeleteConversation = async () => {
        const { partnerIdToDelete } = this.state;
        const { userInfo } = this.props;
        if (partnerIdToDelete && userInfo?.id) {
            let res = await deleteConversationApi({
                userId: userInfo.id,
                partnerId: partnerIdToDelete
            });
            if (res && res.errCode === 0) {
                this.setState(prevState => ({
                    chatHistory: prevState.chatHistory.filter(item => item.id !== partnerIdToDelete),
                    showConfirmDelete: false,
                    partnerIdToDelete: null,
                    selectedDoctor: prevState.selectedDoctor?.id === partnerIdToDelete ? null : prevState.selectedDoctor
                }));
                toast.success("Đã xóa cuộc trò chuyện");
            } else {
                toast.error("Lỗi khi xóa cuộc trò chuyện");
            }
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
                                    {/* <button className="dcd-action-btn"><i className="fas fa-edit"></i></button> */}
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
                                    <span className={`tab ${this.state.filterTab === 'ALL' ? 'active' : ''}`} onClick={() => this.setState({ filterTab: 'ALL' })}>Tất cả</span>
                                    <span className={`tab ${this.state.filterTab === 'READ' ? 'active' : ''}`} onClick={() => this.setState({ filterTab: 'READ' })}>Đã đọc</span>
                                    <span className={`tab ${this.state.filterTab === 'UNREAD' ? 'active' : ''}`} onClick={() => this.setState({ filterTab: 'UNREAD' })}>Chưa đọc</span>
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
                                                    <div className="dcd-doc-avatar" style={{ backgroundImage: `url(${d.image})` }}></div>
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
                                    this.state.chatHistory
                                        .filter(chat => {
                                            if (this.state.filterTab === 'READ') return (chat.unreadCount || 0) === 0;
                                            if (this.state.filterTab === 'UNREAD') return (chat.unreadCount || 0) > 0;
                                            return true;
                                        })
                                        .map(chat => (
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
                                                        <div className="dcd-doc-avatar" style={{ backgroundImage: `url(${chat.avatar})` }}></div>
                                                    ) : (
                                                        <div className="dcd-doc-avatar dcd-avatar-none">
                                                            <i className="fas fa-user"></i>
                                                        </div>
                                                    )}
                                                    {chat.online && <span className="dcd-online-dot online"></span>}
                                                </div>
                                                <div className="dcd-history-info">
                                                    <div className={`dcd-history-name ${chat.unreadCount > 0 ? 'unread' : ''}`}>{chat.name}</div>
                                                    <div className="dcd-history-lastmsg">
                                                        <span className={`msg-text ${chat.unreadCount > 0 ? 'unread' : ''}`}>{chat.lastMsg}</span>
                                                        <span className="msg-time"> · {chat.time}</span>
                                                    </div>
                                                </div>
                                                <div className="dcd-history-status">
                                                    <button
                                                        className="dcd-delete-chat-btn"
                                                        onClick={(e) => this.confirmDelete(e, chat.id)}
                                                        title="Xóa cuộc trò chuyện"
                                                    >
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                    {chat.unreadCount > 0 && <span className="unread-badge">{chat.unreadCount}</span>}
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
                                            <div className="dcd-mini-avatar" style={{ backgroundImage: `url(${selectedDoctor.image})` }}></div>
                                        ) : (
                                            <div className="dcd-mini-avatar dcd-avatar-none">
                                                <i className="fas fa-user"></i>
                                            </div>
                                        )}
                                        <div>
                                            <div className="dcd-chat-doctor-name">{selectedDoctor.lastName} {selectedDoctor.firstName}</div>
                                            <div className="dcd-chat-doctor-spec">
                                                {selectedDoctor.positionData?.valueVi}
                                            </div>
                                        </div>
                                        <span className="dcd-status-badge online">● Trực tuyến</span>
                                    </div>

                                    <div className="dcd-messages" onClick={this.handleMarkAsRead}>
                                        {(() => {
                                            let lastSentIndex = -1;
                                            for (let i = messages.length - 1; i >= 0; i--) {
                                                if (messages[i].senderId === userInfo.id) {
                                                    lastSentIndex = i;
                                                    break;
                                                }
                                            }
                                            return messages.map((msg, index) => (
                                                <div key={msg.id} className={`dcd-msg dcd-msg--${msg.type}`}>
                                                    {msg.type === 'system' ? (
                                                        <div className="dcd-system-msg">{msg.text}</div>
                                                    ) : (
                                                        <div className="dcd-bubble">
                                                            {msg.image && (
                                                                <div className="dcd-msg-image-wrap">
                                                                    <img src={msg.image} alt="Sent" className="dcd-msg-image" />
                                                                </div>
                                                            )}
                                                            {msg.text && <span className="dcd-text">{msg.text}</span>}
                                                            <span className="dcd-time">{msg.time}</span>
                                                        </div>
                                                    )}
                                                    {index === lastSentIndex && !!msg.isRead && (
                                                        <div className="dcd-seen-status">Đã xem</div>
                                                    )}
                                                </div>
                                            )
                                        );
                                    })()}
                                    <div ref={this.messagesEndRef} />
                                </div>

                                    <div className="dcd-input-bar">
                                        <input
                                            type="file"
                                            id="chatImage"
                                            hidden
                                            onChange={(e) => this.handleOnChangeImage(e)}
                                        />
                                        <label htmlFor="chatImage" className="dcd-add-btn">
                                            <i className="fas fa-plus-circle"></i>
                                        </label>

                                        <div className="dcd-input-container">
                                            {this.state.previewImage && (
                                                <div className="dcd-preview-wrap">
                                                    <img src={this.state.previewImage} alt="Preview" />
                                                    <i className="fas fa-times-circle" onClick={() => this.setState({ selectedImage: '', previewImage: '' })}></i>
                                                </div>
                                            )}
                                            <input
                                                type="text"
                                                className="dcd-input"
                                                placeholder="Nhắn tin cho bác sĩ..."
                                                value={inputText}
                                                onChange={e => this.setState({ inputText: e.target.value })}
                                                onKeyDown={this.handleKeyDown}
                                                onFocus={this.handleMarkAsRead}
                                                onClick={this.handleMarkAsRead}
                                            />
                                        </div>

                                        <button className="dcd-send-btn" onClick={this.handleSend} disabled={!inputText.trim() && !this.state.selectedImage}>
                                            <i className="fas fa-paper-plane"></i>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="dcd-no-chat">Chọn một bác sĩ để bắt đầu tư vấn</div>
                            )}

                            {this.state.showConfirmDelete && (
                                <div className="dcd-confirm-popup">
                                    <div className="popup-title">Xóa cuộc trò chuyện?</div>
                                    <div className="popup-desc">
                                        Mọi tin nhắn trong cuộc hội thoại này sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
                                    </div>
                                    <div className="popup-actions">
                                        <button onClick={this.cancelDelete}>Hủy</button>
                                        <button className="btn-delete" onClick={this.handleDeleteConversation}>Xóa</button>
                                    </div>
                                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorChat);
