import React, { Component } from 'react';
import { connect } from "react-redux";
import { getProfileDoctorById } from '../../../services/userService'
import { LANGUAGES } from '../../../utils/constant'
import { withRouter } from '../../../components/Navigator'; // hoặc 'react-router-dom'
import * as actions from '../../../store/actions';
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
                        <div className="doctor-specialty-badge">
                            {dataProfile && dataProfile.doctorinforData && dataProfile.doctorinforData.specialtyData && dataProfile.doctorinforData.specialtyData.name
                                ? `${language === LANGUAGES.VI ? 'BÁC SĨ CHUYÊN KHOA' : 'SPECIALIST IN'} ${dataProfile.doctorinforData.specialtyData.name.toUpperCase()}`
                                : (language === LANGUAGES.VI ? 'BÁC SĨ ĐIỀU TRỊ' : 'ATTENDING PHYSICIAN')
                            }
                        </div>
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
                        {this.props.isShowContact === true && (
                            <div className="doctor-contact-container">
                                <div className="doctor-contact-info">
                                    {dataProfile && dataProfile.email && (
                                        <div className="info-row" onClick={(e) => e.stopPropagation()}>
                                            <i className="far fa-envelope icon-mail"></i>
                                            <a href={`mailto:${dataProfile.email}`}>{dataProfile.email}</a>
                                        </div>
                                    )}
                                    {dataProfile && dataProfile.phonenumber && (
                                        <div className="info-row" onClick={(e) => e.stopPropagation()}>
                                            <i className="fas fa-phone-alt icon-phone"></i>
                                            <a href={`tel:${dataProfile.phonenumber}`}>{dataProfile.phonenumber}</a>
                                        </div>
                                    )}
                                </div>
                                <div className="doctor-contact-actions">
                                    {dataProfile && dataProfile.phonenumber && (
                                        <a
                                            href={`https://zalo.me/${dataProfile.phonenumber}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="action-btn btn-zalo"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <i className="far fa-comment-dots"></i>
                                            <span>Chat Zalo</span>
                                        </a>
                                    )}
                                    {dataProfile && dataProfile.id && (
                                        <div
                                            className="action-btn btn-chat"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                localStorage.setItem('telehealth_preselected_doctor_id', dataProfile.id);
                                                this.props.toggleChat();
                                            }}
                                        >
                                            <i className="fas fa-comments"></i>
                                            <span>Tư vấn Chat</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
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
        toggleChat: () => dispatch(actions.toggleChat())
    };
};

// import { withRouter } from 'react-router'; // hoặc 'react-router-dom'
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor));
