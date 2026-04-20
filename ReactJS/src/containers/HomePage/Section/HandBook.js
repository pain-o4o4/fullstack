import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Handbook.scss';
import { FormattedMessage } from 'react-intl';
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
                                                <span className='title-section'>
                            <FormattedMessage id="homepage.handbook" />
                        </span>
                        <button className='btn-section'>
                            <FormattedMessage id="homepage.more" />
                        </button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.settings}>
                            {HandBookData.map((item, index) => {
                                return (
                                    <div className='section-customize' key={index}>
                                        <div
                                            className='bg-image'
                                            style={{ backgroundImage: `url(${item.img})` }}
                                        >
                                            <div className='content-overlay'>
                                                <div className='section-name'>{item.name}</div>
                                                <div className='section-desc'>{item.address}</div>

                                                <div className='section-action'>
                                                    <button className='btn-learn-more'>
                                                        <FormattedMessage id="homepage.detail" />
                                                    </button>
                                                </div>
                                            </div>
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
