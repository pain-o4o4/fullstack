import React, { Component } from 'react';
import { connect } from "react-redux";
import { getProfileDoctorById } from '../../../services/userService'
import { LANGUAGES } from '../../../utils/constant'
import { withRouter } from 'react-router'; // hoặc 'react-router-dom'
import { FormattedMessage } from 'react-intl';
import './ProfileDoctor.scss'
import { FormattedNumber } from 'react-intl';
class ProfileDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataProfile: {}
        }
    }


    async componentDidMount() {
        let data = await this.getProfileDoctor(this.props.doctorId)
        this.setState({
            dataProfile: data
        })
    }
    getProfileDoctor = async (doctorId) => {
        let result = {}
        if (doctorId) {
            let res = await getProfileDoctorById(doctorId)
            if (res && res.errCode === 0) {
                result = res.data
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
        let { language, isShowDescription, dataTimeModal } = this.props
        let nameVi = '', nameEn = ''

        if (dataProfile && dataProfile.positionData) {
            nameVi = `${dataProfile.positionData.valueVi}, ${dataProfile.lastName} ${dataProfile.firstName}`;
            nameEn = `${dataProfile.positionData.valueEn}, ${dataProfile.firstName} ${dataProfile.lastName}`;
        }
        console.log('dataProfile', dataProfile)
        return (
            <div className="profile-doctor-container">
                <div className='intro-doctor'>
                    <div className='content-left'
                        style={{ backgroundImage: `url(${dataProfile && dataProfile.image ? dataProfile.image : ''})` }}>
                    </div>
                    <div className='content-right'>
                        <div className='up'>
                            {language === LANGUAGES.VI ? nameVi : nameEn}
                        </div>
                        <div className='down'>
                            {isShowDescription === true ?
                                <>
                                    {dataProfile && dataProfile.Markdown && dataProfile.Markdown.description && (
                                        <span>{dataProfile.Markdown.description}</span>
                                    )}
                                </>
                                :
                                <>
                                    {dataTimeModal && dataTimeModal.timeTypeData && (
                                        <span>{language === LANGUAGES.VI ? dataTimeModal.
                                            timeTypeData.valueVi : dataTimeModal.timeTypeData.
                                            valueEn}
                                        </span>

                                    )}
                                    {dataTimeModal && dataTimeModal.date && (
                                        <span> - {dataTimeModal.date}</span>
                                    )}
                                </>
                            }
                        </div>
                    </div>
                </div>
                <div className="price">
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
                </div>
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
