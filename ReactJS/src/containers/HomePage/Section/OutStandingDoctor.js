import React, { Component } from 'react';
import { connect } from 'react-redux';
import './OutStandingDoctor.scss';
// import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import { OutStandingDoctorData } from './Data/OutStandingDoctorData';   // Đúng
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import * as actions from '../../../store/actions'
import { LANGUAGES } from '../../../utils/constant'
class OutStandingDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctors: []
        }
    }
    componentDidMount() {
        this.props.loadTopDoctors();
        console.log('this.props.topDoctors', this.props.topDoctors)
        // loadTopDoctors: () => dispatch(actions.fetchTopDoctor()),

    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.topDoctors !== this.props.topDoctors) {
            this.setState({
                arrDoctors: this.props.topDoctors
            })
        }
    }

    render() {
        let arrDoctors = this.state.arrDoctors
        arrDoctors.forEach((doctor, index) => {
            console.log(`Bác sĩ số ${index}:`, doctor.firstName, doctor.image);
        });
        console.log('arrDoctors', arrDoctors)
        let { language } = this.props
        return (
            // let
            <React.Fragment>
                <div className='section-OutStandingDoctor'>
                    <div className='section-header'>
                        <span className='title-section'>OutStandingDoctor</span>
                        <button className='btn-section'>More</button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.settings}>
                            {arrDoctors && arrDoctors.length > 0 &&
                                arrDoctors.map((item, index) => {
                                    let imageBase64 = '';
                                    if (item.image) {
                                        imageBase64 = Buffer.from(item.image, 'base64').toString('binary');
                                    }
                                    let nameVi = `${item.positionData.valueVi}`;
                                    let nameEn = `${item.positionData.valueEn}`;
                                    return (
                                        <div className='section-customize' key={index}>
                                            <div className='customize-border'>
                                                <div className='outer-bg'>
                                                    <div className='bg-image'
                                                        style={{ backgroundImage: `url(${imageBase64})` }}>
                                                    </div>
                                                </div>
                                                <div className='position text-center'>
                                                    <div className='section-name'>
                                                        {/* So sánh trực tiếp với 'vi' nếu không chắc về biến LANGUAGE */}
                                                        {language === LANGUAGES.VI ? nameVi : nameEn}
                                                    </div>
                                                    <div className='section-desc'>Cơ xương khớp</div>
                                                </div>
                                                <div className='section-action'>
                                                    <button className='btn-learn-more'>Tìm hiểu thêm</button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            {/* ... lặp lại cho các item khác */}
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
        language: state.app.language,
        topDoctors: state.admin.topDoctors
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadTopDoctors: () => dispatch(actions.fetchTopDoctor()),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor);
