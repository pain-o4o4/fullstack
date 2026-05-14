import React, { Component } from 'react';
import './ChatBox.scss';
import ChatActionsMenu from './ChatActionsMenu';
import MarkdownIt from 'markdown-it';

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
            showReactionFor: null
        };
        this.reactionRef = React.createRef();
        this.textareaRef = React.createRef();
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
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
            onClose
        } = this.props;

        const isAIMode = selectedDoctor?.isAI;

        return (
            <div className="dcd-chat-area">
                {selectedDoctor ? (
                    <>
                        <div className="dcd-chat-header">
                            <div className="dcd-header-info">
                                {isSidebarHidden && (
                                    <button
                                        className="dcd-action-btn show-sidebar-btn mobile-back-btn"
                                        onClick={onToggleSidebar}
                                        title="Quay lại danh sách"
                                    >
                                        <i className="fas fa-chevron-left"></i>
                                    </button>
                                )}
                                <div className="dcd-header-avatar-wrap">
                                    {isAIMode ? (
                                        <div className="dcd-header-avatar-placeholder ai"><i className="fas fa-robot"></i></div>
                                    ) : selectedDoctor.image ? (
                                        <div className="dcd-header-avatar" style={{ backgroundImage: `url(${selectedDoctor.image})` }}></div>
                                    ) : (
                                        <div className="dcd-header-avatar-placeholder"><i className="fas fa-user-md"></i></div>
                                    )}
                                    <span className="dcd-status-dot online"></span>
                                </div>
                                <div
                                    className="dcd-header-text"
                                    onClick={onClose}
                                    style={{ cursor: 'pointer' }}
                                    title="Bấm để đóng cửa sổ"
                                >
                                    <div className="dcd-header-name">{isAIMode ? 'AI Support Assistant' : `${selectedDoctor.lastName} ${selectedDoctor.firstName}`}</div>
                                    <div className="dcd-header-status">{isAIMode ? 'Sẵn sàng hỗ trợ 24/7' : 'Đang trực tuyến'}</div>
                                </div>
                            </div>
                            <div className="dcd-header-actions">
                                {/* <button className="dcd-action-btn"><i className="fas fa-phone-alt"></i></button> */}
                                {/* <button className="dcd-action-btn"><i className="fas fa-video"></i></button> */}
                                <button className="dcd-action-btn"><i className="fas fa-info-circle"></i></button>
                            </div>
                        </div>

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
                                                                                <div className="dcd-msg-avatar" style={{ backgroundImage: `url(${selectedDoctor.image})` }}></div>
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
                                                                                {msg.text && (
                                                                                    <div
                                                                                        className="dcd-text markdown-content"
                                                                                        dangerouslySetInnerHTML={{ __html: mdParser.render(msg.text) }}
                                                                                    />
                                                                                )}

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

                {/* Confirm Popup đã được chuyển ra DoctorChat.js để phủ toàn bộ drawer */}
            </div>
        );
    }
}

export default ChatBox;
