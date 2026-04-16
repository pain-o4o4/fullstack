import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as action from '../../../store/actions'
// import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
class MedicalFacility extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataClinics: []
        }
    }
    componentDidMount() {
        this.props.fecthAllClinics();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {

        if (prevProps.allClinics !== this.props.allClinics) {
            this.setState({ dataClinics: this.props.allClinics })
        }
    }
    handleViewDetailClinic = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-clinic/${item.id}`);
        }
    }

    render() {
        let settings = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 3,
            rows: 2,
            slidesPerRow: 1,
            arrows: true,


            responsive: [
                {
                    breakpoint: 767,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        rows: 1,
                        slidesPerRow: 1,
                        arrows: true
                    }
                }
            ]
        };
        return (
            <div className='section-medicalfacility'>
                <div className='medical-facility-container'>

                    <div className='medical-facility-header'>
                        <h2 className='title-section'>Locations</h2>
                        <p className='desc-section'>Learn more about Mayo Clinic locations or choose a specific location.</p>
                        <button className='btn-explore'>Explore all locations</button>
                    </div>


                    <div className='medical-facility-body'>
                        {/* Thêm điều kiện check length ở đây */}
                        {this.state.dataClinics && this.state.dataClinics.length > 0 &&
                            <Slider {...settings}>
                                {this.state.dataClinics.map((item, index) => {
                                    return (
                                        <div
                                            onClick={() => this.handleViewDetailClinic(item)}

                                            className='section-customize'
                                            key={index}>
                                            <div
                                                className='bg-image'
                                                style={{ backgroundImage: `url(${item.image})` }} // Đổi thành item.image
                                            >
                                                <div className='content-overlay'>
                                                    <h3 className='section-name'>{item.name} ›</h3>
                                                    <p className='section-desc'>{item.address}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </Slider>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,
        allClinics: state.admin.allClinics,
        allClinicsLoaded: state.admin.allClinicsLoaded,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getRequiredDoctorInfor: () => dispatch(action.getRequiredDoctorInfor()),
        fecthAllClinics: () => dispatch(action.fecthAllClinics())

    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicalFacility));
