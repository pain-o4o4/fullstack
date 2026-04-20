import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
class About extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {

        return (
            // let
            <React.Fragment>
                <div className="section-about">
                    <div className="section-header">
                        <FormattedMessage id="homepage.about-more" />
                    </div>

                    <div className="section-body">
                        {/* Video bên trái */}
                        <div className="left-content">
                            <iframe
                                src="https://www.youtube.com/embed/2tM1LFFxeKg"
                                title="Cơ phát triển như thế nào? - Jeffrey Siegel"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            ></iframe>
                        </div>

                        {/* Nội dung bên phải */}
                        <div className="right-content">
                            <h2><FormattedMessage id="homepage.about-title" /></h2>
                            <p>
                                <FormattedMessage id="homepage.about-desc-1" />
                            </p>
                            <p>
                                <FormattedMessage id="homepage.about-desc-2" />
                            </p>
                            <p>
                                <FormattedMessage id="homepage.about-desc-3" />
                            </p>

                            <div className="features">
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <FormattedMessage id="homepage.feature-booking" />
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <FormattedMessage id="homepage.feature-specialist" />
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <FormattedMessage id="homepage.feature-reminder" />
                                </div>
                            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(About);
