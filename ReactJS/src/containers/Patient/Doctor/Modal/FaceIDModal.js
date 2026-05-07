import React, { Component } from 'react';
import './FaceIDModal.scss';

class FaceIDModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 'scanning', // 'scanning' | 'verifying' | 'success'
        };
        this.stepTimer = null;
    }

    componentDidMount() {
        // Auto-progress through steps
        this.stepTimer = setTimeout(() => {
            this.setState({ step: 'verifying' });

            setTimeout(() => {
                this.setState({ step: 'success' });

                // After success, call onSuccess callback
                setTimeout(() => {
                    this.props.onSuccess && this.props.onSuccess();
                }, 700);
            }, 1100);
        }, 1400);
    }

    componentWillUnmount() {
        if (this.stepTimer) clearTimeout(this.stepTimer);
    }

    render() {
        const { onCancel, amount } = this.props;
        const { step } = this.state;

        return (
            <div className="faceid-overlay">
                <div className="faceid-modal">
                    {/* Top bar */}
                    <div className="faceid-topbar">
                        <div className="faceid-topbar-line"></div>
                    </div>

                    {/* Header */}
                    <div className="faceid-header">
                        <div className="faceid-logo">
                            <span className="logo-dot dot-1"></span>
                            <span className="logo-dot dot-2"></span>
                            <span className="logo-dot dot-3"></span>
                        </div>
                        <div className="faceid-brand">BookingCare</div>
                    </div>

                    {/* Amount */}
                    <div className="faceid-amount-section">
                        <div className="faceid-amount-label">Số tiền thanh toán</div>
                        <div className="faceid-amount">{amount || '200.000 VNĐ'}</div>
                    </div>

                    {/* Face Scan Visual */}
                    <div className="faceid-scan-area">
                        {/* Face outline */}
                        <div className={`faceid-face-outline ${step}`}>
                            {/* Corner brackets */}
                            <div className="corner tl"></div>
                            <div className="corner tr"></div>
                            <div className="corner bl"></div>
                            <div className="corner br"></div>

                            {/* Face icon */}
                            <div className="faceid-face-icon">
                                {step === 'success' ? (
                                    <div className="faceid-success-icon">
                                        <i className="fas fa-check-circle"></i>
                                    </div>
                                ) : (
                                    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                                        {/* Face outline */}
                                        <ellipse cx="28" cy="26" rx="14" ry="17" stroke="currentColor" strokeWidth="1.8"/>
                                        {/* Eyes */}
                                        <circle cx="22" cy="24" r="2.5" fill="currentColor"/>
                                        <circle cx="34" cy="24" r="2.5" fill="currentColor"/>
                                        {/* Nose */}
                                        <path d="M28 27v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                        {/* Smile */}
                                        <path d="M22 35c1.5 2.5 10.5 2.5 12 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                                        {/* IR dots scan lines */}
                                        <path d="M18 20l2-2M36 20l2 2M20 36l-2 2M36 36l2-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
                                    </svg>
                                )}
                            </div>

                            {/* Scanning laser line */}
                            {step === 'scanning' && <div className="faceid-scanner-line"></div>}

                            {/* Verifying overlay */}
                            {step === 'verifying' && (
                                <div className="faceid-verifying-grid">
                                    {Array.from({ length: 49 }).map((_, i) => (
                                        <div key={i} className="grid-dot" style={{ '--i': i }}></div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Outer pulsing rings */}
                        <div className={`faceid-rings ${step === 'success' ? 'success' : ''}`}>
                            <div className="fid-ring fid-ring-1"></div>
                            <div className="fid-ring fid-ring-2"></div>
                        </div>
                    </div>

                    {/* Status text */}
                    <div className="faceid-status">
                        {step === 'scanning' && (
                            <>
                                <div className="faceid-status-title">Đưa mặt vào khung hình</div>
                                <div className="faceid-status-sub">Hệ thống đang quét khuôn mặt của bạn...</div>
                            </>
                        )}
                        {step === 'verifying' && (
                            <>
                                <div className="faceid-status-title verifying">Đang xác thực</div>
                                <div className="faceid-status-sub">Phân tích dữ liệu sinh trắc học...</div>
                            </>
                        )}
                        {step === 'success' && (
                            <>
                                <div className="faceid-status-title success">
                                    <i className="fas fa-check"></i> Xác thực thành công
                                </div>
                                <div className="faceid-status-sub">Đang chuyển đến cổng thanh toán PayOS...</div>
                            </>
                        )}
                    </div>

                    {/* Security badge */}
                    <div className="faceid-security">
                        <i className="fas fa-shield-alt security-icon"></i>
                        <span>Bảo mật Face ID — Dữ liệu không rời thiết bị</span>
                    </div>

                    {/* Cancel */}
                    {step !== 'success' && (
                        <button className="faceid-cancel" onClick={onCancel}>
                            Hủy thanh toán
                        </button>
                    )}
                </div>
            </div>
        );
    }
}

export default FaceIDModal;
