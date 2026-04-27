import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import './HomeFooter.scss';

class HomeFooter extends Component {
    render() {
        return (
            <footer className="hm-footer">
                <div className="hm-footer-top">
                    <div className="hm-footer-col">
                        <div className="hm-footer-logo">
                            <span className="logo-text">BookingCare</span>
                        </div>
                        <div className="hm-footer-desc">
                            <FormattedMessage id="homefooter.desc" />
                        </div>
                    </div>
                    <div className="hm-footer-col">
                        <div className="footer-title"><FormattedMessage id="homefooter.address" /></div>
                        <div className="footer-text">28 Thành Thái, Cầu Giấy, Hà Nội</div>
                        <div className="footer-text">Tel: 024-7301-2468</div>
                    </div>
                    <div className="hm-footer-col">
                        <div className="footer-title"><FormattedMessage id="homefooter.contact" /></div>
                        <div className="footer-text">Email: support@bookingcare.vn</div>
                        <div className="footer-text">Website: bookingcare.vn</div>
                    </div>
                    <div className="hm-footer-col">
                        <div className="footer-title"><FormattedMessage id="homefooter.follow-us" /></div>
                        <div className="social-links">
                            <a href="#!"><i className="fab fa-facebook"></i></a>
                            <a href="#!"><i className="fab fa-linkedin"></i></a>
                            <a href="#!"><i className="fab fa-instagram"></i></a>
                        </div>
                    </div>
                </div>
                <div className="hm-footer-bottom">
                    <div className="footer-copyright">
                        <FormattedMessage id="homefooter.copyright" />
                    </div>
                    <div className="footer-legal">
                        <a href="#!"><FormattedMessage id="homefooter.privacy" /></a>
                        <a href="#!"><FormattedMessage id="homefooter.terms" /></a>
                    </div>
                </div>
            </footer>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

export default connect(mapStateToProps)(HomeFooter);
