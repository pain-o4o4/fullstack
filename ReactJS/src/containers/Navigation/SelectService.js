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

class SelectService extends Component {
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
            <div className="select-service-container">
                <HomeHeader isShowBanner={false} />
                <CustomBreadcrumb items={breadcrumbItems} />

                <div className="select-service-banner"
                    style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${bannerService})` }}
                >
                    <div className="banner-content">
                        <h1 className="banner-title">
                            <FormattedMessage id="select-service.title" />
                        </h1>
                        <p className="banner-desc">
                            <FormattedMessage id="select-service.desc" />
                        </p>
                        <div className="banner-actions">
                            {/* <button className="btn-primary">
                                <FormattedMessage id="select-service.get-care" />
                            </button>
                            <button className="btn-secondary">
                                <FormattedMessage id="select-service.no-insurance" />
                            </button> */}
                        </div>
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
        );
    }
}

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
