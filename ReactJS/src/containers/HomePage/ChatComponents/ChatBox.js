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

class ChatBox extends Component {
    componentDidUpdate(prevProps) {
        if (prevProps.messages !== this.props.messages) {
            this.props.messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
            onConfirmDeleteConversation
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
                                        className="dcd-action-btn show-sidebar-btn"
                                        onClick={onToggleSidebar}
                                        title="Hiện danh sách"
                                    >
                                        <i className="fas fa-indent"></i>
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
                                <div className="dcd-header-text">
                                    <div className="dcd-header-name">{isAIMode ? 'AI Support Assistant' : `${selectedDoctor.lastName} ${selectedDoctor.firstName}`}</div>
                                    <div className="dcd-header-status">{isAIMode ? 'Sẵn sàng hỗ trợ 24/7' : 'Đang trực tuyến'}</div>
                                </div>
                            </div>
                            <div className="dcd-header-actions">
                                <button className="dcd-action-btn"><i className="fas fa-phone-alt"></i></button>
                                <button className="dcd-action-btn"><i className="fas fa-video"></i></button>
                                <button className="dcd-action-btn"><i className="fas fa-info-circle"></i></button>
                            </div>
                        </div>

                        <div className="dcd-messages" onClick={onMarkAsRead}>
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
                                        {messages.map((msg, index) => (
                                            <div key={msg.id} className={`dcd-msg dcd-msg--${msg.type}`}>
                                                {msg.type === 'system' ? (
                                                    <div className="dcd-system-msg">{msg.text}</div>
                                                ) : (
                                                    <div className="dcd-bubble">
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
                                                                <span className="dcd-time">{msg.time}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                                {index === lastSentIndex && Number(msg.isRead) === 1 && !isAIMode && (
                                                    <div className="dcd-seen-status">Đã xem</div>
                                                )}
                                            </div>
                                        ))}
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
                                <input
                                    type="text"
                                    className="dcd-input"
                                    placeholder="Nhắn tin cho bác sĩ..."
                                    value={inputText}
                                    onChange={handleInputChange}
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

                {showConfirmDelete && (
                    <div className="dcd-confirm-popup">
                        <div className="popup-title">Xóa cuộc trò chuyện?</div>
                        <div className="popup-desc">
                            Mọi tin nhắn trong cuộc hội thoại này sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
                        </div>
                        <div className="popup-actions">
                            <button onClick={onCancelDelete}>Hủy</button>
                            <button className="btn-delete" onClick={onConfirmDeleteConversation}>Xóa</button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default ChatBox;
