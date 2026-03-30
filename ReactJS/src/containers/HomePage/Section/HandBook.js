import React, { Component } from 'react';
import { connect } from 'react-redux';
// import './Specialty.scss';
// import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import { HandBookData } from './Data/HandBookData';   // Đúng
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
class HandBook extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }



    render() {

        return (
            // let
            <React.Fragment>
                <div className='section-handbook'>
                    <div className='section-header'>
                        <span className='title-section'>Handbook</span>
                        <button className='btn-section'>More</button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.settings}>
                            {HandBookData.map((item, index) => {
                                return (
                                    <div className='section-customize' key={index}>
                                        <div className='bg-image' style={{ backgroundImage: `url(${item.img})` }}> </div>
                                        <div className='section-name'>{item.name}</div>
                                        <div className='section-desc'>{item.address}</div>
                                        <div className='section-action'>
                                            <button className='btn-learn-more'>Information</button>
                                            {/* <a href='#' className='link-buy'>Mua ></a> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(HandBook);
