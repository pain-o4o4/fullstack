import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
class HomeFooter extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {

        return (
            // let
            <React.Fragment>
                <div className="section-homefooter">
                    <div className="footer-content">
                        <p>
                            <FormattedMessage id="homepage.footer-rights" />
                            <a href="#!"> <FormattedMessage id="homepage.footer-terms" /></a> |
                            <a href="#!"> <FormattedMessage id="homepage.footer-privacy" /></a>
                        </p>
                        <div className="social-links">
                            <a target="_blank" href="https://www.facebook.com/milah.o6o4/directory_links"><i className="fab fa-facebook-square"></i></a>
                            <a target="_blank" href="https://www.instagram.com/pain.o4o4?fbclid=IwY2xjawQzdS9leHRuA2FlbQIxMABicmlkETFDRWZJNXhOMmU4MnBjYU16c3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHj0Et49carKwZLSL3GCzoX-5eaVl8rr7kntJqG6_5Vx3Eyv47maOdrwYaIJM_aem_PPPexNdm2TmlM3XqbtE5Xg"><i className="fab fa-youtube"></i></a>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
