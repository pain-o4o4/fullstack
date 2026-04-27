import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import HomeHeader from './HomeHeader';
import HomeFooter from './HomeFooter';
import CustomBreadcrumb from '../../components/CustomBreadcrumb/CustomBreadcrumb';
import './ContactPage.scss';

class ContactPage extends Component {
    render() {
        const { language } = this.props;
        const breadcrumbItems = [
            { label: language === 'vi' ? 'Trang chủ' : 'Home', link: '/' },
            { label: language === 'vi' ? 'Liên hệ' : 'Contact' }
        ];

        return (
            <div className="contact-page-container">
                <HomeHeader isShowBanner={false} />
                <CustomBreadcrumb items={breadcrumbItems} />
                <div className="contact-content-wrapper">
                    <div className="contact-grid">
                        <div className="contact-info-section">
                            <div className="contact-header">
                                <div className="contact-title">
                                    <FormattedMessage id="contactpage.title" />
                                </div>
                                <div className="contact-subtitle">
                                    <FormattedMessage id="contactpage.subtitle" />
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="info-label"><FormattedMessage id="contactpage.address" /></div>
                                <div className="info-value">
                                    <FormattedMessage id="contactpage.address-value" />
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="info-label"><FormattedMessage id="contactpage.phone" /></div>
                                <div className="info-value">024-7301-2468</div>
                            </div>
                            <div className="info-item">
                                <div className="info-label"><FormattedMessage id="contactpage.email" /></div>
                                <div className="info-value">support@bookingcare.vn</div>
                            </div>
                            <div className="info-item">
                                <div className="info-label"><FormattedMessage id="contactpage.social" /></div>
                                <div className="social-icons">
                                    <a href="#!"><i className="fab fa-linkedin"></i> LinkedIn</a>
                                    <a href="#!"><i className="fab fa-facebook"></i> Facebook</a>
                                </div>
                            </div>
                        </div>

                        <div className="contact-form-section">
                            <form className="hm-contact-form">
                                <div className="form-group">
                                    <label><FormattedMessage id="contactpage.fullname" /></label>
                                    <input type="text" placeholder={this.props.intl.formatMessage({ id: 'contactpage.fullname-placeholder' })} />
                                </div>
                                <div className="form-group">
                                    <label><FormattedMessage id="contactpage.email" /></label>
                                    <input type="email" placeholder={this.props.intl.formatMessage({ id: 'contactpage.email-placeholder' })} />
                                </div>
                                <div className="form-group">
                                    <label><FormattedMessage id="contactpage.phone" /></label>
                                    <input type="tel" placeholder={this.props.intl.formatMessage({ id: 'contactpage.phone-placeholder' })} />
                                </div>
                                <div className="form-group">
                                    <label><FormattedMessage id="contactpage.message" /></label>
                                    <textarea rows="5" placeholder={this.props.intl.formatMessage({ id: 'contactpage.message-placeholder' })}></textarea>
                                </div>
                                <button type="submit" className="hm-button">
                                    <FormattedMessage id="contactpage.send" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <HomeFooter />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

export default injectIntl(connect(mapStateToProps)(ContactPage));
