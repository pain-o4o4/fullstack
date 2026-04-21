import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Handbook.scss';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import { getAllHandbookService } from '../../../services/userService';
import { withRouter } from '../../../components/Navigator';
import { path } from '../../../utils/constant';
import * as actions from '../../../store/actions'

class HandBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataHandbook: this.props.allHandbooks || []
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
                <div className='section-handbook'>
                    <div className='section-header'>
                        <span className='title-section'>
                            <FormattedMessage id="homepage.handbook" />
                        </span>
                        <button className='btn-section'
                            onClick={() => this.props.navigate && this.props.navigate(path.ALL_HANDBOOK)}
                        >
                            <FormattedMessage id="homepage.more" />
                        </button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.settings}>
                            {dataHandbook && dataHandbook.length > 0 &&
                                dataHandbook.map((item, index) => {
                                    return (
                                        <div className='section-customize' key={index}
                                            onClick={() => this.handleViewDetailHandbook(item)}
                                        >
                                            <div
                                                className='bg-image'
                                                style={{ backgroundImage: `url(${item.image})` }}
                                            >
                                                <div className='content-overlay'>
                                                    <div className='section-name'>{item.name}</div>
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
