import React, { Component } from 'react';
import { connect } from 'react-redux';
// import './OutStandingDoctor.scss';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import * as actions from '../../../store/actions'
import { LANGUAGES, path } from '../../../utils/constant'
import { withRouter } from '../../../components/Navigator';
import '../../Navigation/MavenSlider.scss';

const DOT_COLORS = ['#00d1b2', '#34d399', '#818cf8', '#fbbf24', '#f472b6'];

class OutStandingDoctor extends Component {
    constructor(props) {
        super(props);
        this.scrollRef = React.createRef();
        this.state = {
            arrDoctors: []
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
        if (this.props.navigate) {
            this.props.navigate(`/detail-doctor/${doctor.id}`);
        }
    }
    render() {
        let { arrDoctors } = this.state;
        let { language } = this.props;

        return (
            <React.Fragment>
                <div className='section-maven'>
                    <div className='section-header'>
                        <span className='title-section'>
                            <FormattedMessage id="homepage.doctor" />
                        </span>
                        <div className='header-actions'>
                            <button className='btn-nav' onClick={this.scrollLeft}>&#10094;</button>
                            <button className='btn-nav' onClick={this.scrollRight}>&#10095;</button>
                            <button className='btn-section'
                                onClick={() => this.props.navigate && this.props.navigate(path.ALL_DOCTOR)}
                            >
                                <FormattedMessage id="homepage.more" />
                            </button>
                        </div>
                    </div>
                    <div className='section-body'>
                        <div className="maven-slider-wrapper" ref={this.scrollRef}>
                            {arrDoctors && arrDoctors.length > 0 &&
                                arrDoctors.map((item, index) => {
                                    // Handle image
                                    let imageUrl = '';
                                    if (item.image) {
                                        if (typeof item.image === 'string' && item.image.startsWith('data:')) {
                                            imageUrl = item.image;
                                        } else {
                                            imageUrl = `data:image/jpeg;base64,${item.image}`;
                                        }
                                    }

                                    // Display name
                                    let nameVi = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName}`;
                                    let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`;
                                    let finalName = language === LANGUAGES.VI ? nameVi : nameEn;

                                    // Rotate colors
                                    let dotColor = DOT_COLORS[index % DOT_COLORS.length];

                                    return (
                                        <div className="maven-card" key={index} onClick={() => this.handleViewDetailDoctor(item)}>
                                            <div className="maven-card-bg" style={{ backgroundImage: `url(${imageUrl})` }}></div>
                                            <div className="maven-card-overlay"></div>

                                            <div className="maven-card-indicator">
                                                <span className="dot" style={{ backgroundColor: dotColor }}></span>
                                            </div>

                                            <div className="maven-card-content">
                                                <h3 className="maven-card-title">{finalName}</h3>
                                                <div className="maven-card-reveal">
                                                    <p className="maven-card-desc">
                                                        <FormattedMessage id="homepage.medical-specialty" />
                                                    </p>
                                                    <button className="maven-card-btn" style={{ backgroundColor: dotColor, color: '#fff' }}>
                                                        Learn more
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
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