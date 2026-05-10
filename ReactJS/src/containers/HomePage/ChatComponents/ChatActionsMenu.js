import React, { Component } from 'react';
import './ChatActionsMenu.scss';

class ChatActionsMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            showQuickReplies: false
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
        if (this.menuRef && this.menuRef.current && !this.menuRef.current.contains(event.target)) {
            this.setState({ isOpen: false, showQuickReplies: false });
        }
    }

    toggleMenu = () => {
        const { userInfo, onSendImage } = this.props;
        // R1: Admin, R2: Doctor, R3: Patient
        const isStaff = userInfo?.roleId === 'R1' || userInfo?.roleId === 'R2';

        if (isStaff) {
            this.setState({ isOpen: !this.state.isOpen, showQuickReplies: false });
        } else {
            // Bệnh nhân click thì chọn ảnh luôn
            onSendImage();
        }
    }

    handleAction = (actionType) => {
        const { onSendImage, onToggleAutoReply } = this.props;

        if (actionType === 'IMAGE') {
            onSendImage();
            this.setState({ isOpen: false });
        } else if (actionType === 'QUICK') {
            this.setState({ showQuickReplies: true });
        } else if (actionType === 'AUTO') {
            onToggleAutoReply();
        }
    }

    render() {
        const { isOpen, showQuickReplies } = this.state;
        const { onSelectQuickReply, isAutoReplyActive, quickReplies, filterTab } = this.props;

        if (filterTab === 'AISUPPORT') return null;

        // Lấy động hoàn toàn từ Database (Admin & Doctor)
        const displayReplies = (quickReplies && quickReplies.length > 0)
            ? quickReplies.map(r => r.content)
            : [];

        return (
            <div className="dcd-action-hub" ref={this.menuRef}>
                <button
                    className={`dcd-add-btn ${isOpen ? 'active' : ''}`}
                    onClick={this.toggleMenu}
                    title="Thêm hành động"
                >
                    <i className={`fas ${isOpen ? 'fa-times' : 'fa-plus-circle'}`}></i>
                </button>

                {isOpen && (
                    <div className="dcd-action-menu-popover">
                        {!showQuickReplies ? (
                            <div className="menu-main">
                                <div className="menu-item" onClick={() => this.handleAction('IMAGE')}>
                                    <div className="item-label">Gửi hình ảnh</div>
                                    <div className="item-icon-wrap image"><i className="fas fa-image"></i></div>
                                </div>
                                <div className="menu-item" onClick={() => this.handleAction('QUICK')}>
                                    <div className="item-label">Tin nhắn nhanh</div>
                                    <div className="item-icon-wrap quick"><i className="fas fa-bolt"></i></div>
                                </div>
                                <div className="menu-item" onClick={() => this.handleAction('AUTO')}>
                                    <div className="item-label">Trả lời tự động</div>
                                    <div className={`apple-switch ${isAutoReplyActive ? 'on' : ''}`}>
                                        <div className="switch-handle"></div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="menu-quick-replies">
                                <div className="quick-header" onClick={() => this.setState({ showQuickReplies: false })}>
                                    <i className="fas fa-chevron-left"></i>
                                    <span>Tin nhắn nhanh</span>
                                </div>
                                <div className="quick-list">
                                    {displayReplies.map((text, index) => (
                                        <div
                                            key={index}
                                            className="quick-item"
                                            onClick={() => {
                                                onSelectQuickReply(text);
                                                this.setState({ isOpen: false });
                                            }}
                                        >
                                            {text}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

export default ChatActionsMenu;
