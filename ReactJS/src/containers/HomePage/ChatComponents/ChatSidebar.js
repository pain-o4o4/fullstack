import React, { Component } from 'react';
import './ChatSidebar.scss';

class ChatSidebar extends Component {
    render() {
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
            onConfirmDelete
        } = this.props;

        return (
            <div className="dcd-sidebar">
                <div className="dcd-sidebar-header">
                    <div className="dcd-sidebar-title">Đoạn chat</div>
                    <div className="dcd-sidebar-actions">
                        <button className="dcd-action-btn"><i className="fas fa-ellipsis-h"></i></button>
                        {/* <button className="dcd-action-btn"><i className="fas fa-video"></i></button> */}
                        {/* <button className="dcd-action-btn"><i className="fas fa-edit"></i></button> */}
                    </div>
                </div>

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
                    </div>
                )}

                <div className="dcd-sidebar-list">
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
                                        <div className="dcd-doc-avatar" style={{ backgroundImage: `url(${d.image})` }}></div>
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
                        // History Mode: Show Recent Chats
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
                                        {chat.avatar ? (
                                            <div className="dcd-doc-avatar" style={{ backgroundImage: `url(${chat.avatar})` }}></div>
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
                    )}
                </div>
            </div>
        );
    }
}

export default ChatSidebar;
