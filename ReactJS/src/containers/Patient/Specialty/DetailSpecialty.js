import React, { Component } from 'react';
import { connect } from "react-redux";
import * as action from '../../../store/actions'
import { LANGUAGES } from '../../../utils/constant'
import { withRouter } from 'react-router'; // hoặc 'react-router-dom'
import { FormattedMessage } from 'react-intl';
import './DetailSpecialty.scss'
import HomeHeader from '../../HomePage/HomeHeader';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import ScheduleDoctor from '../Doctor/ScheduleDoctor';
import ExtraInforDoctor from '../Doctor/ExtraInforDoctor';
import _ from 'lodash';
class DetailSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataDetailSpecialty: {},
            arrDoctorId: []
        }
    }


    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            await this.props.getDetailSpecialtyById(id);
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.detailSpecialty !== prevProps.detailSpecialty) {
            let data = this.props.detailSpecialty;
            if (data && !_.isEmpty(data)) {
                this.setState({
                    dataDetailSpecialty: data,
                    // Chú ý: dùng đúng alias 'doctorSpecialty' Duy đã khai báo ở Model
                    arrDoctorId: data.doctorSpecialty ? data.doctorSpecialty : []
                });
            }
        }
    }
    handleViewDetailDoctor = (doctorId) => {
        if (this.props.history) {
            this.props.history.push(`/detail-doctor/${doctorId}`)
        }
    }

    render() {
        let { dataDetailSpecialty, arrDoctorId } = this.state;
        let { language } = this.props;
        console.log('check state: ', this.state)
        return (
            <React.Fragment>
                <div className="detail-specialty-container">
                    <HomeHeader />
                    <div className="detail-specialty-body">
                        {dataDetailSpecialty && dataDetailSpecialty.image && (
                            <div
                                className="specialty-banner"
                                style={{ backgroundImage: `url(${dataDetailSpecialty.image})` }}
                            >
                                <div className="banner-overlay">
                                    <div className="specialty-name">{dataDetailSpecialty.name}</div>
                                </div>
                            </div>
                        )}

                        {/* Mô tả Chuyên Khoa */}
                        <div className="description-specialty">
                            {dataDetailSpecialty && !_.isEmpty(dataDetailSpecialty) && (
                                <div dangerouslySetInnerHTML={{ __html: dataDetailSpecialty.descriptionHTML }}></div>
                            )}
                        </div>

                        {/* Danh sách Bác sĩ thuộc chuyên khoa */}
                        <div className="specialty-doctor-list">
                            <div className="list-title">Bác sĩ chuyên khoa tiêu biểu</div>
                            {arrDoctorId && arrDoctorId.length > 0 ?
                                arrDoctorId.map((item, index) => {
                                    return (
                                        <div className="each-doctor" key={index}>

                                            <div
                                                className="dt-content-left"
                                                onClick={() => {
                                                    this.handleViewDetailDoctor(item.doctorId)
                                                }}

                                            >
                                                <ProfileDoctor
                                                    doctorId={item.doctorId}
                                                    isShowDescription={true}
                                                    isShowLinkDetail={true}
                                                    isShowPrice={false}
                                                />
                                            </div>
                                            <div className="dt-content-right">
                                                {/* <div className="doctor-schedule">
                                                    <ScheduleDoctor doctorIdFromParent={item.doctorId} />
                                                </div> */}
                                                <div className="doctor-extra-info">
                                                    <ExtraInforDoctor doctorIdFromParent={item.doctorId} />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                                : <div className="no-data">Hiện tại chưa có bác sĩ cho chuyên khoa này.</div>
                            }
                        </div>
                    </div>
                </div>
            </React.Fragment>


        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        // // DetailSpecialty: state.admin.DetailSpecialty
        detailSpecialty: state.admin.detailSpecialty

    };
};

const mapDispatchToProps = dispatch => {
    return {

        getDetailSpecialtyById: (id) => dispatch(action.getDetailSpecialtyById(id))
    };
};

// import { withRouter } from 'react-router'; // hoặc 'react-router-dom'
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty));
