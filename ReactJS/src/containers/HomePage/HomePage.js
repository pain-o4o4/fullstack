import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import HomeHeader from './HomeHeader'
import './HomePage.scss';
import HomeFooter from '../HomePage/HomeFooter';
import { withRouter } from '../../components/Navigator';

// Import images
import backgroundBanner from '../../assets/images/backgroundBanner.avif';
import galleryMri from '../../assets/images/gallery_mri.png';
import galleryControls from '../../assets/images/gallery_controls.png';
import galleryProfessional from '../../assets/images/gallery_professional.png';
import galleryMeeting from '../../assets/images/gallery_meeting.png';
import galleryLogo from '../../assets/images/gallery_logo.png';
import hmReachImg from '../../assets/images/hm_reach.png';
import hmAboutImg from '../../assets/images/hm_about.png';

class HomePage extends Component {

    render() {
        return (
            <div className="hm-page-container">
                <HomeHeader isShowBanner={true} />

                {/* 1. Medicine Banner */}
                <section className="hm-medicine-banner">
                    <div className="hm-medicine-text" data-sal="slide-up">
                        <FormattedMessage id="homepage.medicine-text" />
                    </div>
                </section>

                {/* 2. Offer Section */}
                <section className="hm-offer-section" id="oferta">
                    <div className="hm-section-header">
                        <div className="hm-section-title">
                            <FormattedMessage id="homepage.service" />
                        </div>
                        <span className="hm-section-desc">
                            <FormattedMessage id="homepage.service-desc" />
                        </span>
                    </div>
                    <ul className="hm-offer-list">
                        <li className="hm-offer-item"
                            onClick={() => this.props.navigate('/all-doctor')}
                        >
                            <div className="hm-offer-icon">
                                <img src="https://img.icons8.com/ios/100/0071e3/doctor-male.png" alt="Doctor" />
                            </div>
                            <div className="hm-offer-title">
                                <FormattedMessage id="homepage.find-doctor" />
                            </div>
                            <div className="hm-offer-desc">
                                <FormattedMessage id="homepage.find-doctor-desc" />
                            </div>
                        </li>
                        <li className="hm-offer-item"
                            onClick={() => this.props.navigate('/all-clinic')}
                        >
                            <div className="hm-offer-icon">
                                <img src="https://img.icons8.com/ios/100/0071e3/hospital-2.png" alt="Clinic" />
                            </div>
                            <div className="hm-offer-title">
                                <FormattedMessage id="homepage.clinic" />
                            </div>
                            <div className="hm-offer-desc">
                                <FormattedMessage id="homepage.clinic-desc-short" />
                            </div>
                        </li>
                        <li className="hm-offer-item"
                            onClick={() => this.props.navigate('/all-specialty')}
                        >
                            <div className="hm-offer-icon">
                                <img src="https://img.icons8.com/ios/100/0071e3/medical-heart.png" alt="Specialty" />
                            </div>
                            <div className="hm-offer-title">
                                <FormattedMessage id="homepage.specialty" />
                            </div>
                            <div className="hm-offer-desc">
                                <FormattedMessage id="homepage.specialty-desc-short" />
                            </div>
                        </li>
                    </ul>
                </section>

                {/* --- NEW Gallery Section --- */}
                <section className="hm-gallery-section">
                    <div className="hm-gallery-container">
                        <div className="gallery-grid">
                            <div className="gallery-item large horizontal">
                                <img src={galleryMri} alt="MRI Scanner" />
                            </div>
                            <div className="gallery-item horizontal">
                                <img src={galleryControls} alt="Medical Controls" />
                            </div>
                            <div className="gallery-item vertical">
                                <img src={galleryProfessional} alt="Medical Professional" />
                            </div>
                            <div className="gallery-item square logo-item">
                                <img src={galleryLogo} alt="Logo Block" />
                            </div>
                            <div className="gallery-item vertical">
                                <img src={galleryMeeting} alt="Team Meeting" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Reach Section */}
                <section className="hm-reach-section">
                    <div className="hm-reach-wrapper">
                        <div className="hm-reach-top">
                            <div className="hm-reach-text">
                                <div className="hm-reach-title">
                                    <FormattedMessage id="homepage.reach-title" />
                                </div>
                                <div className="hm-reach-desc">
                                    <FormattedMessage id="homepage.reach-desc" />
                                </div>
                            </div>
                            <div className="hm-reach-image">
                                <img src={hmReachImg} alt="Reach Visualization" />
                            </div>
                        </div>
                        <div className="hm-reach-bottom">
                            <div className="hm-reach-second-title">
                                <FormattedMessage id="homepage.reach-sub" />
                            </div>
                            <ul className="hm-reach-badges">
                                <li className="hm-badge"><FormattedMessage id="homepage.pharma" /></li>
                                <li className="hm-badge"><FormattedMessage id="homepage.medtech" /></li>
                                <li className="hm-badge"><FormattedMessage id="homepage.lab" /></li>
                                <li className="hm-badge"><FormattedMessage id="homepage.science" /></li>
                                <li className="hm-badge"><FormattedMessage id="homepage.healthcare" /></li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 4. About Us Section */}
                <section className="hm-about-section" id="o-nas">
                    <div className="hm-section-header">
                        <div className="hm-section-title">
                            <FormattedMessage id="homepage.about-us" />
                        </div>
                        <span className="hm-section-desc">
                            <FormattedMessage id="homepage.about-us-desc-1" />
                        </span>
                    </div>
                    <div className="hm-about-content">
                        <div className="hm-about-desc">
                            <FormattedMessage id="homepage.about-us-desc-2" />
                        </div>
                        <div className="hm-about-desc">
                            <FormattedMessage id="homepage.about-us-desc-3" />
                        </div>
                        <div className="hm-about-image">
                            <img src={hmAboutImg} alt="Medical Partnership" />
                        </div>
                    </div>
                </section>

