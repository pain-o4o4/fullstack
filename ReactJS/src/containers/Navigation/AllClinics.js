import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from '../../components/Navigator';
import * as action from '../../store/actions';
import HomeHeader from '../HomePage/HomeHeader';
import HomeFooter from '../HomePage/HomeFooter';
import CustomBreadcrumb from '../../components/CustomBreadcrumb/CustomBreadcrumb';
import { FormattedMessage } from 'react-intl';
import './AllClinics.scss';

class AllClinic extends Component {
    componentDidMount() {
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
                <HomeHeader isShowBanner={false} />
                <CustomBreadcrumb 
                    items={[
                        { label: <FormattedMessage id="homeheader.booking" />, link: '/select-service' },
                        { label: <FormattedMessage id="homeheader.MedicalFacility" /> }
                    ]} 
                />



                <div className="all-clinic-body">
                    <div className="list-clinic">
                        {allClinics && allClinics.length > 0 &&
                            allClinics.map((item, index) => {
                                return (
                                    <div key={index}
                                        className="clinic-item"
                                        onClick={() => this.handleViewDetailClinic(item)}
                                    >
                                        <div className="clinic-image-wrapper">
                                            <div className="clinic-image"
                                                style={{ backgroundImage: `url(${item.image})` }}>
                                            </div>
                                        </div>
                                        <div className="clinic-info">
                                            <div className="clinic-name">{item.name}</div>
                                            <div className="clinic-address">
                                                <i className="fas fa-map-marker-alt"></i> {item.address}
                                            </div>
                                            <div className="clinic-action">Xem chi tiết <i className="fas fa-chevron-right"></i></div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

                <HomeFooter />
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