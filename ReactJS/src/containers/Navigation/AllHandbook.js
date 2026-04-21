import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from '../../components/Navigator';
import * as actions from '../../store/actions';
import HomeHeader from '../HomePage/HomeHeader';
import './AllHandbook.scss';

class AllHandbook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataHandbook: this.props.allHandbooks || []
        }
    }

    componentDidMount() {
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

    handleViewDetail = (id) => {
        this.props.navigate(`/detail-handbook/${id}`);
    }

    render() {
        let { dataHandbook } = this.state;
        return (
            <div className="all-handbook-container">
                <HomeHeader />
                <div className="all-handbook-body">
                    <div className="title">Cẩm nang y tế</div>
                    <div className="handbook-grid">
                        {dataHandbook && dataHandbook.length > 0 && 
                            dataHandbook.map((item, index) => {
                                return (
                                    <div key={index} className="handbook-card" onClick={() => this.handleViewDetail(item.id)}>
                                        <div className="bg-image" style={{ backgroundImage: `url(${item.image})` }}></div>
                                        <div className="name">{item.name}</div>
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
        language: state.app.language,
        allHandbooks: state.admin.allHandbooks
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllHandbooks: () => dispatch(actions.fetchAllHandbooks())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AllHandbook));
