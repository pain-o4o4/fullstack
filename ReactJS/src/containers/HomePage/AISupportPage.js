import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { withRouter } from '../../components/Navigator';
import { withSocket } from '../../hoc/withSocket';
import './AISupportPage.scss';
import * as actions from "../../store/actions";
import MarkdownIt from 'markdown-it';
import CustomScrollbars from '../../components/CustomScrollbars';
import { postChatWithAIService } from '../../services/userService';
import { toast } from 'react-toastify';
import moment from 'moment';

const mdParser = new MarkdownIt({
    html: false,
    linkify: true,
    typographer: true,
    breaks: true
});

class AISupportPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            currentSessionId: `session_${Date.now()}`,
            isSending: false,
            localMessages: [],
            isSidebarOpen: true  // default open like Gemini
        };
        this.chatEndRef = React.createRef();
    }

    toggleSidebar = () => {
        this.setState(prevState => ({ isSidebarOpen: !prevState.isSidebarOpen }));
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
            let res = await postChatWithAIService({
                userQuery: userMsgContent,
                language: language,
                userId: userInfo ? userInfo.id : null,
                sessionId: currentSessionId
            });

            if (res && res.errCode === 0) {
                // Thành công, nếu socket không khả dụng hoặc là guest, sử dụng data trả về từ HTTP
                if (!this.props.socket || !userInfo) {
                    this.setState(prevState => ({
                        localMessages: [...prevState.localMessages, { role: 'assistant', content: res.data }]
                    }), () => {
                        if (userInfo && userInfo.id) {
                            this.props.fetchHistory(userInfo.id, currentSessionId);
                        }
                    });
                }
            } else {
                console.log("Error from AI server");
            }
        } catch (e) {
            console.log(e);
            console.log("Failed to send message");
        } finally {
            this.setState({ isSending: false });
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
        // Clear history hiển thị
        this.props.clearDbHistory();
    }
    handleHomePage = () => {
        this.props.navigate('/home');
    }

    renderMessageContent = (msg) => {
        let cleanText = msg.content || '';
        let aiSearchData = null;
        let isAiSearchData = false;

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
                cleanText = cleanText.replace(/\[AI_ACTION_DATA\][\s\S]*/g, '');
            }
        }

        const renderAiCards = () => {
            if (!isAiSearchData || !aiSearchData || !aiSearchData.data) return null;
            const { doctors, clinics, specialties, handbooks } = aiSearchData.data;
            const { language, navigate } = this.props;

            const itemsPerSlide = window.innerWidth <= 768 ? 3 : 9;
            const chunkArray = (arr, size) => {
                const chunked = [];
                for (let i = 0; i < arr.length; i += size) {
                    chunked.push(arr.slice(i, i + size));
                }
                return chunked;
            };

            return (
                <div className="ai-search-results-wrapper">
                    {doctors && doctors.length > 0 && (
                        <div className="ai-doctors-list">
                            <div className="ai-list-title"><i className="fas fa-user-md"></i> {language === 'vi' ? 'Bác sĩ gợi ý' : 'Suggested Doctors'}</div>
                            <div className="ai-cards-carousel">
                                {chunkArray(doctors, itemsPerSlide).map((slide, slideIdx) => (
                                    <div className="ai-cards-slide" key={`doc-slide-${slideIdx}`}>
                                        {slide.map(doc => (
                                            <div className="ai-doctor-card" key={`doc-${doc.id}`} onClick={() => navigate(`/detail-doctor/${doc.id}`)}>
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
                                ))}
                            </div>
                        </div>
                    )}

                    {specialties && specialties.length > 0 && (
                        <div className="ai-doctors-list">
                            <div className="ai-list-title"><i className="fas fa-stethoscope"></i> {language === 'vi' ? 'Chuyên khoa phù hợp' : 'Suggested Specialties'}</div>
                            <div className="ai-cards-carousel">
                                {chunkArray(specialties, itemsPerSlide).map((slide, slideIdx) => (
                                    <div className="ai-cards-slide" key={`spec-slide-${slideIdx}`}>
                                        {slide.map(spec => (
                                            <div className="ai-doctor-card" key={`spec-${spec.id}`} onClick={() => navigate(`/detail-specialty/${spec.id}`)}>
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
                                ))}
                            </div>
                        </div>
                    )}

                    {clinics && clinics.length > 0 && (
                        <div className="ai-doctors-list">
                            <div className="ai-list-title"><i className="far fa-hospital"></i> {language === 'vi' ? 'Cơ sở y tế' : 'Suggested Clinics'}</div>
                            <div className="ai-cards-carousel">
                                {chunkArray(clinics, itemsPerSlide).map((slide, slideIdx) => (
                                    <div className="ai-cards-slide" key={`clinic-slide-${slideIdx}`}>
                                        {slide.map(clinic => (
                                            <div className="ai-doctor-card" key={`clinic-${clinic.id}`} onClick={() => navigate(`/detail-clinic/${clinic.id}`)}>
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
                                ))}
                            </div>
                        </div>
                    )}

                    {handbooks && handbooks.length > 0 && (
                        <div className="ai-doctors-list">
                            <div className="ai-list-title"><i className="fas fa-book-medical"></i> {language === 'vi' ? 'Bài viết liên quan' : 'Related Articles'}</div>
                            <div className="ai-cards-carousel">
                                {chunkArray(handbooks, itemsPerSlide).map((slide, slideIdx) => (
                                    <div className="ai-cards-slide" key={`hb-slide-${slideIdx}`}>
                                        {slide.map(article => (
                                            <div className="ai-doctor-card" key={`hb-${article.id}`} onClick={() => navigate(`/detail-handbook/${article.id}`)}>
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
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            );
        };

        return (
            <div className={`message-inner-wrapper ${isAiSearchData ? 'has-cards' : ''}`}>
                {cleanText && (
                    <div
                        className="bubble-content markdown-content"
                        dangerouslySetInnerHTML={{ __html: mdParser.render(cleanText) }}
                    />
                )}
                {renderAiCards()}
            </div>
        );
    }

    render() {
        const { language, chatSessions } = this.props;
        const { message, currentSessionId, isSending, localMessages, isSidebarOpen } = this.state;
        const hasMessages = localMessages && localMessages.length > 0;

        return (
            <div className="ai-support-container">
                <div className="ai-support-content">

                    {isSidebarOpen && window.innerWidth <= 768 && (
                        <div className="sidebar-backdrop" onClick={this.toggleSidebar}></div>
                    )}


                    <div className={`ai-sidebar ${isSidebarOpen ? 'open' : 'collapsed'}`}>

                        <div className="sidebar-header">
                            <div className="sidebar-logo" onClick={this.handleHomePage}>
                                <i className="fas fa-stethoscope sidebar-logo-icon"></i>
                                <span className="sidebar-logo-text">BookingCare AI</span>
                            </div>
                            <button className="sidebar-toggle-btn" onClick={this.toggleSidebar} title="Toggle sidebar">
                                <i className="fas fa-bars"></i>
                            </button>
                        </div>


                        <button className="new-chat-btn" onClick={this.handleNewChat}>
                            <i className="fas fa-edit"></i>
                            <span className="new-chat-text">
                                <FormattedMessage id="ai.new-chat" defaultMessage="New Chat" />
                            </span>
                        </button>


                        <div className="sidebar-nav">
                            <div className="sidebar-nav-item" onClick={this.handleHomePage}>
                                <i className="fas fa-home"></i>
                                <span className="sidebar-label">Trang chủ</span>
                            </div>
                        </div>

                        <div className="sidebar-divider"></div>


                        <div className="sessions-list">
                            <div className="session-group-title">
                                <span className="sidebar-label">
                                    <FormattedMessage id="ai.history" defaultMessage="Gần đây" />
                                </span>
                            </div>
                            <CustomScrollbars className="sessions-scrollbar">
                                {chatSessions && chatSessions.length > 0 ? (
                                    chatSessions.map((session, index) => (
                                        <div
                                            key={index}
                                            className={`session-item ${currentSessionId === session.sessionId ? 'active' : ''}`}
                                            onClick={() => {
                                                this.handleSelectSession(session.sessionId);
                                                if (window.innerWidth <= 768) {
                                                    this.setState({ isSidebarOpen: false });
                                                }
                                            }}
                                            title={session.lastMessage}
                                        >
                                            <div className="session-text">{session.lastMessage}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-sessions">Chưa có cuộc trò chuyện nào</div>
                                )}
                            </CustomScrollbars>
                        </div>
                    </div>


                    <div className="ai-chat-main">

                        <div className="chat-topbar">
                            <button className="sidebar-toggle-btn topbar-toggle" onClick={this.toggleSidebar} title="Toggle sidebar">
                                <i className="fas fa-bars"></i>
                            </button>
                            <div className="ai-status">
                                <span className="status-dot"></span>
                                <span>Online</span>
                            </div>
                        </div>


                        {!hasMessages ? (
                            <div className="chat-welcome-screen">
                                <div className="welcome-glow"></div>
                                <div className="welcome-body">
                                    <h2 className="welcome-greeting">
                                        {language === 'vi'
                                            ? 'Xin chào! Tôi có thể giúp gì cho bạn?'
                                            : 'Hello! How can I help you?'}
                                    </h2>
                                    <p className="welcome-sub">
                                        Hãy đặt câu hỏi về triệu chứng, bác sĩ hoặc cách sử dụng hệ thống BookingCare.
                                    </p>

                                    <div className="welcome-input-area">
                                        <div className="input-wrapper">
                                            <textarea
                                                placeholder={language === 'vi' ? "Hỏi BookingCare AI..." : "Ask BookingCare AI..."}
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
                        ) : (
                            /* ── Chat state: messages + bottom input ── */
                            <>
                                <div className="chat-messages-area">
                                    <CustomScrollbars className="chat-messages-scrollbar">
                                        <div className="messages-wrapper">
                                            {localMessages.map((msg, index) => (
                                                <div key={index} className={`message-bubble ${msg.role}`}>
                                                    {this.renderMessageContent(msg)}
                                                </div>
                                            ))}
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
                            </>
                        )}
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
