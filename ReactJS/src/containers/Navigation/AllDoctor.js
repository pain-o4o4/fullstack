import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from '../../components/Navigator';
import * as action from '../../store/actions';
import HomeHeader from '../HomePage/HomeHeader';
import HomeFooter from '../HomePage/HomeFooter';
import CustomBreadcrumb from '../../components/CustomBreadcrumb/CustomBreadcrumb';
import { FormattedMessage } from 'react-intl';
import './AllDoctor.scss';

class AllDoctor extends Component {
    componentDidMount() {
        window.scrollTo(0, 0);
        if (!this.props.allDoctors || this.props.allDoctors.length === 0) {
            this.props.fetchAllDoctors();
        }
    }

    handleViewDetailDoctor = (doctor) => {
        this.props.navigate(`/detail-doctor/${doctor.id}`);
    }

    render() {
        let { allDoctors, language } = this.props;
        return (
            <div className="all-doctors-container">
                <HomeHeader isShowBanner={false} />
                <CustomBreadcrumb 
                    items={[
                        { label: <FormattedMessage id="homeheader.booking" />, link: '/select-service' },
                        { label: <FormattedMessage id="homeheader.Physician" /> }
                    ]} 
                />



                <div className="all-doctors-body">
                    <div className="doctors-grid">
                        {allDoctors && allDoctors.length > 0 &&
                            allDoctors.map((item, index) => {
                                let nameVi = `${item.positionData?.valueVi || ''}, ${item.lastName || ''} ${item.firstName || ''}`;
                                let nameEn = `${item.positionData?.valueEn || ''}, ${item.firstName || ''} ${item.lastName || ''}`;
                                
                                let specialtyName = item.doctorinforData?.specialtyData?.name 
                                    || (language === 'vi' ? 'Chuyên khoa Y tế' : 'Medical Specialist');
                                
                                let provinceName = item.doctorinforData?.provinceTypeData
                                    ? (language === 'vi' ? item.doctorinforData.provinceTypeData.valueVi : item.doctorinforData.provinceTypeData.valueEn)
                                    : (language === 'vi' ? 'Toàn quốc' : 'National');

                                let clinicName = item.doctorinforData?.clinicData?.name
                                    || (language === 'vi' ? 'Phòng khám đa khoa' : 'General Clinic');

                                let priceValue = item.doctorinforData?.priceTypeData
                                    ? (language === 'vi' ? `${item.doctorinforData.priceTypeData.valueVi}đ` : `${item.doctorinforData.priceTypeData.valueEn}$`)
                                    : '';

                                return (
                                    <div key={index} className="doctor-card" onClick={() => this.handleViewDetailDoctor(item)}>
                                        <div className="card-top">
                                            <div className="avatar"
                                                style={{ backgroundImage: `url(${item.image})` }}>
                                            </div>
                                        </div>
                                        <div className="card-bottom">
                                            <div className="name">
                                                {language === 'vi' ? nameVi : nameEn}
                                            </div>
                                            <div className="specialty">
                                                {specialtyName}
                                            </div>
                                            <div className="doctor-meta">
                                                <span className="clinic-name" title={clinicName}>
                                                    <i className="fas fa-hospital"></i> {clinicName}
                                                </span>
                                                <span className="location">
                                                    <i className="fas fa-map-marker-alt"></i> {provinceName}
                                                </span>
                                                {priceValue && (
                                                    <span className="price-tag">
                                                        <i className="fas fa-hand-holding-usd"></i> {priceValue}
                                                    </span>
                                                )}
                                            </div>
                                            <button className="btn-detail-apple">
                                                {language === 'vi' ? 'Xem chi tiết' : 'View Profile'} <i className="fas fa-arrow-right"></i>
                                            </button>
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
    allDoctors: state.admin.allDoctors,
    language: state.app.language
});

const mapDispatchToProps = dispatch => ({
    fetchAllDoctors: () => dispatch(action.fetchAllDoctors())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AllDoctor));