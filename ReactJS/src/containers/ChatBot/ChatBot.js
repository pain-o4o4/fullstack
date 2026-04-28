import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from '../../components/Navigator';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../utils';
import * as action from '../../store/actions';
import './ChatBot.scss';

class ChatBot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            message: '',
            isLoading: false
        }
        this.messagesEndRef = React.createRef();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.chatHistory !== this.props.chatHistory) {
            this.scrollToBottom();
            
            if (this.props.chatHistory.length > 0) {
                const lastMsg = this.props.chatHistory[this.props.chatHistory.length - 1];
                if (lastMsg.role === 'assistant') {
                    this.setState({ isLoading: false });
                }
            }
        }
    }

    scrollToBottom = () => {
        if (this.messagesEndRef.current) {
            this.messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }

    toggleChat = () => {
        this.setState({ isOpen: !this.state.isOpen });
    }

    handleSendMessage = async () => {
        let { message } = this.state;
        if (!message.trim()) return;

        this.setState({ 
            message: '',
            isLoading: true 
        });

        this.props.postChatWithAI(message);
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

    render() {
        let { isOpen, message, isLoading } = this.state;
        let { chatHistory, language } = this.props;

        // Nội dung chào mặc định theo ngôn ngữ
        const welcomeText = language === LANGUAGES.VI 
            ? 'Chào bạn! Tôi là trợ lý ảo của BookingCare. Tôi có thể giúp gì cho bạn?'
            : 'Hello! I am the BookingCare virtual assistant. How can I help you?';

        let displayMessages = chatHistory && chatHistory.length > 0 ? chatHistory : [
            { role: 'assistant', content: welcomeText }
        ];

        return (
            <div className="chatbot-container">
                {!isOpen && (
                    <div className="chatbot-button" onClick={this.toggleChat}>
                        <i className="fas fa-comment-dots"></i>
                    </div>
                )}

                {isOpen && (
                    <div className="chatbot-window">
                        <div className="chatbot-header">
                            <div className="header-title">
                                <i className="fas fa-robot"></i>
                                <span><FormattedMessage id="chatbot.title" /></span>
                            </div>
                            <div className="header-actions">
                                <i className="fas fa-sync-alt refresh-btn" 
                                   title={language === LANGUAGES.VI ? "Làm mới chat" : "Refresh chat"}
                                   onClick={this.handleClearChat}></i>
                                <i className="fas fa-times close-btn" onClick={this.toggleChat}></i>
                            </div>
                        </div>

                        <div className="chatbot-messages">
                            {displayMessages.map((msg, index) => (
                                <div key={index} className={`message ${msg.role}`}>
                                    {msg.content}
                                </div>
                            ))}
                            {isLoading && <div className="typing"><FormattedMessage id="chatbot.typing" /></div>}
                            <div ref={this.messagesEndRef} />
                        </div>

                        <div className="chatbot-input">
                            <input
                                type="text"
                                placeholder={language === LANGUAGES.VI ? "Nhập câu hỏi..." : "Type a question..."}
                                value={message}
                                onChange={(e) => this.setState({ message: e.target.value })}
                                onKeyDown={this.handleKeyDown}
                            />
                            <button onClick={this.handleSendMessage} disabled={isLoading}>
                                <i className="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        chatHistory: state.admin.chatHistory
    };
};

const mapDispatchToProps = dispatch => {
    return {
        postChatWithAI: (query) => dispatch(action.postChatWithAI(query)),
        clearChatHistory: () => dispatch(action.clearChatHistory())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatBot));
