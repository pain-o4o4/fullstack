import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { withRouter } from '../../components/Navigator';
import { withSocket } from '../../hoc/withSocket';
import './AISupportPage.scss';
import * as actions from "../../store/actions";
import CustomScrollbars from '../../components/CustomScrollbars';
import axios from '../../auth/axiosInstance';
import { toast } from 'react-toastify';
import moment from 'moment';

class AISupportPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            currentSessionId: `session_${Date.now()}`,
            isSending: false,
            localMessages: [] // Thêm state localMessages để render ngay tin nhắn của user
        };
        this.chatEndRef = React.createRef();
    }

    async componentDidMount() {
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
            // Thêm tin nhắn rỗng của AI để chuẩn bị nhận chunk
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
                // isSending: false khi hoàn tất
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
            // Khi lịch sử DB cập nhật, đồng bộ vào state local
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
        if (this.chatEndRef.current) {
            this.chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }

    handleInputChange = (e) => {
        this.setState({ message: e.target.value });
    }

    handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.handleSendMessage();
        }
    }

    handleSendMessage = async () => {
        const { message, currentSessionId, isSending, localMessages } = this.state;
        const { userInfo, language } = this.props;

        if (!message.trim() || isSending) return;

        const userMsgContent = message;

        // 1. Optimistic Rendering: Hiện tin nhắn user ngay lập tức
        const newUserMessage = { role: 'user', content: userMsgContent };
        this.setState({
            localMessages: [...localMessages, newUserMessage],
            message: '', // Xóa trắng input
            isSending: true
        }, () => {
            this.scrollToBottom();
        });

        try {
            // 2. Gửi tin nhắn lên AI Server
            let res = await axios.post('/api/chat-with-ai', {
                userQuery: userMsgContent,
                language: language,
                userId: userInfo.id,
                sessionId: currentSessionId
            });

            if (res && res.errCode === 0) {
                // Thành công, không làm gì thêm vì socket (isDone) sẽ fetchHistory lại
            } else {
                toast.error("Error from AI server");
            }
        } catch (e) {
            console.log(e);
            toast.error("Failed to send message");
        } finally {
            this.setState({ isSending: false });
        }
    }

    handleSelectSession = (sessionId) => {
        const { userInfo } = this.props;
        this.setState({ currentSessionId: sessionId });
        this.props.fetchHistory(userInfo.id, sessionId);
    }

    handleNewChat = () => {
        const newId = `session_${Date.now()}`;
        this.setState({
            currentSessionId: newId,
            message: ''
        });
        // Clear history hiển thị
        this.props.clearDbHistory();
    }
    handleHomePage = () => {
        this.props.navigate('/home');
    }

    render() {
        const { language, chatSessions, navigate } = this.props;
        const { message, currentSessionId, isSending, localMessages } = this.state;

        return (
            <div className="ai-support-container">
                {/* <HomeHeader isShowBanner={false} /> */}

                <div className="ai-support-content">
                    {/* Sidebar */}
                    <div className="ai-sidebar">
                        <button className="new-chat-btn" onClick={this.handleNewChat}>
                            <i className="fas fa-plus"></i>
                            <span><FormattedMessage id="ai.new-chat" defaultMessage="New Chat" /></span>
                        </button>

                        <div className="sessions-list">
                            <div className="session-group-title">
                                <FormattedMessage id="ai.history" defaultMessage="Recent Conversations" />
                            </div>
                            <CustomScrollbars style={{ height: 'calc(100vh - 200px)' }}>
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
                                    <div className="no-sessions">No history found</div>
                                )}
                            </CustomScrollbars>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="ai-chat-main">
                        <div className="chat-header">
                            <div className="ai-title"

                                onClick={() => this.handleHomePage()}
                            >BookingCare</div>
                            <div className="ai-status">
                                <span className="status-dot"></span> Online
                            </div>
                        </div>

                        <div className="chat-messages-area">
                            <CustomScrollbars style={{ height: '100%', width: '100%' }}>
                                <div className="messages-wrapper">
                                    {localMessages && localMessages.length > 0 ? (
                                        localMessages.map((msg, index) => (
                                            <div key={index} className={`message-bubble ${msg.role}`}>
                                                <div className="bubble-content">
                                                    {msg.content}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="chat-welcome">
                                            <div className="welcome-icon">🩺</div>
                                            <h2>Xin chào! Tôi có thể giúp gì cho bạn?</h2>
                                            <p>Hãy đặt câu hỏi về triệu chứng, bác sĩ hoặc cách sử dụng hệ thống BookingCare.</p>
                                        </div>
                                    )}
                                    {isSending && (
                                        <div className="message-bubble assistant typing">
                                            <div className="bubble-content">
                                                <div className="typing-loader">
                                                    <span></span><span></span><span></span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={this.chatEndRef} />
                                </div>
                            </CustomScrollbars>
                        </div>

                        <div className="chat-input-container">
                            <div className="input-wrapper">
                                <textarea
                                    placeholder={language === 'vi' ? "Hỏi bất cứ điều gì..." : "Ask anything..."}
                                    value={message}
                                    onChange={this.handleInputChange}
                                    onKeyDown={this.handleKeyDown}
                                    disabled={isSending}
                                    rows="1"
                                />
                                <button
                                    className={`send-btn ${!message.trim() || isSending ? 'disabled' : ''}`}
                                    onClick={this.handleSendMessage}
                                >
                                    <i className="fas fa-paper-plane"></i>
                                </button>
                            </div>
                            <div className="input-hint">
                                AI có thể đưa ra câu trả lời không chính xác. Hãy kiểm tra lại thông tin quan trọng.
                            </div>
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
        fetchSessions: (userId) => dispatch(actions.fetchSessionsStart(userId)),
        fetchHistory: (userId, sessionId) => dispatch(actions.fetchHistoryStart(userId, sessionId)),
        clearDbHistory: () => dispatch({ type: 'FETCH_CHAT_HISTORY_SUCCESS', data: [] })
    };
};

export default withSocket(withRouter(injectIntl(connect(mapStateToProps, mapDispatchToProps)(AISupportPage))));
