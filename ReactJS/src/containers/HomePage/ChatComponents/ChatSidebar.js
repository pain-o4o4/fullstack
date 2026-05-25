import React, { Component } from 'react';
import './ChatSidebar.scss';
import moment from 'moment';
import 'moment/locale/vi';

class ChatSidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMenuOpen: false,
        };
        this.menuRef = React.createRef();
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (this.menuRef.current && !this.menuRef.current.contains(event.target)) {
            this.setState({ isMenuOpen: false });
        }
    }

    handleAction = (type) => {
        this.setState({ isMenuOpen: false });
        if (type === 'HIDE') this.props.onToggleSidebar();
        if (type === 'SELECT') this.props.onToggleSelectMode();
    }

    render() {
        const { isMenuOpen, showDeleteConfirm, deleteType } = this.state;
        const {
            userInfo,
            chatHistory,
            selectedDoctor,
            searchQuery,
            isSearching,
            searchResult,
            filterTab,
            onSearchFocus,
            onSearchChange,
            onClearSearch,
            onSelectDoctor,
            onChangeFilterTab,
            onConfirmDelete,
            // Props mới
            aiSessions,
            onNewAIChat,
            isSelectMode,
            selectedSessions,
            onToggleSelectMode,
            onSelectSessionForDelete,
            onConfirmDeleteMultiple,
            onDeleteAll
        } = this.props;

        const currentHistory = filterTab === 'AISUPPORT'
            ? (aiSessions || []).map(s => ({
                id: s.sessionId,
                name: 'AI Support',
                lastMsg: s.lastMessage,
                time: moment(s.createdAt).fromNow(),
                isAI: true
            }))
            : chatHistory;

        return (
            <div className="dcd-sidebar">
                <div className="dcd-sidebar-header">
                    <div
                        className="dcd-sidebar-title"
                        onClick={this.props.onClose}
                        style={{ cursor: 'pointer' }}
                        title="Bấm để đóng cửa sổ"
                    >
                        <i className="fas fa-chevron-left"></i>
                        Đoạn chat
                    </div>
                    <div className="dcd-sidebar-actions" ref={this.menuRef}>
                        <button
                            className={`dcd-action-btn ${isMenuOpen ? 'active' : ''}`}
                            onClick={() => this.setState({ isMenuOpen: !isMenuOpen })}
                        >
                            <i className="fas fa-ellipsis-h"></i>
                        </button>

                        {isMenuOpen && (
                            <div className="dcd-sidebar-menu-popover">
                                <div className="menu-item" onClick={() => this.handleAction('HIDE')}>
                                    <i className="fas fa-eye-slash"></i>
                                    <span>Ẩn danh sách</span>
                                </div>
                                <div className="menu-item" onClick={() => this.handleAction('SELECT')}>
                                    <i className="fas fa-tasks"></i>
                                    <span>{isSelectMode ? 'Hủy chọn' : 'Chọn để xóa'}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {isSelectMode && (
                    <div className="dcd-select-actions-bar">
                        <span>Đã chọn {selectedSessions.length} mục</span>
                        <div className="select-btns">
                            <button className="btn-select-all" onClick={onDeleteAll}>
                                {currentHistory.length > 0 && selectedSessions.length === currentHistory.length ? 'Bỏ chọn hết' : 'Chọn tất cả'}
                            </button>
                            <button
                                className="btn-delete"
                                onClick={() => {
                                    if (selectedSessions.length === 0) {
                                        onToggleSelectMode();
                                    } else {
                                        onConfirmDeleteMultiple();
                                    }
                                }}
                            >
                                {selectedSessions.length === 0 ? 'Hủy' : `Xóa (${selectedSessions.length})`}
                            </button>
                        </div>
                    </div>
                )}

                <div className="dcd-search-container">
                    <div className="dcd-search-wrapper">
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder={userInfo?.roleId === 'R2' ? "Tìm kiếm bệnh nhân..." : "Tìm kiếm bác sĩ..."}
                            value={searchQuery}
                            onFocus={onSearchFocus}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                        {isSearching &&
                            <i className="fas fa-times-circle" onClick={onClearSearch}></i>
                        }
                    </div>
                </div>

                {!isSearching && (
                    <div className="dcd-filter-tabs">
                        <span className={`tab ${filterTab === 'ALL' ? 'active' : ''}`} onClick={() => onChangeFilterTab('ALL')}>Tất cả</span>
                        <span className={`tab ${filterTab === 'READ' ? 'active' : ''}`} onClick={() => onChangeFilterTab('READ')}>Đã đọc</span>
                        <span className={`tab ${filterTab === 'UNREAD' ? 'active' : ''}`} onClick={() => onChangeFilterTab('UNREAD')}>Chưa đọc</span>
                        <span className={`tab ${filterTab === 'AISUPPORT' ? 'active' : ''}`} onClick={() => onChangeFilterTab('AISUPPORT')}>AI Support</span>
                    </div>
                )}

                <div className="dcd-sidebar-list">
                    {filterTab === 'AISUPPORT' && !isSearching && (
                        <div className="dcd-new-ai-chat" onClick={onNewAIChat}>
                            <i className="fas fa-plus-circle"></i>
                            <span>Cuộc trò chuyện AI mới</span>
                        </div>
                    )}

                    {isSearching ? (
                        // Search Mode: Show Results from API
                        searchResult && searchResult.map(d => (
                            <div
                                key={d.id}
                                className={`dcd-doc-item ${selectedDoctor && selectedDoctor.id === d.id ? 'active' : ''}`}
                                onClick={() => {
                                    onSelectDoctor(d);
                                    onClearSearch();
                                }}
                            >
                                <div className="dcd-doc-avatar-wrap">
                                    {d.image ? (
                                        <img className="dcd-doc-avatar" src={d.image} alt="Avatar" />
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
                        // History Mode: Show Recent Chats (AI OR Normal)
                        filterTab === 'AISUPPORT' ? (
                            aiSessions && aiSessions.map((session, index) => (
                                <div
                                    key={index}
                                    className={`dcd-chat-history-item ${selectedDoctor && selectedDoctor.id === session.sessionId ? 'active' : ''}`}
                                    onClick={() => onSelectDoctor({
                                        id: session.sessionId,
                                        isAI: true,
                                        name: 'AI Support'
                                    })}
                                >
                                    <div className="dcd-doc-avatar-wrap">
                                        {isSelectMode && (
                                            <div
                                                className={`dcd-select-checkbox ${selectedSessions.includes(session.sessionId) ? 'checked' : ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onSelectSessionForDelete(session.sessionId);
                                                }}
                                            >
                                                <i className="fas fa-check"></i>
                                            </div>
                                        )}
                                        <div className="dcd-doc-avatar-placeholder ai"><i className="fas fa-robot"></i></div>
                                    </div>
                                    <div className="dcd-history-info">
                                        <div className="dcd-history-name">Phiên hỏi đáp AI</div>
                                        <div className="dcd-history-lastmsg">
                                            <span className="msg-text">{session.lastMessage}</span>
                                            <span className="msg-time"> · {moment(session.createdAt).fromNow()}</span>
                                        </div>
                                    </div>
                                    <div className="dcd-history-status">
                                        <button
                                            className="dcd-delete-chat-btn"
                                            onClick={(e) => onConfirmDelete(e, session.sessionId)}
                                            title="Xóa phiên hỏi đáp"
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            chatHistory
                                .filter(chat => {
                                    if (filterTab === 'READ') return (chat.unreadCount || 0) === 0;
                                    if (filterTab === 'UNREAD') return (chat.unreadCount || 0) > 0;
                                    return true;
                                })
                                .map(chat => (
                                    <div
                                        key={chat.id}
                                        className={`dcd-chat-history-item ${selectedDoctor && selectedDoctor.id === chat.id ? 'active' : ''}`}
                                        onClick={() => onSelectDoctor({
                                            id: chat.id,
                                            firstName: chat.name.split(' ').pop(),
                                            lastName: chat.name.split(' ').slice(0, -1).join(' '),
                                            image: chat.avatar
                                        })}
                                    >
                                        <div className="dcd-doc-avatar-wrap">
                                            {isSelectMode && (
                                                <div
                                                    className={`dcd-select-checkbox ${selectedSessions.includes(chat.id) ? 'checked' : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onSelectSessionForDelete(chat.id);
                                                    }}
                                                >
                                                    <i className="fas fa-check"></i>
                                                </div>
                                            )}
                                            {chat.avatar ? (
                                                <img className="dcd-doc-avatar" src={chat.avatar} alt="Avatar" />
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
                                                onClick={(e) => onConfirmDelete(e, chat.id)}
                                                title="Xóa cuộc trò chuyện"
                                            >
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                            {chat.unreadCount > 0 && <span className="unread-badge">{chat.unreadCount}</span>}
                                        </div>
                                    </div>
                                ))
                        )
                    )}
                </div>


            </div>
        );
    }
}

export default ChatSidebar;
