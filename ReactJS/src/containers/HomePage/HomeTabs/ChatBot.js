import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from '../../../components/Navigator';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../../utils';
import * as action from '../../../store/actions';
import moment from 'moment';
import CustomScrollbars from '../../../components/CustomScrollbars';
import { withSocket } from '../../../hoc/withSocket';
import axios from '../../../auth/axiosInstance';
import { toast } from 'react-toastify';
import MarkdownIt from 'markdown-it';
import './ChatBot.scss';

const mdParser = new MarkdownIt({
    html: false,
    linkify: true,
    typographer: true,
    breaks: true
});

class ChatBot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            message: '',
            isLoading: false,
            currentSessionId: `session_${Date.now()}`,
            isSending: false,
            isSending: false,
            localMessages: []
        }
        this.messagesContainerRef = React.createRef();
    }

    componentDidMount() {
        const { userInfo } = this.props;
        if (userInfo && userInfo.id) {
            this.props.fetchSessions(userInfo.id);
        }
        this.setupSocketListeners();
    }

    componentWillUnmount() {
        if (this.props.socket) {
            this.props.socket.off('ai_typing_start');
            this.props.socket.off('ai_response_chunk');
        }
    }

    setupSocketListeners = () => {
        const { socket } = this.props;
        if (!socket) return;

        socket.off('ai_typing_start');
        socket.off('ai_response_chunk');

        socket.on('ai_typing_start', ({ sessionId }) => {
            if (this.state.currentSessionId !== sessionId) return;
            this.setState(prevState => ({
                localMessages: [...prevState.localMessages, { role: 'assistant', content: '' }]
            }), () => this.scrollToBottom());
        });

        socket.on('ai_response_chunk', ({ sessionId, chunk, isDone }) => {
            if (this.state.currentSessionId !== sessionId) return;

            this.setState(prevState => {
                const messages = [...prevState.localMessages];
                if (messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
                    messages[messages.length - 1].content += chunk;
                }
                return { localMessages: messages, isSending: !isDone };
            }, () => {
                if (isDone) {
                    this.props.fetchHistory(this.props.userInfo.id, sessionId);
                    this.props.fetchSessions(this.props.userInfo.id);
                } else {
                    this.scrollToBottom();
                }
            });
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.dbChatHistory !== prevProps.dbChatHistory) {
            this.setState({ localMessages: this.props.dbChatHistory || [] }, () => {
                this.scrollToBottom();
            });
        }
        if (this.props.userInfo !== prevProps.userInfo && this.props.userInfo) {
            this.props.fetchSessions(this.props.userInfo.id);
        }
        if (this.props.socket !== prevProps.socket) {
            this.setupSocketListeners();
        }
    }

    scrollToBottom = () => {
        if (this.messagesContainerRef.current) {
            const container = this.messagesContainerRef.current;
            container.scrollTo({
                top: container.scrollHeight,
                behavior: 'smooth'
            });
        }
    }

    toggleChat = () => {
        this.setState({ isOpen: !this.state.isOpen });
    }

    handleSendMessage = async () => {
        const { message, currentSessionId, isSending, localMessages } = this.state;
        const { userInfo, language } = this.props;

        if (!message.trim() || isSending) return;

        const userMsgContent = message;

        const newUserMessage = { role: 'user', content: userMsgContent };
        this.setState({
            localMessages: [...localMessages, newUserMessage],
            message: '',
            isSending: true
        }, () => {
            this.scrollToBottom();
        });

        try {
            let res = await axios.post('/api/chat-with-ai', {
                userQuery: userMsgContent,
                language: language,
                userId: userInfo ? userInfo.id : `guest_${Math.random().toString(36).substr(2, 9)}`,
                sessionId: currentSessionId
            });

            if (res && res.errCode === 0) {
                // Nếu không có kết nối Socket hoặc là khách vãng lai, sử dụng luôn data từ HTTP response
                if (!this.props.socket || !userInfo) {
                    this.setState(prevState => ({
                        localMessages: [...prevState.localMessages, { role: 'assistant', content: res.data }]
                    }), () => this.scrollToBottom());
                }
            } else {
                console.log("Lỗi từ máy chủ AI");
            }
        } catch (e) {
            console.log(e);
            console.log("Gửi tin nhắn thất bại");
        } finally {
            this.setState({ isSending: false });
        }
    }

    handleKeyDown = (event) => {
        if (event.nativeEvent.isComposing) return;
        if (event.key === 'Enter') {
            this.handleSendMessage();
        }
    }

    handleClearChat = () => {
        const { language } = this.props;
        const confirmMsg = language === LANGUAGES.VI
            ? 'Bạn có chắc chắn muốn xóa lịch sử cuộc trò chuyện này không?'
            : 'Are you sure you want to clear this chat history?';

        if (window.confirm(confirmMsg)) {
            this.props.clearChatHistory();
        }
    }

    handleSelectSession = (sessionId) => {
        const { userInfo } = this.props;
        this.setState({ currentSessionId: sessionId });
        if (userInfo && userInfo.id) {
            this.props.fetchHistory(userInfo.id, sessionId);
        }
    }

    handleNewChat = () => {
        const newId = `session_${Date.now()}`;
        this.setState({
            currentSessionId: newId,
            message: ''
        });
        this.props.clearChatHistory();
    }

    render() {
        let { message, isSending, currentSessionId, localMessages } = this.state;
        let { language, chatSessions } = this.props;

        const welcomeText = language === LANGUAGES.VI
            ? 'Chào bạn! Tôi là trợ lý ảo Gemini. Tôi có thể tư vấn sức khỏe và giải đáp các thắc mắc y tế của bạn.'
            : 'Hello! I am Gemini AI. I can provide health advice and answer your medical questions.';

        let displayMessages = localMessages && localMessages.length > 0 ? localMessages : [
            { role: 'assistant', content: welcomeText }
        ];

        return (
            <div className="chatbot-integrated">
                <div className="cb-header">
                    <button className="cb-back" onClick={this.props.onBack}>
                        <i className="fas fa-chevron-left"></i>
                        Quay lại
                    </button>
                    <h2>Trợ lý <span>AI Gemini</span></h2>
                </div>

                <div className="cb-layout">
                    {/* Sidebar Sessions List — Left */}
                    <div className="cb-sidebar">
                        <button className="new-chat-btn" onClick={this.handleNewChat}>
                            <i className="fas fa-plus"></i>
                            <span>Thêm đoạn chat mới</span>
                        </button>

                        <div className="sessions-list">
                            <div className="session-group-title">Lịch sử trò chuyện</div>
                            <CustomScrollbars style={{ height: '420px' }}>
                                {chatSessions && chatSessions.length > 0 ? (
                                    chatSessions.map((session, index) => (
                                        <div
                                            key={index}
                                            className={`session-item ${currentSessionId === session.sessionId ? 'active' : ''}`}
                                            onClick={() => this.handleSelectSession(session.sessionId)}
                                        >
                                            <i className="far fa-comment-alt"></i>
                                            <div className="session-info">
                                                <div className="session-text">{session.lastMessage}</div>
                                                <div className="session-time">{moment(session.createdAt).fromNow()}</div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-sessions">Chưa có lịch sử</div>
                                )}
                            </CustomScrollbars>
                        </div>
                    </div>

                    {/* Main Chat Box — Right */}
                    <div className="cb-window">
                        <div className="cb-messages" ref={this.messagesContainerRef}>
                            {displayMessages.map((msg, index) => (
                                <div key={index} className={`cb-message ${msg.role}`}>
                                    <div 
                                        className="cb-bubble markdown-content"
                                        dangerouslySetInnerHTML={{ __html: mdParser.render(msg.content) }}
                                    />
                                </div>
                            ))}
                            {isSending && (
                                <div className="cb-message assistant">
                                    <div className="cb-bubble typing">...</div>
                                </div>
                            )}
                        </div>

                        <div className="cb-input-area">
                            <input
                                type="text"
                                placeholder={language === LANGUAGES.VI ? "Hỏi Gemini về sức khỏe..." : "Ask Gemini about health..."}
                                value={message}
                                onChange={(e) => this.setState({ message: e.target.value })}
                                onKeyDown={this.handleKeyDown}
                                disabled={isSending}
                            />
                            <button onClick={this.handleSendMessage} disabled={isSending} className="cb-send-btn">
                                <i className="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        userInfo: state.user.userInfo,
        chatSessions: state.admin.chatSessions,
        dbChatHistory: state.admin.dbChatHistory
    };
};

const mapDispatchToProps = dispatch => {
    return {
        postChatWithAI: (query) => dispatch(action.postChatWithAI(query)),
        clearChatHistory: () => dispatch({ type: 'FETCH_CHAT_HISTORY_SUCCESS', data: [] }),
        fetchSessions: (userId) => dispatch(action.fetchSessionsStart(userId)),
        fetchHistory: (userId, sessionId) => dispatch(action.fetchHistoryStart(userId, sessionId)),
    };
};

export default withSocket(withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatBot)));
