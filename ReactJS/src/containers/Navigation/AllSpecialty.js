import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from '../../components/Navigator';

import * as action from '../../store/actions';
import HomeHeader from '../HomePage/HomeHeader';
import './AllSpecialty.scss';

class AllSpecialty extends Component {
    componentDidMount() {
        // Tận dụng cơ chế cache: Nếu chưa có data trong redux thì mới gọi API
        if (!this.props.allSpecialties || this.props.allSpecialties.length === 0) {
            this.props.fecthAllSpecialties();
        }
    }

    handleViewDetail = (id) => {
        this.props.navigate(`/detail-specialty/${id}`);
    }

    render() {
        let { allSpecialties } = this.props;
        return (
            <div className="all-specialty-container">
                <HomeHeader />
                <div className="all-specialty-body">
                    <div className="title">Chuyên khoa phổ biến</div>
                    <div className="specialty-grid">
                        {allSpecialties && allSpecialties.map((item, index) => (
                            <div key={index} className="specialty-card" onClick={() => this.handleViewDetail(item.id)}>
                                <div className="bg-image" style={{ backgroundImage: `url(${item.image})` }}></div>
                                <div className="name">{item.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    allSpecialties: state.admin.allSpecialties
});
const mapDispatchToProps = dispatch => ({
    fecthAllSpecialties: () => dispatch(action.fecthAllSpecialties())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AllSpecialty));