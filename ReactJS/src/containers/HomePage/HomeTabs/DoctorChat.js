import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllDoctorsService } from '../../../services/userService';
import './DoctorChat.scss';

class DoctorChat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listDoctors: [],
            selectedDoctor: null,
            chatHistory: [
                { role: 'doctor', message: 'Xin chào! Tôi có thể giúp gì cho bạn?' }
            ]
        };
    }

    async componentDidMount() {
        let res = await getAllDoctorsService();
        if (res && res.errCode === 0) {
            this.setState({
                listDoctors: res.data,
                selectedDoctor: res.data[0]
            });
        }
    }

    render() {
        const { listDoctors, selectedDoctor, chatHistory } = this.state;
        return (
            <div className="doctor-chat-container">
                <div className="dc-header">
                    <button className="dc-back" onClick={this.props.onBack}>
                        <i className="fas fa-chevron-left"></i>
                        Quay lại
                    </button>
                    <h2>Trực tuyến <span>với Bác sĩ</span></h2>
                </div>

                <div className="dc-layout">
                    {/* Sidebar Doctor List — Left */}
                    <div className="dc-sidebar">
                        <div className="sidebar-title">Bác sĩ sẵn sàng</div>
                        <div className="doctor-list">
                            {listDoctors.map((doc) => (
                                <div 
                                    key={doc.id} 
                                    className={`doctor-item ${selectedDoctor?.id === doc.id ? 'active' : ''}`}
                                    onClick={() => this.setState({ selectedDoctor: doc })}
                                >
                                    <div className="di-avatar" style={{ backgroundImage: `url(${doc.image})` }}></div>
                                    <div className="di-info">
                                        <div className="di-name">{doc.lastName} {doc.firstName}</div>
                                        <div className="di-spec">Chuyên khoa nội</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Chat Box — Right */}
                    <div className="dc-main-chat">
                        <div className="dc-chat-header">
                            {selectedDoctor && (
                                <div className="active-doctor">
                                    <div className="ad-avatar" style={{ backgroundImage: `url(${selectedDoctor.image})` }}></div>
                                    <div className="ad-info">
                                        <div className="ad-name">{selectedDoctor.lastName} {selectedDoctor.firstName}</div>
                                        <div className="ad-status">Đang trực tuyến</div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="dc-chat-messages">
                            {chatHistory.map((chat, i) => (
                                <div key={i} className={`msg-row ${chat.role}`}>
                                    <div className="msg-bubble">{chat.message}</div>
                                </div>
                            ))}
                        </div>
                        <div className="dc-chat-input">
                            <input type="text" placeholder="Nhập tin nhắn..." disabled />
                            <button className="send-btn">
                                <i className="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default DoctorChat;
