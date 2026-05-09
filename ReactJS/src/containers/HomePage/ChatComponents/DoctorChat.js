import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import { sendMessageApi, getMessagesApi, getChatHistorySidebarApi, searchUsersForChatApi, deleteConversationApi, markMessagesAsReadApi, getQuickRepliesApi } from '../../../services/userService';
import { toast } from 'react-toastify';
import { CommonUtils } from '../../../utils';
import './DoctorChat.scss';
import ChatSidebar from './ChatSidebar';
import ChatBox from './ChatBox';

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
            partnerIdToDelete: null,
            isAutoReplyActive: false,
            quickReplies: [],
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
                    // Check trùng lặp bằng ID hoặc nội dung + thời gian (đề phòng ID chưa kịp sync)
                    const isExist = prevState.messages.some(m => 
                        (m.id && data.id && Number(m.id) === Number(data.id)) || 
                        (m.text === data.text && Number(m.senderId) === Number(data.senderId) && m.type === 'patient')
                    );
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
                    chatHistory: res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(item => ({
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

            // Lấy danh sách tin nhắn nhanh từ DB nếu là bác sĩ
            if (userInfo.roleId === 'R2') {
                try {
                    let resQR = await getQuickRepliesApi(userInfo.id);
                    if (resQR && resQR.errCode === 0 && resQR.data) {
                        this.setState({ quickReplies: resQR.data });
                    }
                } catch (error) {
                    console.warn("Backend chưa hỗ trợ API Quick Replies, sử dụng mẫu mặc định.");
                }
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
            const newMessage = {
                ...res.data,
                type: 'patient',
                time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
            };

            this.setState(prevState => ({
                messages: [...prevState.messages, newMessage],
                inputText: '',
                selectedImage: '',
                previewImage: ''
            }), () => {
                this.scrollToBottom();
                this.loadChatHistory();
            });
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



    handleSelectQuickReply = (text) => {
        this.setState({ inputText: text }, () => {
            this.handleSend();
        });
    }

    handleToggleAutoReply = () => {
        const { isAutoReplyActive } = this.state;
        this.setState({ isAutoReplyActive: !isAutoReplyActive }, () => {
            if (this.state.isAutoReplyActive) {
                console.log('Đã bật chế độ trả lời tự động');
            } else {
                console.log('Đã tắt chế độ trả lời tự động');
            }
        });
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
                        <ChatSidebar
                            userInfo={userInfo}
                            chatHistory={this.state.chatHistory}
                            selectedDoctor={selectedDoctor}
                            searchQuery={this.state.searchQuery}
                            isSearching={this.state.isSearching}
                            searchResult={this.state.searchResult}
                            filterTab={this.state.filterTab}
                            onSearchFocus={() => {
                                this.setState({ isSearching: true });
                                this.handleSearchChange('');
                            }}
                            onSearchChange={this.handleSearchChange}
                            onClearSearch={() => this.setState({ isSearching: false, searchQuery: '', searchResult: [] })}
                            onSelectDoctor={this.handleSelectDoctor}
                            onChangeFilterTab={(tab) => this.setState({ filterTab: tab })}
                            onConfirmDelete={this.confirmDelete}
                        />

                        <ChatBox
                            selectedDoctor={selectedDoctor}
                            userInfo={userInfo}
                            messages={this.state.messages}
                            inputText={this.state.inputText}
                            previewImage={this.state.previewImage}
                            isAutoReplyActive={this.state.isAutoReplyActive}
                            quickReplies={this.state.quickReplies}
                            messagesEndRef={this.messagesEndRef}
                            onMarkAsRead={this.handleMarkAsRead}
                            handleOnChangeImage={this.handleOnChangeImage}
                            handleSelectQuickReply={this.handleSelectQuickReply}
                            handleToggleAutoReply={this.handleToggleAutoReply}
                            handleInputChange={(e) => this.setState({ inputText: e.target.value })}
                            handleKeyDown={this.handleKeyDown}
                            handleSend={this.handleSend}
                            onClearImage={() => this.setState({ selectedImage: '', previewImage: '' })}
                            showConfirmDelete={this.state.showConfirmDelete}
                            onCancelDelete={this.cancelDelete}
                            onConfirmDeleteConversation={this.handleDeleteConversation}
                        />
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
