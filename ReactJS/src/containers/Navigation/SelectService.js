import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { withRouter } from '../../components/Navigator';
import HomeHeader from '../HomePage/HomeHeader';
import HomeFooter from '../HomePage/HomeFooter';
import Specialty from '../HomePage/Section/Specialty';
import MedicalFacility from '../HomePage/Section/MedicalFacility';
import OutStandingDoctor from '../HomePage/Section/OutStandingDoctor';
import HandBook from '../HomePage/Section/HandBook';
import './SelectService.scss';
import bannerService from '../../assets/images/bannerService.png'
import CustomBreadcrumb from '../../components/CustomBreadcrumb/CustomBreadcrumb';
import backgroundBanner from '../../assets/images/premium_medical_banner.png';

class SelectService extends Component {
        componentDidMount() {
        window.scrollTo(0, 0);

    }
    render() {
        const { language } = this.props;
        const breadcrumbItems = [
            { label: language === 'vi' ? 'Trang chủ' : 'Home', link: '/' },
            { label: language === 'vi' ? 'Đặt lịch' : 'Get Care' }
        ];

        const settings = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        };

        return (
            <React.Fragment>
                <HomeHeader isShowBanner={false} />
                <div className="select-service-container fade-in">
                    {/* <CustomBreadcrumb items={breadcrumbItems} /> */}

                    <div className="select-service-banner">
                        <img src={backgroundBanner} alt="Banner" className="banner-img" />
                        <div className="banner-content">
                            <h1 className="banner-title">
                                <FormattedMessage id="select-service.title" />
                            </h1>
                            <p className="banner-desc">
                                <FormattedMessage id="select-service.desc" />
                            </p>
                        </div>
                    </div>

                    <div className="select-service-content">
                        <Specialty settings={settings} />
                        <MedicalFacility settings={settings} />
                        <OutStandingDoctor settings={settings} />
                        <HandBook settings={settings} />
                    </div>
                    <HomeFooter />
                </div>
            </React.Fragment>
        );


    }
}

// ==========================================
// SUB-COMPONENT: SECTION SKELETON
// ==========================================
export const SectionSkeleton = ({ items = 4 }) => {
    return (
        <div className="section-skeleton">
            <div className="skeleton-header">
                <div className="skeleton-title"></div>
                <div className="skeleton-actions">
                    <div className="skeleton-btn-nav"></div>
                    <div className="skeleton-btn-nav"></div>
                    <div className="skeleton-btn-more"></div>
                </div>
            </div>
            <div className="skeleton-body">
                {[...Array(items)].map((_, index) => (
                    <div className="skeleton-card" key={index}>
                        <div className="skeleton-card-img"></div>
                        <div className="skeleton-card-content">
                            <div className="skeleton-card-line short"></div>
                            <div className="skeleton-card-line"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SelectService));
