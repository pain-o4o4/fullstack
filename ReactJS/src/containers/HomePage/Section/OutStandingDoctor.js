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
import { withRouter } from 'react-router'
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
            console.log('>>> Data mới từ Redux:', this.props.topDoctors);
            this.setState({
                arrDoctors: this.props.topDoctors
            })
        }
    }
    handleViewDetailDoctor = (doctor) => {
        if (this.props.history) {
            this.props.history.push(`/detail-doctor/${doctor.id}`)
        }
    }
    render() {
        let { arrDoctors } = this.state;
        let { language } = this.props;

        return (
            <React.Fragment>
                <div className='section-OutStandingDoctor'>
                    <div className='section-header'>
                        <span className='title-section'>Bác sĩ nổi bật tuần qua</span>
                        <button className='btn-section'>Xem thêm</button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.settings}>
                            {arrDoctors && arrDoctors.length > 0 &&
                                arrDoctors.map((item, index) => {
                                    // Xử lý ảnh
                                    let imageBase64 = '';
                                    if (item.image) {
                                        imageBase64 = Buffer.from(item.image, 'base64').toString('binary');
                                    }

                                    // Hiển thị chức danh + tên
                                    let nameVi = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName}`;
                                    let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`;

                                    return (
                                        <div className='section-customize' key={index}
                                            onClick={() => this.handleViewDetailDoctor(item)}>
                                            <div className='customize-border'>
                                                <div className='outer-bg'>
                                                    {/* Kiểm tra nếu có ảnh thì hiển thị, không thì để ảnh mặc định */}
                                                    <div className='bg-image'
                                                        style={{ backgroundImage: `url(${imageBase64})` }}>
                                                    </div>
                                                </div>
                                                <div className='position text-center'>
                                                    <div className='section-name'>
                                                        {language === LANGUAGES.VI ? nameVi : nameEn}
                                                    </div>
                                                    <div className='section-desc'>Cơ xương khớp</div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
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

// export default connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor);
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor));