import React, { Component } from 'react';
import './ChatBox.scss';
import ChatActionsMenu from './ChatActionsMenu';

class ChatBox extends Component {
    componentDidUpdate(prevProps) {
        if (prevProps.messages !== this.props.messages) {
            this.props.messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }

    render() {
        let {
            selectedDoctor,
            userInfo,
            messages,
            inputText,
            previewImage,
            isAutoReplyActive,
            quickReplies,
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

        return (
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

                        <div className="dcd-messages" onClick={onMarkAsRead}>
                            {(() => {
                                let lastSentIndex = -1;
                                for (let i = messages.length - 1; i >= 0; i--) {
                                    if (messages[i] && userInfo && Number(messages[i].senderId) === Number(userInfo.id)) {
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
                                        {index === lastSentIndex && Number(msg.isRead) === 1 && (
                                            <div className="dcd-seen-status">Đã xem</div>
                                        )}
                                    </div>
                                ));
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
