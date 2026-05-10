import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import { sendMessageApi, getMessagesApi, getChatHistorySidebarApi, searchUsersForChatApi, deleteConversationApi, markMessagesAsReadApi, getQuickRepliesApi, updateMessageReactionApi } from '../../../services/userService';
import { toast } from 'react-toastify';
import { CommonUtils } from '../../../utils';
import './DoctorChat.scss';
import ChatSidebar from './ChatSidebar';
import ChatBox from './ChatBox';
import { getChatSessions, getChatHistory, saveChatMessage, deleteChatSessionApi } from '../../../services/chatbotService';
import axios from '../../../auth/axiosInstance';
import moment from 'moment';

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
            // AI related state
            isAITyping: false,
            currentAISessionId: null,
            // Sidebar & Delete features (Bổ sung mới)
            isSidebarHidden: false,
            isSelectMode: false,
            selectedSessions: [], // Khôi phục dòng này bị xóa nhầm
            deleteType: 'single', // 'single' hoặc 'multiple'
            aiSessionsLocal: [], // Lưu trữ local để render tức thì khi xóa
            replyingTo: null, // Lưu tin nhắn đang được trả lời
        };
        this.messagesEndRef = React.createRef();
        this.socketRegistered = false;
    }

    componentDidMount() {
        const { userInfo } = this.props;
        this.props.fetchAllDoctors();
        if (userInfo && userInfo.id) {
            this.props.fetchAISessions(userInfo.id);
        }
    }

    componentWillUnmount() {
        const { socket } = this.props;
        if (socket) {
            socket.off('receive_message');
            socket.off('update_chat_history');
            socket.off('messages_marked_as_read');
            socket.off('ai_typing_start');
            socket.off('ai_response_chunk');
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { socket, isOpen, userInfo, dbChatHistory } = this.props;
        const { filterTab, selectedDoctor } = this.state;

        if (isOpen && !prevProps.isOpen) {
            this.scrollToBottom();
            this.loadChatHistory();
            if (this.state.selectedDoctor) this.loadMessages();

            // Nếu mở drawer theo yêu cầu AI từ Redux
            if (this.props.doctorChatTab === 'AISUPPORT') {
                this.setState({ filterTab: 'AISUPPORT' });
                this.handleNewAIChat();
            } else {
                // Mặc định về tab Tất cả nếu không có yêu cầu đặc biệt (Fix lỗi sếp lo)
                this.setState({ filterTab: 'ALL' });
            }
        }

        if (socket && !this.socketRegistered && userInfo?.id) {
            this.setupSocket(socket);
        }

        // Đồng bộ lịch sử AI từ Redux vào state messages (Clean Code)
        if (filterTab === 'AISUPPORT' && dbChatHistory !== prevProps.dbChatHistory) {
            this.setState({
                messages: (dbChatHistory || []).map(msg => ({
                    id: msg.id || Math.random(),
                    text: msg.content,
                    type: msg.role === 'user' ? 'patient' : 'doctor',
                    time: new Date(msg.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                }))
            }, this.scrollToBottom);
        }

        if (prevProps.chatSessions !== this.props.chatSessions) {
            this.setState({ aiSessionsLocal: this.props.chatSessions || [] });
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
            if (selectedDoctor?.isAI) {
                this.props.fetchAIHistory(userInfo.id, selectedDoctor.id);
            } else {
                this.loadMessages();
            }
        }

        if (prevState.filterTab !== filterTab) {
            if (filterTab === 'AISUPPORT' && userInfo?.id) {
                this.props.fetchAISessions(userInfo.id);
            } else {
                this.loadChatHistory();
            }
        }

        // Đồng bộ Tab từ Redux (Nếu có yêu cầu mở tab cụ thể)
        if (prevProps.doctorChatTab !== this.props.doctorChatTab && this.props.doctorChatTab) {
            this.setState({ filterTab: this.props.doctorChatTab });

            // Nếu là Tab AI, tự động mở luôn phiên chat AI mới
            if (this.props.doctorChatTab === 'AISUPPORT') {
                this.handleNewAIChat();
            }
            // Quan trọng: Reset lại trạng thái tab
            this.props.openChatWithTab(null);
        }
    }

    setupSocket = (socket) => {
        // Dọn dẹp listener cũ trước khi đăng ký mới để tránh trùng lặp
        socket.off('receive_message');
        socket.off('ai_typing_start');
        socket.off('ai_response_chunk');
        socket.off('messages_marked_as_read');
        socket.off('update_chat_history');
        socket.off('message_reaction_updated');

        socket.on('receive_message', (data) => {
            // ... code cũ ...

            const { userInfo } = this.props;
            // Lấy state trực tiếp từ instance để đảm bảo luôn là giá trị mới nhất
            const currentSelectedDoctor = this.state.selectedDoctor;

            const sId = Number(data.senderId);
            const rId = Number(data.receiverId);
            const curSelectedId = Number(currentSelectedDoctor?.id);
            const curUserId = Number(userInfo?.id);

            console.log("LOG SOCKET REALTIME:", { sId, rId, curSelectedId, curUserId });

            // Logic: Tin nhắn thuộc về phiên chat đang mở (Dù là mình gửi hay họ gửi)
            const isMatch = curSelectedId && (
                (sId === curSelectedId && rId === curUserId) ||
                (sId === curUserId && rId === curSelectedId)
            );

            if (isMatch) {
                // Nếu là tin nhắn của chính mình, bỏ qua vì handleSend đã xử lý hiển thị rồi (Tránh lặp)
                if (sId === curUserId) return;

                this.setState(prevState => {
                    const isExist = prevState.messages.some(m =>
                        (m.id && data.id && Number(m.id) === Number(data.id)) ||
                        (m.text === data.text && Number(m.senderId) === sId && (m.createdAt === data.createdAt || sId === curUserId))
                    );
                    if (isExist) return null;

                    return {
                        messages: [...prevState.messages, {
                            ...data,
                            type: sId === curUserId ? 'patient' : 'doctor',
                            time: new Date(data.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                        }]
                    };
                }, () => {
                    this.scrollToBottom();
                    this.loadChatHistory();
                });
            } else {
                // Nếu không match, vẫn load lại history để hiện badge unread hoặc tin nhắn mới ở Sidebar
                this.loadChatHistory();
            }
        });

        // AI Listeners (Bổ sung mới)
        socket.on('ai_typing_start', ({ sessionId }) => {
            const { selectedDoctor } = this.state;
            if (selectedDoctor?.id !== sessionId) return;

            this.setState(prevState => ({
                isAITyping: true,
                messages: [...prevState.messages, {
                    id: 'ai_typing',
                    text: '',
                    type: 'doctor',
                    isTyping: true
                }]
            }), this.scrollToBottom);
        });

        socket.on('ai_response_chunk', ({ sessionId, chunk, isDone }) => {
            const { selectedDoctor } = this.state;
            if (selectedDoctor?.id !== sessionId) return;

            this.setState(prevState => {
                const messages = [...prevState.messages];
                const lastMsgIndex = messages.findIndex(m => m.id === 'ai_typing');

                if (lastMsgIndex !== -1) {
                    messages[lastMsgIndex].text += chunk;
                    if (isDone) {
                        messages[lastMsgIndex].id = Math.random();
                        messages[lastMsgIndex].isTyping = false;
                        messages[lastMsgIndex].time = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                    }
                }
                return {
                    messages,
                    isAITyping: !isDone
                };
            }, () => {
                if (isDone) {
                    this.props.fetchAISessions(this.props.userInfo.id);
                }
                this.scrollToBottom();
            });
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

        socket.on('message_reaction_updated', (data) => {
            const { selectedDoctor } = this.state;
            if (selectedDoctor && (Number(data.senderId) === Number(selectedDoctor.id) || Number(data.receiverId) === Number(selectedDoctor.id))) {
                this.setState(prevState => ({
                    messages: prevState.messages.map(msg => 
                        Number(msg.id) === Number(data.id) ? { ...msg, reactions: data.reactions } : msg
                    )
                }));
            }
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
                console.log("LOG LOAD MSGS:", {
                    firstMsgSenderId: res.data[0]?.senderId,
                    currentUserId: userInfo.id,
                    isMatch: res.data[0]?.senderId === userInfo.id
                });
                this.setState({
                    messages: res.data.map(m => ({
                        ...m,
                        isRead: Number(m.isRead),
                        type: Number(m.senderId) === Number(userInfo.id) ? 'patient' : 'doctor',
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

    handleNewAIChat = () => {
        const newId = `session_${Date.now()}`;
        this.setState({
            currentAISessionId: newId,
            selectedDoctor: {
                id: newId,
                isAI: true,
                name: 'AI Support'
            },
            messages: [],
            inputText: ''
        });
        this.props.clearAIDbHistory();
    }

    handleSend = async () => {
        const { inputText, selectedDoctor, selectedImage, filterTab, currentAISessionId, replyingTo } = this.state;
        const { userInfo, language } = this.props;
        if ((!inputText.trim() && !selectedImage) || !selectedDoctor || !userInfo) return;

        const userMsgContent = inputText.trim();

        // Luồng AI Support
        if (filterTab === 'AISUPPORT' || selectedDoctor.isAI) {
            const sessionId = selectedDoctor.id || currentAISessionId;
            // Optimistic rendering cho AI
            const newUserMsg = {
                id: Math.random(),
                text: userMsgContent,
                type: 'patient',
                time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
            };

            this.setState(prevState => ({
                messages: [...prevState.messages, newUserMsg],
                inputText: '',
                isAITyping: true
            }), this.scrollToBottom);

            try {
                // Gọi API AI giống AISupportPage
                let res = await axios.post('/api/chat-with-ai', {
                    userQuery: userMsgContent,
                    language: language,
                    userId: userInfo.id,
                    sessionId: sessionId
                });

                if (res && res.errCode === 0) {
                    // Nếu socket không bắn về kịp, lấy data từ HTTP (giống sếp làm cũ)
                    if (!this.props.socket) {
                        this.setState(prevState => ({
                            messages: [...prevState.messages, {
                                id: Math.random(),
                                text: res.data,
                                type: 'doctor',
                                time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                            }],
                            isAITyping: false
                        }), this.scrollToBottom);
                    }
                }
            } catch (e) {
                console.error("AI Chat Error:", e);
                this.setState({ isAITyping: false });
            }
            return;
        }

        // Luồng chat người-người cũ của sếp (Giữ nguyên)
        let res = await sendMessageApi({
            senderId: userInfo.id,
            receiverId: selectedDoctor.id,
            text: userMsgContent,
            image: selectedImage,
            parentId: replyingTo ? replyingTo.id : null
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
                previewImage: '',
                replyingTo: null
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
        if (e) e.stopPropagation();
        this.setState({
            showConfirmDelete: true,
            partnerIdToDelete: partnerId,
            deleteType: 'single'
        });
    }

    confirmDeleteMultiple = () => {
        const { selectedSessions } = this.state;
        if (selectedSessions.length > 0) {
            this.setState({
                showConfirmDelete: true,
                deleteType: 'multiple'
            });
        }
    }

    cancelDelete = () => {
        this.setState({
            showConfirmDelete: false,
            partnerIdToDelete: null,
            // deleteType: 'single' // Giữ nguyên để tránh flash text
        });
    }

    // Hàm hợp nhất để thực hiện xóa (nhận mảng các ID)
    handleExecuteDelete = async (idsToDelete) => {
        const { userInfo } = this.props;
        if (!idsToDelete || idsToDelete.length === 0 || !userInfo?.id) return;

        try {
            // Hiển thị loading nếu cần
            toast.info(`Đang xử lý xóa ${idsToDelete.length} mục...`);

            // Loop xóa (theo logic API hiện tại của sếp)
            for (const id of idsToDelete) {
                if (this.state.filterTab === 'AISUPPORT') {
                    // Xóa Session AI
                    await deleteChatSessionApi({
                        userId: userInfo.id,
                        sessionId: id
                    });
                } else {
                    // Xóa hội thoại người-người
                    await deleteConversationApi({
                        userId: userInfo.id,
                        partnerId: id
                    });
                }
            }

            this.setState(prevState => ({
                chatHistory: prevState.chatHistory.filter(item => !idsToDelete.includes(item.id)),
                aiSessionsLocal: prevState.aiSessionsLocal.filter(session => !idsToDelete.includes(session.sessionId)),
                isSelectMode: false,
                selectedSessions: [],
                showConfirmDelete: false,
                partnerIdToDelete: null,
                selectedDoctor: idsToDelete.includes(prevState.selectedDoctor?.id) ? null : prevState.selectedDoctor
            }));

            this.loadChatHistory();
            if (this.state.filterTab === 'AISUPPORT') {
                this.props.fetchAISessions(userInfo.id);
            }
            toast.success(`Đã xóa thành công ${idsToDelete.length} cuộc hội thoại`);
        } catch (error) {
            console.error("Lỗi khi xóa:", error);
            toast.error("Có lỗi xảy ra khi thực hiện xóa");
        }
    }

    handleDeleteConversation = async () => {
        const { partnerIdToDelete, selectedSessions, deleteType } = this.state;
        if (deleteType === 'single') {
            await this.handleExecuteDelete([partnerIdToDelete]);
        } else {
            await this.handleExecuteDelete(selectedSessions);
        }
    }

    handleToggleSidebar = () => {
        const { isSidebarHidden, selectedDoctor } = this.state;

        // Nếu chuẩn bị ẩn (isSidebarHidden đang false) mà chưa chọn ai thì chặn lại
        if (!isSidebarHidden && !selectedDoctor) {
            return;
        }

        this.setState({ isSidebarHidden: !isSidebarHidden });
    }

    handleSetReply = (message) => {
        this.setState({ replyingTo: message });
    }

    handleCancelReply = () => {
        this.setState({ replyingTo: null });
    }

    handleUpdateReaction = async (messageId, reaction) => {
        const { userInfo } = this.props;
        if (userInfo?.id) {
            let res = await updateMessageReactionApi({
                messageId: messageId,
                userId: userInfo.id,
                reaction: reaction
            });
            if (res && res.errCode === 0) {
                this.setState(prevState => ({
                    messages: prevState.messages.map(msg => 
                        Number(msg.id) === Number(messageId) ? { ...msg, reactions: res.data.reactions } : msg
                    )
                }));
            }
        }
    }

    handleToggleSelectMode = () => {
        this.setState({
            isSelectMode: !this.state.isSelectMode,
            selectedSessions: []
        });
    }

    handleSelectSessionForDelete = (sessionId) => {
        this.setState(prevState => {
            const { selectedSessions } = prevState;
            if (selectedSessions.includes(sessionId)) {
                return { selectedSessions: selectedSessions.filter(id => id !== sessionId) };
            } else {
                return { selectedSessions: [...selectedSessions, sessionId] };
            }
        });
    }

    handleDeleteAllSessions = () => {
        const { chatHistory, filterTab, selectedSessions } = this.state;
        const { chatSessions } = this.props;

        let allIds = [];
        if (filterTab === 'AISUPPORT') {
            allIds = chatSessions ? chatSessions.map(s => s.sessionId) : [];
        } else {
            allIds = chatHistory ? chatHistory.map(c => c.id) : [];
        }

        if (allIds.length > 0) {
            // Nếu đã chọn tất cả rồi thì bỏ chọn hết, ngược lại thì chọn tất cả
            const isAllSelected = selectedSessions.length === allIds.length;

            this.setState({
                isSelectMode: true,
                selectedSessions: isAllSelected ? [] : allIds
            });

            if (isAllSelected) {
                toast.info("Đã bỏ chọn tất cả");
            } else {
                toast.info(`Đã chọn tất cả ${allIds.length} cuộc hội thoại`);
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
                    <div className={`dcd-body ${this.state.isSidebarHidden ? 'hidden-sidebar' : ''}`}>
                        {!this.state.isSidebarHidden && (
                            <ChatSidebar
                                userInfo={userInfo}
                                chatHistory={this.state.chatHistory}
                                selectedDoctor={selectedDoctor}
                                searchQuery={this.state.searchQuery}
                                isSearching={this.state.isSearching}
                                searchResult={this.state.searchResult}
                                filterTab={this.state.filterTab}
                                aiSessions={this.state.aiSessionsLocal}
                                onNewAIChat={this.handleNewAIChat}
                                onSearchFocus={() => {
                                    this.setState({ isSearching: true });
                                    this.handleSearchChange('');
                                }}
                                onSearchChange={this.handleSearchChange}
                                onClearSearch={() => this.setState({ isSearching: false, searchQuery: '', searchResult: [] })}
                                onSelectDoctor={this.handleSelectDoctor}
                                onChangeFilterTab={(tab) => this.setState({ filterTab: tab })}
                                onConfirmDelete={this.confirmDelete}
                                // Props mới cho tính năng xóa nhiều
                                isSelectMode={this.state.isSelectMode}
                                selectedSessions={this.state.selectedSessions}
                                onToggleSidebar={this.handleToggleSidebar}
                                onToggleSelectMode={this.handleToggleSelectMode}
                                onSelectSessionForDelete={this.handleSelectSessionForDelete}
                                onConfirmDeleteMultiple={this.confirmDeleteMultiple}
                                onDeleteAll={this.handleDeleteAllSessions}
                            />
                        )}

                        <ChatBox
                            isSidebarHidden={this.state.isSidebarHidden}
                            onToggleSidebar={this.handleToggleSidebar}
                            filterTab={this.state.filterTab}
                            selectedDoctor={selectedDoctor}
                            userInfo={userInfo}
                            messages={this.state.messages}
                            inputText={this.state.inputText}
                            previewImage={this.state.previewImage}
                            isAutoReplyActive={this.state.isAutoReplyActive}
                            quickReplies={this.state.quickReplies}
                            isAITyping={this.state.isAITyping}
                            replyingTo={this.state.replyingTo}
                            onSetReply={this.handleSetReply}
                            onCancelReply={this.handleCancelReply}
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
                            deleteType={this.state.deleteType}
                            selectedCount={this.state.selectedSessions.length}
                            onCancelDelete={this.cancelDelete}
                            onConfirmDeleteConversation={this.handleDeleteConversation}
                            onConfirmDeleteMultiple={this.confirmDeleteMultiple}
                            onUpdateReaction={this.handleUpdateReaction}
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
        socket: state.socket.socket,
        // AI related data
        chatSessions: state.admin.chatSessions,
        dbChatHistory: state.admin.dbChatHistory,
        language: state.app.language,
        doctorChatTab: state.app.doctorChatTab,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        // AI related actions
        fetchAISessions: (userId) => dispatch(actions.fetchSessionsStart(userId)),
        fetchAIHistory: (userId, sessionId) => dispatch(actions.fetchHistoryStart(userId, sessionId)),
        clearAIDbHistory: () => dispatch({ type: 'FETCH_CHAT_HISTORY_SUCCESS', data: [] }),
        openChatWithTab: (tab) => dispatch(actions.openChatWithTab(tab))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorChat);
