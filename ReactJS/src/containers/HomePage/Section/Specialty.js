import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Specialty.scss';
// import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import { SpecialtyData } from './Data/SpecialtyData';   // Đúng
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import * as action from '../../../store/actions'
class Specialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSpecialty: []
        }
    }
    componentDidMount() {
        this.props.fecthAllSpecialties();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allSpecialties !== this.props.allSpecialties) {
            this.setState({
                dataSpecialty: this.props.allSpecialties
            })
        }
    }

    render() {
        let { dataSpecialty } = this.state;

        return (
            <div className='section-specialty'>
                <div className='section-header'>
                    <span className='title-section'>Chuyên khoa phổ biến</span>
                    <button className='btn-section'>Xem thêm</button>
                </div>
                <div className='section-body'>
                    <Slider {...this.props.settings}>
                        {dataSpecialty && dataSpecialty.length > 0 &&
                            dataSpecialty.map((item, index) => {
                                return (
                                    <div className='section-customize' key={index}>
                                        <div
                                            className='bg-image'
                                            style={{ backgroundImage: `url(${item.image})` }} // Dùng item.image từ DB
                                        ></div>
                                        <div className='section-name'><span>{item.name}</span></div>

                                    </div>
                                )
                            })
                        }
                    </Slider>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        allSpecialties: state.admin.allSpecialties
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fecthAllSpecialties: () => dispatch(action.fecthAllSpecialties())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Specialty);