                {/* 5. Successes Section */}
                <section className="hm-successes-section">
                    <div className="hm-successes-wrapper">
                        <div className="hm-successes-title">
                            <FormattedMessage id="homepage.success-title" />
                        </div>
                        <ul className="hm-successes-badges">
                            <li className="hm-badge"><FormattedMessage id="homepage.neurosurgery" /></li>
                            <li className="hm-badge"><FormattedMessage id="homepage.cardiology" /></li>
                            <li className="hm-badge"><FormattedMessage id="homepage.vascular" /></li>
                            <li className="hm-badge"><FormattedMessage id="homepage.oncology" /></li>
                            <li className="hm-badge"><FormattedMessage id="homepage.lab-tests" /></li>
                        </ul>
                        <div className="hm-successes-more">
                            <FormattedMessage id="homepage.and-more" />
                        </div>
                    </div>
                </section>

                {/* 6. Merits Section */}
                <section className="hm-merits-section" id="co-nas-wyroznia">
                    <div className="hm-section-header center">
                        <div className="hm-section-title">
                            <FormattedMessage id="homepage.why-choose" />
                        </div>
                        <span className="hm-section-desc">
                            <FormattedMessage id="homepage.why-choose-desc" />
                        </span>
                    </div>
                    <ul className="hm-merits-list">
                        <li className="hm-merits-item">
                            <div className="hm-merits-icon">
                                <img src="https://img.icons8.com/ios/150/0071e3/rocket.png" alt="Motivation" />
                            </div>
                            <div className="hm-merits-title">
                                <FormattedMessage id="homepage.motivation" />
                            </div>
                        </li>
                        <li className="hm-merits-item">
                            <div className="hm-merits-icon">
                                <img src="https://img.icons8.com/ios/150/0071e3/handshake.png" alt="Trust" />
                            </div>
                            <div className="hm-merits-title">
                                <FormattedMessage id="homepage.trust" />
                            </div>
                        </li>
                        <li className="hm-merits-item">
                            <div className="hm-merits-icon">
                                <img src="https://img.icons8.com/ios/150/0071e3/brain.png" alt="Expertise" />
                            </div>
                            <div className="hm-merits-title">
                                <FormattedMessage id="homepage.expertise" />
                            </div>
                        </li>
                    </ul>
                </section>

                {/* 7. Contact Banner */}
                <section className="hm-contact-banner">
                    <div className="hm-banner-wrapper">
                        <div className="hm-banner-col">
                            <div className="hm-banner-icon">
                                <img src="https://img.icons8.com/ios-filled/100/0071e3/mail.png" alt="Contact" />
                            </div>
                        </div>
                        <div className="hm-banner-col">
                            <div className="hm-banner-name">
                                <FormattedMessage id="homepage.support-contact" />
                            </div>
                            <div className="hm-banner-role">
                                <FormattedMessage id="homepage.customer-care" />
                            </div>
                        </div>
                        <div className="hm-banner-col">
                            <div className="hm-banner-desc">
                                <FormattedMessage id="homepage.contact-desc" /><br />
                                <a href="mailto:support@bookingcare.vn">support@bookingcare.vn</a>
                            </div>
                        </div>
                    </div>
                </section>

                <HomeFooter />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

// export default connect(mapStateToProps)(HomePage);
export default withRouter(connect(mapStateToProps)(HomePage));

