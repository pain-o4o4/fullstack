import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as action from '../../../store/actions'
import { FormattedMessage } from 'react-intl';
import { withRouter } from '../../../components/Navigator';
import Slider from 'react-slick';
import { path } from '../../../utils/constant';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../Navigation/MavenSlider.scss';

const DOT_COLORS = ['#00d1b2', '#34d399', '#818cf8', '#fbbf24', '#f472b6'];

class MedicalFacility extends Component {
    constructor(props) {
        super(props);
        this.scrollRef = React.createRef();
        this.state = {
            dataClinics: this.props.allClinics || []
        }
    }

    scrollLeft = () => {
        if (this.scrollRef.current) {
            this.scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    }

    scrollRight = () => {
        if (this.scrollRef.current) {
            this.scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    }

    componentDidMount() {
        if (!this.props.allClinics || this.props.allClinics.length === 0) {
            this.props.fecthAllClinics();
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {

        if (prevProps.allClinics !== this.props.allClinics) {
            this.setState({ dataClinics: this.props.allClinics })
        }
    }
    handleViewDetailClinic = (item) => {
        if (this.props.navigate) {
            this.props.navigate(`/detail-clinic/${item.id}`);
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
            <div className='section-maven'>
                <div className='section-header'>
                    <span className='title-section'>
                        <FormattedMessage id="homepage.clinic" />
                    </span>
                    <div className='header-actions'>
                        <button className='btn-nav' onClick={this.scrollLeft}>&#10094;</button>
                        <button className='btn-nav' onClick={this.scrollRight}>&#10095;</button>
                        <button className='btn-section'
                            onClick={() => this.props.navigate && this.props.navigate(path.ALL_CLINIC)}
                        >
                            <FormattedMessage id="homepage.clinic-explore" />
                        </button>
                    </div>
                </div>

                <div className='section-body'>
                    <div className="maven-slider-wrapper" ref={this.scrollRef}>
                            {this.state.dataClinics && this.state.dataClinics.length > 0 &&
                                this.state.dataClinics.map((item, index) => {
                                    let dotColor = DOT_COLORS[index % DOT_COLORS.length];

                                    return (
                                        <div className="maven-card" key={index} onClick={() => this.handleViewDetailClinic(item)}>
                                            <div className="maven-card-bg" style={{ backgroundImage: `url(${item.image})` }}></div>
                                            <div className="maven-card-overlay"></div>
                                            
                                            <div className="maven-card-indicator">
                                                <span className="dot" style={{ backgroundColor: dotColor }}></span>
                                            </div>
                                            
                                            <div className="maven-card-content">
                                                <h3 className="maven-card-title">{item.name}</h3>
                                                <div className="maven-card-reveal">
                                                    <p className="maven-card-desc">
                                                        {item.address}
                                                    </p>
                                                    <button className="maven-card-btn" style={{ backgroundColor: dotColor, color: '#fff' }}>
                                                        Learn more
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
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
