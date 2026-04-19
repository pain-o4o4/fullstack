import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from '../../components/Navigator';
import * as action from '../../store/actions';
import HomeHeader from '../HomePage/HomeHeader';
import './AllClinics.scss';

class AllClinic extends Component {
    componentDidMount() {
        // Tận dụng dữ liệu đã có trong Redux từ trang chủ
        if (!this.props.allClinics || this.props.allClinics.length === 0) {
            this.props.fetchAllClinics();
        }
    }

    handleViewDetailClinic = (item) => {
        if (this.props.navigate) {
            this.props.navigate(`/detail-clinic/${item.id}`);
        }
    }

    render() {
        let { allClinics } = this.props;
        return (
            <div className="all-clinic-container">
                <HomeHeader />
                <div className="all-clinic-body">
                    <div className="title-section">Tất cả cơ sở y tế</div>
                    <div className="list-clinic">
                        {allClinics && allClinics.length > 0 &&
                            allClinics.map((item, index) => {
                                return (
                                    <div key={index}
                                        className="clinic-item"
                                        onClick={() => this.handleViewDetailClinic(item)}
                                    >
                                        <div className="clinic-image"
                                            style={{ backgroundImage: `url(${item.image})` }}>
                                        </div>
                                        <div className="clinic-info">
                                            <div className="clinic-name">{item.name}</div>
                                            <div className="clinic-address">
                                                <i className="fas fa-map-marker-alt"></i> {item.address}
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

const mapStateToProps = state => ({
    allClinics: state.admin.allClinics
});
const mapDispatchToProps = dispatch => ({
    fetchAllClinics: () => dispatch(action.fecthAllClinics())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AllClinic));