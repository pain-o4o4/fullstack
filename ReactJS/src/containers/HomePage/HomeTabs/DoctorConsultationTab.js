import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllDoctorsService, getProfileDoctorById } from '../../../services/userService';
import { withRouter } from '../../../components/Navigator';
import './DoctorConsultationTab.scss';

class DoctorConsultationTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listDoctors: [],
            selectedDoctor: null,
            selectedDoctorProfile: null,
            isLoadingProfile: false
        };
    }

    async componentDidMount() {
        let res = await getAllDoctorsService();
        if (res && res.errCode === 0 && res.data && res.data.length > 0) {
            const preselectedId = localStorage.getItem('telehealth_preselected_doctor_id');
            let selectedDoctor = res.data[0];

            if (preselectedId) {
                const found = res.data.find(doc => doc.id === +preselectedId);
                if (found) {
                    selectedDoctor = found;
                }
                localStorage.removeItem('telehealth_preselected_doctor_id');
            }

            this.setState({
                listDoctors: res.data,
                selectedDoctor: selectedDoctor
            }, () => {
                this.fetchDoctorProfile(selectedDoctor.id);
            });
        }
    }

    fetchDoctorProfile = async (doctorId) => {
        if (!doctorId) return;
        this.setState({ isLoadingProfile: true });
        try {
            let res = await getProfileDoctorById(doctorId);
            if (res && res.errCode === 0) {
                this.setState({
                    selectedDoctorProfile: res.data
                });
            }
        } catch (e) {
            console.error('Error fetching doctor profile details:', e);
        } finally {
            this.setState({ isLoadingProfile: false });
        }
    }

    handleSelectDoctor = (doc) => {
        this.setState({
            selectedDoctor: doc,
            selectedDoctorProfile: null
        }, () => {
            this.fetchDoctorProfile(doc.id);
        });
    }

    handleRedirectToDoctorDetail = () => {
        const { selectedDoctor } = this.state;
        if (selectedDoctor && selectedDoctor.id) {
            this.props.navigate(`/detail-doctor/${selectedDoctor.id}`);
        }
    }

    renderSkeleton = () => {
        return (
            <div className="dct-skeleton-wrapper">
                <div className="skeleton-header">
                    <div className="skeleton-lines">
                        <div className="skeleton-line shimmer width-40"></div>
                        <div className="skeleton-line shimmer width-60"></div>
                        <div className="skeleton-line shimmer width-30"></div>
                    </div>
                </div>
                <div className="skeleton-card shimmer height-120"></div>
                <div className="skeleton-card shimmer height-160"></div>
            </div>
        );
    }

    render() {
        const { listDoctors, selectedDoctor, selectedDoctorProfile, isLoadingProfile } = this.state;
        const { language } = this.props;

        const doctorName = selectedDoctor ? (
            language === 'vi'
                ? `${selectedDoctor.positionData ? selectedDoctor.positionData.valueVi : 'Bác sĩ'} ${selectedDoctor.lastName} ${selectedDoctor.firstName}`
                : `${selectedDoctor.positionData ? selectedDoctor.positionData.valueEn : 'Doctor'} ${selectedDoctor.firstName} ${selectedDoctor.lastName}`
        ) : '';

        // Extract detailed dynamic fields
        const infoData = selectedDoctorProfile?.doctorinforData;
        const markdownData = selectedDoctorProfile?.markdownData;

        // Dynamic Clinic & Specialty Information
        const specialtyName = infoData?.specialtyData
            ? infoData.specialtyData.name
            : (language === 'vi' ? 'Chuyên khoa Nội tổng quát' : 'General Internal Medicine');

        const clinicName = infoData?.nameClinic || (language === 'vi' ? 'Phòng khám BookingCare' : 'BookingCare Partner Clinic');
        const clinicAddress = infoData?.addressClinic || (language === 'vi' ? 'Đang cập nhật địa chỉ' : 'Address updating');

        // Dynamic Price/Fee formatting
        const priceType = infoData?.priceTypeData;
        const formattedPrice = language === 'vi'
            ? (priceType?.valueVi ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceType.valueVi) : '150.000 ₫')
            : (priceType?.valueEn ? `$${priceType.valueEn}` : '$10');

        // Dynamic Province
        const provinceType = infoData?.provinceTypeData;
        const provinceName = provinceType
            ? (language === 'vi' ? provinceType.valueVi : provinceType.valueEn)
            : (language === 'vi' ? 'Hà Nội' : 'Hanoi');

        // Dynamic Payment
        const paymentType = infoData?.paymentTypeData;
        const paymentMethod = paymentType
            ? (language === 'vi' ? paymentType.valueVi : paymentType.valueEn)
            : (language === 'vi' ? 'Mọi hình thức' : 'All payment methods');

        return (
            <div className="doctor-consultation-container">
                <div className="dct-header">
                    <button className="dct-back" onClick={this.props.onBack}>
                        <i className="fas fa-chevron-left"></i>
                        {language === 'vi' ? 'Quay lại' : 'Back'}
                    </button>
                    <h2>
                        {language === 'vi' ? (
                            <>Tư vấn trực tuyến <span>với Bác sĩ</span></>
                        ) : (
                            <>Telehealth <span>with Doctors</span></>
                        )}
                    </h2>
                </div>

                <div className="dct-layout">
                    {/* Left Sidebar — Doctor Directory */}
                    <div className="dct-sidebar">
                        <div className="sidebar-title">
                            {language === 'vi' ? 'Bác sĩ trực tuyến' : 'Online Doctors'}
                        </div>
                        <div className="doctor-list">
                            {listDoctors.map((doc) => {
                                const docName = language === 'vi'
                                    ? `${doc.positionData ? doc.positionData.valueVi : 'Bác sĩ'} ${doc.lastName} ${doc.firstName}`
                                    : `${doc.positionData ? doc.positionData.valueEn : 'Doctor'} ${doc.firstName} ${doc.lastName}`;

                                return (
                                    <div
                                        key={doc.id}
                                        className={`doctor-item ${selectedDoctor?.id === doc.id ? 'active' : ''}`}
                                        onClick={() => this.handleSelectDoctor(doc)}
                                    >
                                        <div className="di-avatar-wrapper">
                                            <div className="di-avatar" style={{ backgroundImage: `url(${doc.image})` }}></div>
                                            <span className="online-indicator-dot"></span>
                                        </div>
                                        <div className="di-info">
                                            <div className="di-name">{docName}</div>
                                            <div className="di-spec">
                                                {language === 'vi' ? 'Sẵn sàng tư vấn' : 'Available Now'}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Panel — Premium Telehealth Profile Overview */}
                    <div className="dct-profile-panel">
                        {isLoadingProfile ? (
                            this.renderSkeleton()
                        ) : selectedDoctor ? (
                            <div className="profile-wrapper">
                                {/* Dynamic Expertise Description Card */}
                                {markdownData?.description && (
                                    <div className="description-card">
                                        <div className="quote-decorator">“</div>
                                        <p className="description-text">{markdownData.description}</p>
                                    </div>
                                )}

                                {/* Services Details Card */}
                                <div className="services-card">
                                    <h4 className="card-title">
                                        <i className="fas fa-file-medical-alt"></i>
                                        {language === 'vi' ? 'Thông tin Tư vấn & Phòng khám' : 'Consultation & Clinic details'}
                                    </h4>

                                    <div className="services-grid">
                                        <div className="service-grid-item">
                                            <div className="item-icon"><i className="fas fa-money-bill-wave"></i></div>
                                            <div className="item-details">
                                                <div className="item-label">{language === 'vi' ? 'Giá khám' : 'Price'}</div>
                                                <div className="item-value highlighted-fee">{formattedPrice}</div>
                                            </div>
                                        </div>
                                        <div className="service-grid-item">
                                            <div className="item-icon"><i className="fas fa-video"></i></div>
                                            <div className="item-details">
                                                <div className="item-label">{language === 'vi' ? 'Hình thức kết nối' : 'Connection Method'}</div>
                                                <div className="item-value">
                                                    {language === 'vi' ? 'Trò chuyện trực tuyến' : 'Online Chat'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="service-grid-item">
                                            <div className="item-icon"><i className="fas fa-credit-card"></i></div>
                                            <div className="item-details">
                                                <div className="item-label">{language === 'vi' ? 'Hỗ trợ thanh toán' : 'Payment Type'}</div>
                                                <div className="item-value">{paymentMethod}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="clinic-details-block">
                                        <div className="cd-title">
                                            {language === 'vi' ? 'Địa chỉ phòng khám thực tế (Khi cần khám trực tiếp):' : 'Physical Clinic Address (For in-person visits):'}
                                        </div>
                                        <div className="cd-address">
                                            <i className="fas fa-map-signs"></i> {clinicAddress}
                                        </div>
                                    </div>
                                </div>

                                {/* Flow Card */}
                                <div className="flow-card">
                                    <h4 className="card-title">
                                        <i className="fas fa-clipboard-list"></i>
                                        {language === 'vi' ? 'Quy trình kết nối tư vấn' : 'How it works'}
                                    </h4>
                                    <div className="flow-steps">
                                        <div className="step-item">
                                            <span className="step-num">1</span>
                                            <p className="step-text">
                                                {language === 'vi'
                                                    ? 'Click Đăng ký tư vấn để truy cập trang cá nhân bác sĩ.'
                                                    : 'Click Book Appointment to visit the doctor\'s personal profile.'}
                                            </p>
                                        </div>
                                        <div className="step-item">
                                            <span className="step-num">2</span>
                                            <p className="step-text">
                                                {language === 'vi'
                                                    ? 'Xem danh sách ngày khám, chọn khung giờ trực tuyến mong muốn.'
                                                    : 'View schedule calendar and choose your preferred online time slot.'}
                                            </p>
                                        </div>
                                        <div className="step-item">
                                            <span className="step-num">3</span>
                                            <p className="step-text">
                                                {language === 'vi'
                                                    ? 'Xác nhận thông tin đặt khám và tiến hành cuộc gọi tư vấn y khoa.'
                                                    : 'Confirm booking information and start your secure remote consultation.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Booking CTA Footer */}
                                <div className="profile-action-footer">
                                    <button
                                        className="btn-book-telehealth"
                                        onClick={this.handleRedirectToDoctorDetail}
                                    >
                                        <i className="fas fa-calendar-check"></i>
                                        {language === 'vi' ? 'Xem lịch & Đăng ký tư vấn ngay' : 'Book Telehealth Consultation'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="no-doctor-selected">
                                <i className="fas fa-user-md-slash"></i>
                                <p>{language === 'vi' ? 'Vui lòng chọn bác sĩ để xem thông tin tư vấn' : 'Please select a doctor to view details'}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

export default withRouter(connect(mapStateToProps)(DoctorConsultationTab));
