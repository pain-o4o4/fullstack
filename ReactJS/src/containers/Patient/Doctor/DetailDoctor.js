import React, { Component } from 'react';
import { connect } from "react-redux";

import { withRouter } from '../../../components/Navigator';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../../utils/constant'
import './DetailDoctor.scss'
import HomeHeader from '../../HomePage/HomeHeader';
import * as action from '../../../store/actions'
import ScheduleDoctor from './ScheduleDoctor'
import ExtraInforDoctor from './ExtraInforDoctor'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/CustomBreadcrumb';
import HomeFooter from '../../HomePage/HomeFooter';
import ProfileDoctor from './ProfileDoctor';
import { getDetailSpecialtyByIdService } from '../../../services/userService';
import DoctorDetailSkeleton from '../../../components/Skeleton/DoctorDetailSkeleton';

class DetailDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailDoctor: {},
            currentDoctorId: this.props.params && this.props.params.id ? this.props.params.id : -1,
            selectedClinicData: null,
            listRelatedDoctors: [],
            isLoading: true
        }
    }

    async componentDidMount() {
        if (this.props.params && this.props.params.id) {
            let id = this.props.params.id;
            this.setState({
                currentDoctorId: id,
                isLoading: true
            });

            // Parallelize if possible, but here we need detailDoctor for specialtyId
            // We await the main detail first
            await this.props.getDetailDoctor(id);

            // After detailDoctor is in Redux, it will trigger componentDidUpdate 
            // but we can also set isLoading false here if we want more control
        }
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.detailDoctor !== this.props.detailDoctor) {
            let detailDoctor = this.props.detailDoctor;
            this.setState({
                detailDoctor: detailDoctor,
            })

            // Load related doctors when detailDoctor is available
            if (detailDoctor && detailDoctor.doctorinforData && detailDoctor.doctorinforData.specialtyId) {
                await this.fetchRelatedDoctors(detailDoctor.doctorinforData.specialtyId);
            }

            // Set loading to false after both detail and related are fetched (or at least detail)
            this.setState({ isLoading: false });
        }
        if (prevProps.params && this.props.params && prevProps.params.id !== this.props.params.id) {
            let id = this.props.params.id;
            this.setState({
                currentDoctorId: id,
                isLoading: true,
                listRelatedDoctors: [] // Reset related list
            });
            this.props.getDetailDoctor(id);
            window.scrollTo(0, 0);
        }
    }

    fetchRelatedDoctors = async (specialtyId) => {
        let res = await getDetailSpecialtyByIdService(specialtyId);
        if (res && res.errCode === 0 && res.data && res.data.doctorSpecialty) {
            let list = res.data.doctorSpecialty;
            // Filter out the current doctor
            list = list.filter(item => item.doctorId !== +this.state.currentDoctorId);
            this.setState({
                listRelatedDoctors: list
            });
        }
    }

    handleViewDetail = (data, type) => {
        if (type === "DOCTOR") {
            this.props.navigate(`/detail-doctor/${data.doctorId}`);
        } else if (type === "SPECIALTY") {
            this.props.navigate(`/detail-specialty/${data.id}`);
        } else if (type === "CLINIC") {
            this.props.navigate(`/detail-clinic/${data.id}`);
        } else return;
    }
    handleClinicSelection = (clinicData) => {
        this.setState({
            selectedClinicData: clinicData
        });
    }

    handleStartChat = () => {
        if (this.state.currentDoctorId) {
            localStorage.setItem('telehealth_preselected_doctor_id', this.state.currentDoctorId);
            if (this.props.toggleChat) {
                this.props.toggleChat();
            }
        }
    }

    render() {
        let { detailDoctor, selectedClinicData } = this.state;
        let { language } = this.props;
        let nameVi = '', nameEn = '';

        if (detailDoctor && detailDoctor.positionData) {
            nameVi = `${detailDoctor.positionData.valueVi} ${detailDoctor.lastName} ${detailDoctor.firstName}`;
            nameEn = `${detailDoctor.positionData.valueEn} ${detailDoctor.firstName} ${detailDoctor.lastName}`;
        }

        return (
            <React.Fragment>
                <HomeHeader isShowBanner={false} />
                <CustomBreadcrumb
                    items={[
                        { label: <FormattedMessage id="homeheader.booking" />, link: '/select-service' },
                        { label: <FormattedMessage id="homeheader.Physician" />, link: '/all-doctor' },
                        { label: <FormattedMessage id="homepage.detail-doctor" /> }
                    ]}
                />

                <div className='doctor-detail-container'>
                    {this.state.isLoading ? (
                        <DoctorDetailSkeleton />
                    ) : (
                        <>
                            <div className='intro-doctor'>
                                <div className='content-left'
                                    style={{ backgroundImage: `url(${detailDoctor && detailDoctor.image ? detailDoctor.image : ''})` }}>
                                </div>
                                <div className='content-right'>
                                    <div className='up'>
                                        {language === LANGUAGES.VI ? nameVi : nameEn}
                                    </div>

                                    {/* Clean, high-end subtitle with bullet separator (Apple specification style) */}
                                    <div className='doctor-subtitle-meta'>
                                        {detailDoctor?.doctorinforData?.specialtyData?.name && (
                                            <span className='meta-item' onClick={() => this.handleViewDetail({ id: detailDoctor.doctorinforData.specialtyId || detailDoctor.doctorinforData.specialtyData.id }, 'SPECIALTY')}>
                                                <i className='fas fa-stethoscope'></i> {detailDoctor.doctorinforData.specialtyData.name}
                                            </span>
                                        )}
                                        {detailDoctor?.doctorinforData?.specialtyData?.name && detailDoctor?.doctorinforData?.clinicData?.name && (
                                            <span className='meta-divider'>•</span>
                                        )}
                                        {detailDoctor?.doctorinforData?.clinicData?.name && (
                                            <span className='meta-item' onClick={() => this.handleViewDetail({ id: detailDoctor.doctorinforData.clinicId || detailDoctor.doctorinforData.clinicData.id }, 'CLINIC')}>
                                                <i className='fas fa-hospital'></i> {detailDoctor.doctorinforData.clinicData.name}
                                            </span>
                                        )}
                                    </div>

                                    <div className='down'>
                                        {detailDoctor && detailDoctor.markdownData && detailDoctor.markdownData.description
                                            && <span>{detailDoctor.markdownData.description}</span>
                                        }
                                    </div>

                                    {/* Sleek, Apple-style Hero Actions Row */}
                                    <div className='doctor-hero-actions'>
                                        <button
                                            onClick={this.handleStartChat}
                                            className='btn-quick-chat'
                                            title={language === 'vi' ? 'Trò chuyện trực tuyến ngay với bác sĩ này' : 'Chat now online with this doctor'}>
                                            <i className="fas fa-comments"></i>
                                            {language === 'vi' ? 'Tư vấn trực tuyến' : 'Consult Online'}
                                        </button>

                                        {detailDoctor?.phonenumber && (
                                            <a href={`tel:${detailDoctor.phonenumber}`} className='action-secondary-link' title="Bấm để gọi ngay">
                                                <i className='fas fa-phone-alt'></i> {language === 'vi' ? 'Gọi ngay' : 'Call'}
                                            </a>
                                        )}
                                        {detailDoctor?.email && (
                                            <a href={`mailto:${detailDoctor.email}`} className='action-secondary-link' title="Bấm để gửi email">
                                                <i className='fas fa-envelope'></i> {language === 'vi' ? 'Gửi Email' : 'Email'}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className='schedule-doctor'>
                                <div className='content-left'>
                                    <ScheduleDoctor
                                        doctorIdFromParent={this.state.currentDoctorId}
                                        handleClinicSelection={this.handleClinicSelection}
                                    />
                                </div>
                                <div className='content-right'>
                                    <ExtraInforDoctor
                                        doctorIdFromParent={this.state.currentDoctorId}
                                        clinicData={selectedClinicData}
                                    />
                                </div>
                            </div>
                            {/* Hiển thị nội dung Markdown bằng dangerouslySetInnerHTML */}
                            <div className='detail-info-doctor'>
                                {detailDoctor && detailDoctor.markdownData && detailDoctor.markdownData.contentHTML
                                    && <div dangerouslySetInnerHTML={{ __html: detailDoctor.markdownData.contentHTML }}></div>
                                }
                            </div>

                            {/* Related Doctors Section */}
                            {this.state.listRelatedDoctors && this.state.listRelatedDoctors.length > 0 && (
                                <div className="related-doctors-section">
                                    <div className="related-title">
                                        <FormattedMessage id="homepage.outstanding-doctor" defaultMessage="Bác sĩ nổi bật" />
                                    </div>
                                    <div className="related-list">
                                        {this.state.listRelatedDoctors.map((item, index) => (
                                            <div className="related-item" key={index} onClick={() => this.handleViewDetail(item, "DOCTOR")}>
                                                <ProfileDoctor
                                                    doctorId={item.doctorId}
                                                    isShowDescription={true}
                                                    isShowPrice={false}
                                                />
                                                <div className="view-more">
                                                    <FormattedMessage id="homepage.more-info" defaultMessage="Xem thêm" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
                <HomeFooter />
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        detailDoctor: state.admin.detailDoctor

    };
};

const mapDispatchToProps = dispatch => {
    return {
        getDetailDoctor: (id) => dispatch(action.getDetailDoctor(id)),
        toggleChat: () => dispatch(action.toggleChat())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DetailDoctor));
