import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { withRouter } from '../../components/Navigator';
import HomeHeader from '../HomePage/HomeHeader';
import HomeFooter from '../HomePage/HomeFooter';
import Specialty from '../HomePage/Section/Specialty';
import MedicalFacility from '../HomePage/Section/MedicalFacility';
import OutStandingDoctor from '../HomePage/Section/OutStandingDoctor';
import HandBook from '../HomePage/Section/HandBook';
import GlobalSearch from '../../components/GlobalSearch/GlobalSearch';
import './SelectService.scss';
import backgroundBanner from '../../assets/images/premium_medical_banner.png';
import * as action from '../../store/actions';
import { SectionSkeleton } from './SectionSkeleton';

const TAB_CONFIG = [
    { id: 'all', label: 'Tất cả', icon: 'fas fa-th-large' },
    { id: 'doctor', label: 'Đặt khám bác sĩ', icon: 'fas fa-user-md' },
    { id: 'specialty', label: 'Đặt khám chuyên khoa', icon: 'fas fa-notes-medical' },
    { id: 'clinic', label: 'Đặt khám bệnh viện', icon: 'fas fa-hospital' },
];

class SelectService extends Component {
    constructor(props) {
        super(props);
        this.tabsRef = React.createRef();
        this.state = {
            activeTab: 'all',
            currentPage: 1,
            itemsPerPage: 10,
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        if (!this.props.allDoctors || this.props.allDoctors.length === 0) {
            this.props.fetchAllDoctors();
        }
        if (!this.props.allSpecialties || this.props.allSpecialties.length === 0) {
            this.props.fecthAllSpecialties();
        }
        if (!this.props.allClinics || this.props.allClinics.length === 0) {
            this.props.fecthAllClinics();
        }
    }

    handleTabChange = (tabId) => {
        this.setState({ activeTab: tabId, currentPage: 1 });
        if (this.tabsRef.current) {
            this.tabsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    handlePageChange = (page) => {
        this.setState({ currentPage: page });
        if (this.tabsRef.current) {
            this.tabsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    renderPagination = (totalItems) => {
        const { currentPage, itemsPerPage } = this.state;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        if (totalPages <= 1) return null;

        let pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return (
            <div className="pagination-container">
                <button
                    className="btn-pagination"
                    disabled={currentPage === 1}
                    onClick={() => this.handlePageChange(currentPage - 1)}
                >
                    <i className="fas fa-chevron-left"></i>
                </button>

                {startPage > 1 && <span className="pagination-ellipsis">...</span>}

                {pages.map(page => (
                    <button
                        key={page}
                        className={`btn-pagination ${currentPage === page ? 'active' : ''}`}
                        onClick={() => this.handlePageChange(page)}
                    >
                        {page}
                    </button>
                ))}

                {endPage < totalPages && <span className="pagination-ellipsis">...</span>}

                <button
                    className="btn-pagination"
                    disabled={currentPage === totalPages}
                    onClick={() => this.handlePageChange(currentPage + 1)}
                >
                    <i className="fas fa-chevron-right"></i>
                </button>
            </div>
        );
    }

    renderDoctorList = () => {
        const { allDoctors, language, navigate } = this.props;
        const { currentPage, itemsPerPage } = this.state;

        if (!allDoctors || allDoctors.length === 0) return <SectionSkeleton items={4} />;

        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = allDoctors.slice(indexOfFirstItem, indexOfLastItem);

        return (
            <div className="service-list-view">
                <div className="list-items">
                    {currentItems.map((item, index) => {
                        let nameVi = `${item.positionData?.valueVi || 'Bác sĩ'} ${item.lastName} ${item.firstName}`;
                        let nameEn = `${item.positionData?.valueEn || 'Doctor'} ${item.firstName} ${item.lastName}`;
                        return (
                            <div key={index} className="service-list-card doctor" onClick={() => navigate(`/detail-doctor/${item.id}`)}>
                                <div className="card-image" style={{ backgroundImage: `url(${item.image})` }}></div>
                                <div className="card-info">
                                    <h3 className="card-name">{language === 'vi' ? nameVi : nameEn}</h3>
                                    <p className="card-desc">
                                        <span className="specialty-text">{item.doctorinforData?.specialtyData?.name || (language === 'vi' ? 'Chuyên gia y tế' : 'Medical Specialist')}</span>
                                        {item.doctorinforData?.clinicData?.name && (
                                            <>
                                                <span className="separator-dot">•</span>
                                                <span className="clinic-text">{item.doctorinforData.clinicData.name}</span>
                                            </>
                                        )}
                                    </p>
                                    <div className="card-meta">
                                        <span>
                                            <i className="fas fa-map-marker-alt"></i>
                                            {language === 'vi' ? (item.doctorinforData?.provinceTypeData?.valueVi || 'Toàn quốc') : (item.doctorinforData?.provinceTypeData?.valueEn || 'National')}
                                        </span>
                                        <span>
                                            <i className="fas fa-money-bill-wave"></i>
                                            {item.doctorinforData?.priceTypeData ? (
                                                language === 'vi' ? (
                                                    <FormattedNumber value={item.doctorinforData.priceTypeData.valueVi} style="currency" currency="VND" />
                                                ) : (
                                                    <FormattedNumber value={item.doctorinforData.priceTypeData.valueEn} style="currency" currency="USD" />
                                                )
                                            ) : (
                                                language === 'vi' ? 'Liên hệ' : 'Contact'
                                            )}
                                        </span>
                                        <span><i className="fas fa-user-check"></i> {language === 'vi' ? 'Đang trực tuyến' : 'Online'}</span>
                                    </div>
                                </div>
                                <div className="card-actions">
                                    <button className="btn-book">{language === 'vi' ? 'Đặt lịch khám' : 'Book Appointment'} <i className="fas fa-chevron-right"></i></button>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {this.renderPagination(allDoctors.length)}
            </div>
        );
    }

    renderSpecialtyList = () => {
        const { allSpecialties, navigate, language } = this.props;
        const { currentPage, itemsPerPage } = this.state;

        if (!allSpecialties || allSpecialties.length === 0) return <SectionSkeleton items={4} />;

        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = allSpecialties.slice(indexOfFirstItem, indexOfLastItem);

        return (
            <div className="service-list-view">
                <div className="list-items">
                    {currentItems.map((item, index) => (
                        <div key={index} className="service-list-card" onClick={() => navigate(`/detail-specialty/${item.id}`)}>
                            <div className="card-image" style={{ backgroundImage: `url(${item.image})` }}></div>
                            <div className="card-info">
                                <h3 className="card-name">{item.name}</h3>
                                <p className="card-desc">
                                    {item.descriptionMarkdown ? (
                                        item.descriptionMarkdown.length > 120
                                            ? item.descriptionMarkdown.substring(0, 120) + '...'
                                            : item.descriptionMarkdown
                                    ) : (
                                        language === 'vi' ? 'Chuyên khoa y tế uy tín, chất lượng hàng đầu.' : 'Leading medical specialty with reputable services.'
                                    )}
                                </p>
                                <div className="card-meta">
                                    <span><i className="fas fa-user-md"></i> {language === 'vi' ? 'Đội ngũ bác sĩ chuyên môn giỏi' : 'Team of highly skilled specialists'}</span>
                                </div>
                            </div>
                            <div className="card-actions">
                                <button className="btn-book">{language === 'vi' ? 'Xem chi tiết' : 'View Details'} <i className="fas fa-chevron-right"></i></button>
                            </div>
                        </div>
                    ))}
                </div>
                {this.renderPagination(allSpecialties.length)}
            </div>
        );
    }

    renderClinicList = () => {
        const { allClinics, navigate, language } = this.props;
        const { currentPage, itemsPerPage } = this.state;

        if (!allClinics || allClinics.length === 0) return <SectionSkeleton items={4} />;

        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = allClinics.slice(indexOfFirstItem, indexOfLastItem);

        return (
            <div className="service-list-view">
                <div className="list-items">
                    {currentItems.map((item, index) => (
                        <div key={index} className="service-list-card" onClick={() => navigate(`/detail-clinic/${item.id}`)}>
                            <div className="card-image" style={{ backgroundImage: `url(${item.image})` }}></div>
                            <div className="card-info">
                                <h3 className="card-name">{item.name}</h3>
                                <p className="card-desc"><i className="fas fa-map-marker-alt" style={{ marginRight: '6px', color: '#0071e3' }}></i> {item.address}</p>
                                <div className="card-meta">
                                    <span>
                                        <i className="fas fa-info-circle"></i>
                                        {item.descriptionMarkdown ? (
                                            item.descriptionMarkdown.length > 90
                                                ? item.descriptionMarkdown.substring(0, 90) + '...'
                                                : item.descriptionMarkdown
                                        ) : (
                                            language === 'vi' ? 'Cơ sở vật chất hiện đại, dịch vụ y tế chất lượng cao.' : 'Modern facilities and high-quality healthcare services.'
                                        )}
                                    </span>
                                </div>
                            </div>
                            <div className="card-actions">
                                <button className="btn-book">{language === 'vi' ? 'Xem chi tiết' : 'View Details'} <i className="fas fa-chevron-right"></i></button>
                            </div>
                        </div>
                    ))}
                </div>
                {this.renderPagination(allClinics.length)}
            </div>
        );
    }

    render() {
        const { activeTab } = this.state;
        const settings = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1,
            responsive: [
                { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
                { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
                { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } }
            ]
        };

        return (
            <React.Fragment>
                <HomeHeader isShowBanner={false} />
                <div className="select-service-container fade-in">
                    <div className="select-service-banner">
                        <img src={backgroundBanner} alt="Banner" className="banner-img" />
                        <div className="banner-content">
                            <div className="hero-badge">
                                <span className="badge-dot"></span>
                                Nền tảng y tế số tin cậy nhất Việt Nam
                            </div>
                            <h1 className="banner-title"><FormattedMessage id="select-service.title" /></h1>
                            <p className="banner-desc"><FormattedMessage id="select-service.desc" /></p>

                            <div className="banner-search-wrapper">
                                <GlobalSearch isHero={true} />
                            </div>
                        </div>
                    </div>

                    <div className="hm-tabs-section" ref={this.tabsRef}>
                        <div className="hm-tabs-container">
                            <div className="hm-segmented-bar">
                                {TAB_CONFIG.map(tab => (
                                    <button
                                        key={tab.id}
                                        className={`hm-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                                        onClick={() => this.handleTabChange(tab.id)}
                                    >
                                        <i className={tab.icon}></i>
                                        <span>{tab.label}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="select-service-content">
                                {activeTab === 'all' && (
                                    <div className="fade-in">
                                        <Specialty settings={settings} />
                                        <MedicalFacility settings={settings} />
                                        <OutStandingDoctor settings={settings} />
                                        <HandBook settings={settings} />
                                    </div>
                                )}
                                {activeTab === 'doctor' && this.renderDoctorList()}
                                {activeTab === 'specialty' && this.renderSpecialtyList()}
                                {activeTab === 'clinic' && this.renderClinicList()}
                            </div>
                        </div>
                    </div>

                    <HomeFooter />
                </div>
            </React.Fragment>
        );
    }
}


const mapStateToProps = state => ({
    language: state.app.language,
    allDoctors: state.admin.allDoctors,
    allSpecialties: state.admin.allSpecialties,
    allClinics: state.admin.allClinics,
});

const mapDispatchToProps = dispatch => ({
    fetchAllDoctors: () => dispatch(action.fetchAllDoctors()),
    fecthAllSpecialties: () => dispatch(action.fecthAllSpecialties()),
    fecthAllClinics: () => dispatch(action.fecthAllClinics()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SelectService));
