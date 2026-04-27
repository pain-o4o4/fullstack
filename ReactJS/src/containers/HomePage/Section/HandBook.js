import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import { getAllHandbookService } from '../../../services/userService';
import { withRouter } from '../../../components/Navigator';
import { path } from '../../../utils/constant';
import * as actions from '../../../store/actions'
import '../../Navigation/MavenSlider.scss';

const DOT_COLORS = ['#00d1b2', '#34d399', '#818cf8', '#fbbf24', '#f472b6'];

class HandBook extends Component {
    constructor(props) {
        super(props);
        this.scrollRef = React.createRef();
        this.state = {
            dataHandbook: this.props.allHandbooks || []
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

    async componentDidMount() {
        if (!this.props.allHandbooks || this.props.allHandbooks.length === 0) {
            this.props.fetchAllHandbooks();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allHandbooks !== this.props.allHandbooks) {
            this.setState({
                dataHandbook: this.props.allHandbooks
            })
        }
    }

    handleViewDetailHandbook = (item) => {
        if (this.props.navigate) {
            this.props.navigate(`/detail-handbook/${item.id}`)
        }
    }

    render() {
        let { dataHandbook } = this.state;
        return (
            <React.Fragment>
                <div className='section-maven'>
                    <div className='section-header'>
                        <span className='title-section'>
                            <FormattedMessage id="homepage.handbook" />
                        </span>
                        <div className='header-actions'>
                            <button className='btn-nav' onClick={this.scrollLeft}>&#10094;</button>
                            <button className='btn-nav' onClick={this.scrollRight}>&#10095;</button>
                            <button className='btn-section'
                                onClick={() => this.props.navigate && this.props.navigate(path.ALL_HANDBOOK)}
                            >
                                <FormattedMessage id="homepage.more" />
                            </button>
                        </div>
                    </div>
                    <div className='section-body'>
                        <div className="maven-slider-wrapper" ref={this.scrollRef}>
                            {dataHandbook && dataHandbook.length > 0 &&
                                dataHandbook.map((item, index) => {
                                    let dotColor = DOT_COLORS[index % DOT_COLORS.length];

                                    return (
                                        <div className="maven-card" key={index} onClick={() => this.handleViewDetailHandbook(item)}>
                                            <div className="maven-card-bg" style={{ backgroundImage: `url(${item.image})` }}></div>
                                            <div className="maven-card-overlay"></div>

                                            <div className="maven-card-indicator">
                                                <span className="dot" style={{ backgroundColor: dotColor }}></span>
                                            </div>

                                            <div className="maven-card-content">
                                                <h3 className="maven-card-title">{item.name}</h3>
                                                <div className="maven-card-reveal">
                                                    <p className="maven-card-desc">
                                                        <FormattedMessage id="homepage.handbook" />
                                                    </p>
                                                    <button className="maven-card-btn" style={{ backgroundColor: dotColor, color: '#fff' }}>
                                                        Learn more
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
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
        allHandbooks: state.admin.allHandbooks
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllHandbooks: () => dispatch(actions.fetchAllHandbooks())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HandBook));
