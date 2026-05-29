import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import { withRouter } from '../../../components/Navigator';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import * as action from '../../../store/actions'
import '../../Navigation/MavenSlider.scss';
import { SectionSkeleton } from '../../Navigation/SelectService';

const DOT_COLORS = ['#00d1b2', '#34d399', '#818cf8', '#fbbf24', '#f472b6'];

class Specialty extends Component {
    constructor(props) {
        super(props);
        this.scrollRef = React.createRef();
        this.state = {
            dataSpecialty: this.props.allSpecialties || [],
            isLoading: !this.props.allSpecialties || this.props.allSpecialties.length === 0
        }
    }

    scrollLeft = () => {
        if (this.scrollRef.current) {
            this.scrollRef.current.scrollBy({ left: -600, behavior: 'smooth' });
        }
    }

    scrollRight = () => {
        if (this.scrollRef.current) {
            this.scrollRef.current.scrollBy({ left: 600, behavior: 'smooth' });
        }
    }

    componentDidMount() {
        if (!this.props.allSpecialties || this.props.allSpecialties.length === 0) {
            this.props.fecthAllSpecialties();
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allSpecialties !== this.props.allSpecialties) {
            this.setState({
                dataSpecialty: this.props.allSpecialties,
                isLoading: false
            })
        }
    }
    handleViewDetailSpecialty = (item) => {
        if (this.props.navigate) {
            this.props.navigate(`/detail-specialty/${item.id}`);
        }
    }
    render() {
        let { dataSpecialty, isLoading } = this.state;

        if (isLoading) {
            return <SectionSkeleton />;
        }

        return (
            <div className='section-maven'>
                <div className='section-header'>
                    <span className='title-section'>
                        <FormattedMessage id="homepage.specialty" />
                    </span>
                    <div className='header-actions'>
                        <button className='btn-nav' onClick={this.scrollLeft}><i className="fas fa-chevron-left"></i></button>
                        <button className='btn-nav' onClick={this.scrollRight}><i className="fas fa-chevron-right"></i></button>
                        <button className='btn-section'
                            onClick={() => this.props.navigate && this.props.navigate('/all-specialty')}
                        >
                            <FormattedMessage id="homepage.more" />
                        </button>
                    </div>
                </div>
                <div className='section-body'>
                    <div className="maven-slider-wrapper" ref={this.scrollRef}>
                        {dataSpecialty && dataSpecialty.length > 0 &&
                            dataSpecialty.map((item, index) => {
                                let dotColor = DOT_COLORS[index % DOT_COLORS.length];

                                return (
                                    <div className="maven-card" key={index} onClick={() => this.handleViewDetailSpecialty(item)}>
                                        <div className="maven-card-bg" style={{ backgroundImage: `url(${item.image})` }}></div>
                                        <div className="maven-card-overlay"></div>

                                        <div className="maven-card-indicator">
                                            <span className="dot" style={{ backgroundColor: dotColor }}></span>
                                        </div>

                                        <div className="maven-card-content">
                                            <h3 className="maven-card-title">{item.name}</h3>
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
