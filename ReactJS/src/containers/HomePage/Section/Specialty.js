import React, { Component } from 'react';
import { connect } from 'react-redux';
// import './Specialty.scss';
// import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import { SpecialtyData } from './Data/SpecialtyData';   // Đúng
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
class Specialty extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }



    render() {

        return (
            // let
            <React.Fragment>
                <div className='section-specialty'>
                    <div className='section-header'>
                        <span className='title-section'>Chuyên khoa phổ biến</span>
                        <button className='btn-section'>Xem thêm</button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.settings}>
                            {SpecialtyData.map((item, index) => {
                                return (
                                    <div className='section-customize' key={index}>
                                        <div className='bg-image' style={{ backgroundImage: `url(${item.img})` }}> </div>
                                        <div className='section-name'>{item.name}</div>
                                        <div className='section-desc'>{item.address}</div>
                                        <div className='section-action'>
                                            <button className='btn-learn-more'>Tìm hiểu thêm</button>
                                            <a href='#' className='link-buy'>Mua ></a>
                                        </div>
                                    </div>

                                )
                            })}

                        </Slider>
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

export default connect(mapStateToProps, mapDispatchToProps)(Specialty);
