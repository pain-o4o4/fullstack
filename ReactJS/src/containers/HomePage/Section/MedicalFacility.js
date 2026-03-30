import React, { Component } from 'react';
import { connect } from 'react-redux';
// import './MedicalFacility.scss';
// import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { medicalFacilities } from './Data/medicalFacilitiesData'
class MedicalFacility extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }



    render() {
        let settings = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 3,
            rows: 2, // Đây là chìa khóa để ra 2 hàng
            slidesPerRow: 1,
        };

        return (
            <div className='section-medicalfacility'>
                <div className='medical-facility-container'>
                    {/* Khối bên trái: Tiêu đề */}
                    <div className='medical-facility-header'>
                        <h2 className='title-section'>Locations</h2>
                        <p className='desc-section'>Learn more about Mayo Clinic locations or choose a specific location.</p>
                        <button className='btn-explore'>Explore all locations</button>
                    </div>

                    {/* Khối bên phải: Slider 6 ô */}
                    <div className='medical-facility-body'>
                        <Slider {...settings}>
                            {medicalFacilities.map((item, index) => {
                                return (
                                    <div className='section-customize' key={index}>
                                        <div className='bg-image' style={{ backgroundImage: `url(${item.img})` }}>
                                            <div className='content-overlay'>
                                                <h3 className='section-name'>{item.name} ›</h3>
                                                <p className='section-desc'>{item.address}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </Slider>
                    </div>
                </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(MedicalFacility);
