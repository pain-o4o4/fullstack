import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Specialty.scss';
// import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import { withRouter } from '../../../components/Navigator';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import * as action from '../../../store/actions'
// import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';
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
    handleViewDetailSpecialty = (item) => {
        if (this.props.navigate) {
            this.props.navigate(`/detail-specialty/${item.id}`);
        }
    }
    render() {
        let { dataSpecialty } = this.state;

        return (
            <div className='section-specialty'>
                <div className='section-header'>
                    <span className='title-section'>Chuyên khoa phổ biến</span>
                    <button className='btn-section'
                        onClick={() => this.props.navigate && this.props.navigate('/all-specialty')}
                    >Xem thêm</button>
                </div>
                <div className='section-body'>
                    <Slider {...this.props.settings}>
                        {dataSpecialty && dataSpecialty.length > 0 &&
                            dataSpecialty.map((item, index) => {
                                return (
                                    <div
                                        className='section-customize'
                                        key={index}
                                        onClick={() => this.handleViewDetailSpecialty(item)}
                                    >
                                        <div className='customize-border'>

                                            <div className='outer-bg'>
                                                <div
                                                    className='bg-image'
                                                    style={{ backgroundImage: `url(${item.image})` }}
                                                />
                                            </div>

                                            <div className='position'>
                                                <div className='section-name'>{item.name}</div>
                                                <div className='section-desc'>Chuyên khoa</div>
                                            </div>

                                        </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Specialty));
