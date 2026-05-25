import React, { Component } from 'react';
import { connect } from "react-redux";
import { getProfileDoctorById } from '../../../services/userService'
import { LANGUAGES } from '../../../utils/constant'
import { withRouter } from '../../../components/Navigator'; // hoặc 'react-router-dom'
import { FormattedMessage } from 'react-intl';
import './ProfileDoctor.scss'
import { FormattedNumber } from 'react-intl';
import _ from 'lodash';
class ProfileDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataProfile: {}
        }
    }


    async componentDidMount() {
        let data = await this.getProfileDoctor(this.props.doctorId)
        if (data && this.props.doctorNameFromParent) {
            this.props.doctorNameFromParent(data.lastName + ' ' + data.firstName);
        }
        this.setState({
            dataProfile: data
        })
    }
    getProfileDoctor = async (doctorId) => {
        let result = {}
        if (doctorId) {
            let res = await getProfileDoctorById(doctorId)
            if (res && res.errCode === 0) {
                result = res.data;
                if (this.props.doctorNameFromParent) {
                    this.props.doctorNameFromParent(res.data.lastName + ' ' + res.data.firstName);
                }

                // Image is now a Cloudinary URL from Backend — no decoding needed


                // GỬI ẢNH LÊN CHO CHA Ở ĐÂY
                if (this.props.doctorImageFromParent) {
                    this.props.doctorImageFromParent(result.image);
                }
            }
        }
        return result
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.doctorId !== prevProps.doctorId) {
            let data = await this.getProfileDoctor(this.props.doctorId)
            this.setState({
                dataProfile: data
            })
        }
    }

    render() {
        let { dataProfile } = this.state
        let { language, isShowDescription, dataTimeModal, isShowPrice } = this.props
        let nameVi = '', nameEn = ''
        if (dataProfile && dataProfile.positionData) {
            nameVi = `${dataProfile.positionData.valueVi} ${dataProfile.lastName} ${dataProfile.firstName}`;
            nameEn = `${dataProfile.positionData.valueEn} ${dataProfile.firstName} ${dataProfile.lastName}`;
        }
        return (
            <div className="profile-doctor-container">
                <div className='intro-doctor'>
                    <div className='content-left'>
                        <img
                            src={dataProfile && dataProfile.image ? dataProfile.image : ''}
                            alt={language === LANGUAGES.VI ? nameVi : nameEn}
                            className="doctor-avatar"
                        />
                    </div>
                    <div className='content-right'>
                        <div className='up'>
                            {language === LANGUAGES.VI ? nameVi : nameEn}
                        </div>
                        <div className='down'>
                            {isShowDescription === false ?
                                <div className="doctor-booking-meta">
                                    {dataTimeModal && (
                                        <div className="meta-pill time-pill">
                                            <i className="far fa-clock"></i>
                                            <span>
                                                {dataTimeModal.timeTypeData && (language === LANGUAGES.VI ? dataTimeModal.timeTypeData.valueVi : dataTimeModal.timeTypeData.valueEn)}
                                                {dataTimeModal.date ? ` - ${dataTimeModal.date}` : ''}
                                            </span>
                                        </div>
                                    )}
                                    {dataProfile && dataProfile.doctorinforData && dataProfile.doctorinforData.clinicData && (
                                        <div className="meta-pill clinic-pill">
                                            <i className="fas fa-hospital-alt"></i>
                                            <span>{dataProfile.doctorinforData.clinicData.name}</span>
                                        </div>
                                    )}
                                </div>
                                :
                                <>
                                    {dataProfile && dataProfile.markdownData
                                        && dataProfile.markdownData
                                            .description && (
                                            <span>{dataProfile.markdownData
                                                .description}</span>
                                        )}
                                </>
                            }
                        </div>
                    </div>
                </div>
                {isShowPrice === true &&
                    <div className="price-info-bar">
                        <span className="price-label">
                            <i className="fas fa-tags"></i>
                            <FormattedMessage id="admin.manage-doctor.price" />:
                        </span>
                        <span className="price-value">
                            {dataProfile && dataProfile.doctorinforData && dataProfile.doctorinforData.priceTypeData && (
                                language === LANGUAGES.VI ? (
                                    <FormattedNumber
                                        value={dataProfile.doctorinforData.priceTypeData.valueVi}
                                        style="currency"
                                        currency="VND"
                                    />
                                ) : (
                                    <FormattedNumber
                                        value={dataProfile.doctorinforData.priceTypeData.valueEn}
                                        style="currency"
                                        currency="USD"
                                    />
                                )
                            )}
                        </span>
                    </div>}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        // // ProfileDoctor: state.admin.ProfileDoctor

    };
};

const mapDispatchToProps = dispatch => {
    return {

        // getProfileDoctor: (id) => dispatch(action.getProfileDoctor(id))
    };
};

// import { withRouter } from 'react-router'; // hoặc 'react-router-dom'
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor));
