import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AboutData } from './Data/AboutData';   // Đúng

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
                        Some Information About BookingCare
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
                            <h2>About BookingCare</h2>
                            <p>
                                BookingCare is a modern healthcare platform that connects patients with trusted medical specialists and facilities across Vietnam.
                            </p>
                            <p>
                                Our mission is to make quality healthcare more accessible, convenient, and transparent. Whether you're looking for a specialist, booking an appointment, or seeking medical advice, BookingCare provides a seamless experience from start to finish.
                            </p>
                            <p>
                                With thousands of verified doctors, modern clinics, and advanced booking technology, we help millions of Vietnamese people take better care of their health every day.
                            </p>

                            <div className="features">
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    Easy online booking
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    Verified medical specialists
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    Smart appointment reminders
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
