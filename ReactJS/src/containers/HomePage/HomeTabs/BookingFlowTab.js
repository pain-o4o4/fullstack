import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from '../../../components/Navigator';
import { 
    getAllSpecialtyService, 
    getTopDoctorHomeService, 
    getScheduleByDate,
    postBookAppointment 
} from '../../../services/userService';
import * as actions from '../../../store/actions';
import { LANGUAGES } from '../../../utils/constant';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { toast } from 'react-toastify';
import './BookingFlowTab.scss';

class BookingFlowTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeStep: 0,
            specialtyCount: 0,
            listSpecialty: [],
            topDoctors: [],
            
            // Patient Journey State
            selectedSpecialty: null,
            selectedDoctor: null,
            selectedDate: moment(new Date()).startOf('day').valueOf(),
            selectedTime: null,
            availableSchedules: [],
            
            // Form State (Step 3)
            patientInfo: {
                fullName: '',
                phoneNumber: '',
                email: '',
                address: '',
                reason: '',
                gender: '',
                birthday: ''
            },
            
            loading: false,
            isSuccess: false
        };
    }

    async componentDidMount() {
        // Prepare required data from Redux
        this.props.fetchGenders();
        
        try {
            let [resSpecialty, resDoctors] = await Promise.all([
                getAllSpecialtyService(),
                getTopDoctorHomeService(8)
            ]);

            if (resSpecialty && resSpecialty.errCode === 0) {
                this.setState({
                    specialtyCount: resSpecialty.data.length,
                    listSpecialty: resSpecialty.data.slice(0, 6)
                });
            }

            if (resDoctors && resDoctors.errCode === 0) {
                this.setState({ topDoctors: resDoctors.data });
            }
        } catch (e) {
            console.error("BookingFlowTab Load Error:", e);
        }
    }

    // ============================================================
    // JOURNEY LOGIC
    // ============================================================

    handleSelectSpecialty = (specialty) => {
        this.setState({ 
            selectedSpecialty: specialty,
            activeStep: 1 // Move to Doctor/Schedule selection
        });
    }

    handleSelectDoctor = async (doctor) => {
        this.setState({ 
            selectedDoctor: doctor,
            selectedTime: null
        });
        await this.fetchSchedules(doctor.id, this.state.selectedDate);
    }

    fetchSchedules = async (doctorId, date) => {
        try {
            let res = await getScheduleByDate(doctorId, date);
            if (res && res.errCode === 0) {
                this.setState({ availableSchedules: res.data });
            }
        } catch (e) {
            console.error("Fetch Schedule Error:", e);
        }
    }

    handleDateChange = async (date) => {
        const timestamp = moment(date).startOf('day').valueOf();
        this.setState({ selectedDate: timestamp, selectedTime: null });
        if (this.state.selectedDoctor) {
            await this.fetchSchedules(this.state.selectedDoctor.id, timestamp);
        }
    }

    handleInputChange = (e, id) => {
        let copyState = { ...this.state.patientInfo };
        copyState[id] = e.target.value;
        this.setState({ patientInfo: copyState });
    }

    handleConfirmBooking = async () => {
        const { patientInfo, selectedDoctor, selectedTime, selectedDate } = this.state;
        const { language } = this.props;

        // Validation
        if (!patientInfo.fullName || !patientInfo.email || !patientInfo.phoneNumber || !selectedTime) {
            toast.error(language === LANGUAGES.VI ? "Vui lòng điền đầy đủ thông tin!" : "Please fill in all fields!");
            return;
        }

        this.setState({ loading: true });

        let data = {
            ...patientInfo,
            doctorId: selectedDoctor.id,
            date: selectedDate,
            selectedTime: selectedTime.timeType,
            timeString: language === LANGUAGES.VI ? selectedTime.timeTypeData.valueVi : selectedTime.timeTypeData.valueEn,
            doctorName: `${selectedDoctor.lastName} ${selectedDoctor.firstName}`,
            language: language
        };

        try {
            let res = await postBookAppointment(data);
            if (res && res.errCode === 0) {
                toast.success(language === LANGUAGES.VI ? "Đặt lịch thành công!" : "Booking success!");
                this.setState({ activeStep: 3, isSuccess: true });
            } else {
                toast.error(res.errMessage || "Booking failed");
            }
        } catch (e) {
            toast.error("Error connecting to server");
        } finally {
            this.setState({ loading: false });
        }
    }

    // ============================================================
    // RENDER LAYOUTS
    // ============================================================

    getSteps = (specialtyCount) => [
        {
            id: 'discovery',
            number: '1',
            title: 'Khám phá',
            label: 'Tìm kiếm',
            desc: 'Chọn chuyên khoa bạn quan tâm để tìm bác sĩ phù hợp.',
            details: [`Hơn ${specialtyCount} chuyên khoa`, 'Bác sĩ đầu ngành', 'Cơ sở y tế uy tín']
        },
        {
            id: 'selection',
            number: '2',
            title: 'Lựa chọn',
            label: 'Đặt lịch',
            desc: 'Chọn bác sĩ và khung giờ khám phù hợp với bạn.',
            details: ['Lịch khám cập nhật', 'Giá khám minh bạch', 'Đặt trong 60 giây']
        },
        {
            id: 'confirmation',
            number: '3',
            title: 'Xác thực',
            label: 'Hồ sơ',
            desc: 'Điền thông tin bệnh nhân để hoàn tất hồ sơ đặt khám.',
            details: ['Bảo mật thông tin', 'Hỗ trợ 24/7', 'Xác nhận tức thì']
        },
        {
            id: 'journey',
            number: '4',
            title: 'Hành trình',
            label: 'Kết quả',
            desc: 'Yêu cầu của bạn đã được gửi. Vui lòng kiểm tra Email.',
            details: ['Check-in nhanh', 'Không chờ đợi', 'Hỗ trợ tận tâm']
        }
    ];

    renderStepContent = (stepIndex) => {
        const { 
            listSpecialty, topDoctors, availableSchedules, 
            selectedDoctor, selectedTime, patientInfo,
            loading, selectedDate
        } = this.state;
        const { genders, language } = this.props;
        
        switch(stepIndex) {
            case 0: // Step 1: Chọn chuyên khoa
                return (
                    <div className="scroll-area">
                        <div className="step-content-grid">
                            {listSpecialty.map((item, idx) => (
                                <div 
                                    key={idx} 
                                    className="step-item-card specialty"
                                    onClick={() => this.handleSelectSpecialty(item)}
                                >
                                    <div className="item-icon" style={{ backgroundImage: `url(${item.image})` }}></div>
                                    <span className="item-label-mini">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 1: // Step 2: Chọn bác sĩ & Giờ
                return (
                    <div className="step-content-doctor-selection scroll-area">
                        {!selectedDoctor ? (
                            <div className="scroll-area">
                                <div className="step-content-grid">
                                    {topDoctors && topDoctors.length > 0 ? topDoctors.map((doc, idx) => (
                                        <div key={idx} className="step-item-card" onClick={() => this.handleSelectDoctor(doc)}>
                                            <div className="item-icon" style={{ backgroundImage: `url(${doc.image})` }}></div>
                                            <div className="item-label-mini">
                                                {doc.lastName} {doc.firstName}
                                                <div style={{ fontSize: '10px', fontWeight: '400', opacity: 0.8, marginTop: '2px' }}>{doc.positionData?.valueVi}</div>
                                            </div>
                                        </div>
                                    )) : <div className="no-data">Đang tải danh sách bác sĩ...</div>}
                                </div>
                            </div>
                        ) : (
                            <div className="schedule-selection">
                                <div className="back-btn" onClick={() => this.setState({ selectedDoctor: null })}><i className="fas fa-arrow-left"></i> Đổi bác sĩ</div>
                                <div className="doctor-profile-mini">
                                    <div className="avatar" style={{ backgroundImage: `url(${selectedDoctor.image})` }}></div>
                                    <div className="info">
                                        <div className="name">{selectedDoctor.lastName} {selectedDoctor.firstName}</div>
                                        <div className="pos">{selectedDoctor.positionData?.valueVi}</div>
                                    </div>
                                </div>
                                <div className="date-tabs">
                                    {[0, 1, 2].map(i => {
                                        const d = moment().add(i, 'days');
                                        const isSelected = moment(selectedDate).isSame(d, 'day');
                                        return (
                                            <div key={i} className={`date-tab ${isSelected ? 'active' : ''}`} onClick={() => this.handleDateChange(d)}>
                                                <div className="day">{i === 0 ? 'Hôm nay' : d.format('DD/MM')}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="time-grid">
                                    {availableSchedules && availableSchedules.length > 0 ? (
                                        availableSchedules.map((t, i) => (
                                            <button key={i} className={`time-btn ${selectedTime?.id === t.id ? 'active' : ''}`} onClick={() => this.setState({ selectedTime: t })}>
                                                {language === LANGUAGES.VI ? t.timeTypeData?.valueVi : t.timeTypeData?.valueEn}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="no-time">Bác sĩ không có lịch trong ngày này.</div>
                                    )}
                                </div>
                                {selectedTime && (
                                    <button className="next-step-btn-blue" onClick={() => this.setState({ activeStep: 2 })}>
                                        Tiếp tục <i className="fas fa-arrow-right"></i>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                );
            case 2: // Step 3: Nhập thông tin
                if (!selectedDoctor || !selectedTime) {
                    return (
                        <div className="step-content-form-wizard empty">
                            <div className="empty-state">
                                <i className="fas fa-user-md-slash"></i>
                                <p>Vui lòng chọn bác sĩ và khung giờ khám ở bước trước.</p>
                                <button className="back-to-step-btn" onClick={() => this.setState({ activeStep: 1 })}>Quay lại bước 2</button>
                            </div>
                        </div>
                    );
                }
                return (
                    <div className="step-content-form-wizard scroll-area">
                        <div className="booking-summary-pill">
                            <i className="far fa-clock"></i> {selectedTime ? (language === LANGUAGES.VI ? selectedTime.timeTypeData?.valueVi : selectedTime.timeTypeData?.valueEn) : ''} - {moment(selectedDate).format('DD/MM/YYYY')}
                        </div>
                        <div className="form-grid">
                            <div className="form-field">
                                <label>Họ tên bệnh nhân</label>
                                <input value={patientInfo.fullName} onChange={(e) => this.handleInputChange(e, 'fullName')} placeholder="VD: Nguyễn Văn A" />
                            </div>
                            <div className="form-field">
                                <label>Số điện thoại</label>
                                <input value={patientInfo.phoneNumber} onChange={(e) => this.handleInputChange(e, 'phoneNumber')} placeholder="09xxx" />
                            </div>
                            <div className="form-field">
                                <label>Email liên hệ</label>
                                <input value={patientInfo.email} onChange={(e) => this.handleInputChange(e, 'email')} placeholder="email@gmail.com" />
                            </div>
                            <div className="form-field">
                                <label>Giới tính</label>
                                <select value={patientInfo.gender} onChange={(e) => this.handleInputChange(e, 'gender')}>
                                    <option value="">Chọn...</option>
                                    {genders.map(g => <option key={g.keyMap} value={g.keyMap}>{language === LANGUAGES.VI ? g.valueVi : g.valueEn}</option>)}
                                </select>
                            </div>
                            <div className="form-field full">
                                <label>Lý do khám</label>
                                <textarea value={patientInfo.reason} onChange={(e) => this.handleInputChange(e, 'reason')} placeholder="Mô tả sơ lược triệu chứng..."></textarea>
                            </div>
                        </div>
                        <button className="confirm-btn-final" disabled={loading} onClick={this.handleConfirmBooking}>
                            {loading ? 'Đang xử lý...' : 'Xác nhận đặt lịch'}
                        </button>
                    </div>
                );
            case 3: // Step 4: Thành công
                if (!this.state.isSuccess) {
                    return (
                        <div className="step-content-success-ticket empty">
                            <div className="empty-state">
                                <i className="fas fa-ticket-alt"></i>
                                <p>Bạn chưa hoàn tất đặt lịch khám.</p>
                                <button className="back-to-step-btn" onClick={() => this.setState({ activeStep: 0 })}>Bắt đầu lại</button>
                            </div>
                        </div>
                    );
                }
                return (
                    <div className="step-content-success-ticket">
                        <div className="success-icon-wrapper">
                            <div className="check-mark"><i className="fas fa-check"></i></div>
                        </div>
                        <h4>Đặt lịch thành công!</h4>
                        <p>Thông tin đặt lịch đã được gửi đến email <strong>{patientInfo.email}</strong>. Vui lòng kiểm tra để xác nhận.</p>
                        <div className="ticket-mini-info">
                            <div className="row"><span>Bác sĩ:</span> <strong>{selectedDoctor?.lastName} {selectedDoctor?.firstName}</strong></div>
                            <div className="row"><span>Thời gian:</span> <strong>{selectedTime ? (language === LANGUAGES.VI ? selectedTime.timeTypeData?.valueVi : selectedTime.timeTypeData?.valueEn) : ''} - {moment(selectedDate).format('DD/MM/YYYY')}</strong></div>
                        </div>
                        <button className="done-btn" onClick={() => this.props.navigate('/all-doctor')}>Xem lịch của tôi</button>
                    </div>
                );
            default:
                return null;
        }
    }

    render() {
        const { activeStep, specialtyCount } = this.state;
        const steps = this.getSteps(specialtyCount);
        const currentData = steps[activeStep];

        return (
            <div className="booking-flow-tab">
                <div className="bf-overview-container">
                    <div className="bf-sidebar">
                        <div className="bf-eyebrow">Hành trình người bệnh</div>
                        <h2 className="bf-main-title">Quy trình <span>Số hóa</span></h2>
                        <p className="bf-main-desc">Từ việc tìm kiếm chuyên khoa đến lúc nhận kết quả khám — hoàn toàn trực tuyến và minh bạch.</p>
                        
                        <div className="bf-step-list">
                            {steps.map((step, i) => (
                                <div 
                                    key={step.id} 
                                    className={`bf-step-nav-item ${activeStep === i ? 'active' : ''}`}
                                    onClick={() => this.setState({ activeStep: i })}
                                >
                                    <div className="step-dot"></div>
                                    <div className="step-info">
                                        <div className="step-label">{step.label}</div>
                                        <div className="step-title">{step.title}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bf-main-visual">
                        <div className="bf-visual-card">
                            <div className="visual-header">
                                <div className="step-badge">Bước {currentData.number}</div>
                                <h3>{currentData.title}</h3>
                            </div>
                            <p className="visual-desc">{currentData.desc}</p>
                            
                            <div className="detail-grid">
                                {currentData.details.map((detail, idx) => (
                                    <div key={idx} className="detail-item">
                                        <div className="detail-check"><i className="fas fa-check"></i></div>
                                        <span>{detail}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="visual-mockup">
                                <div className="mockup-inner">
                                    {this.renderStepContent(activeStep)}
                                </div>
                                <div className="mockup-overlay">
                                    <div className="pulse-circle"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    language: state.app.language,
    genders: state.admin.genders,
});

const mapDispatchToProps = dispatch => ({
    fetchGenders: () => dispatch(actions.fetchGenderStart())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BookingFlowTab));
