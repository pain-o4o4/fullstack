import React, { Component } from 'react';
import { connect } from "react-redux";
import { LANGUAGES } from '../../../utils/constant';
import { withRouter } from '../../../components/Navigator';
import { FormattedMessage } from 'react-intl';
import './DetailClinic.scss';
import HomeHeader from '../../HomePage/HomeHeader';
import * as action from '../../../store/actions';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import ScheduleDoctor from '../Doctor/ScheduleDoctor';
import ExtraInforDoctor from '../Doctor/ExtraInforDoctor';
import _ from 'lodash';

class DetailClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataDetailClinic: {},
            arrDoctorId: [],
            avatarFromChild: ''
        }
    }

    async componentDidMount() {
        // Lấy id từ params của URL: /detail-clinic/:id
        if (this.props.params && this.props.params.id) {
            let id = this.props.params.id;
            this.props.getDetailClinicById(id);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // Khi Redux nhận được dữ liệu mới, cập nhật vào state của component
        if (prevProps.detailClinic !== this.props.detailClinic) {
            let data = this.props.detailClinic;
            let arrDoctorId = [];
            if (data && !_.isEmpty(data.doctorClinic)) {
                arrDoctorId = data.doctorClinic;
            }

            this.setState({
                dataDetailClinic: data,
                arrDoctorId: arrDoctorId
            })
        }
    }
    handleGetImageFromChild = (image) => {
        if (image && this.state.avatarFromChild !== image) {
            this.setState({
                avatarFromChild: image
            })
        }
    }
    handleViewDetailDoctor = (doctorId) => {
        if (this.props.navigate) {
            this.props.navigate(`/detail-doctor/${doctorId}`);
        }
    }
    render() {
        let { dataDetailClinic, arrDoctorId } = this.state;
        return (
            <div className="detail-clinic-container">
                <HomeHeader />
                <div className="detail-clinic-body">
                    {/* THÊM KHỐI BANNER NÀY VÀO */}
                    {dataDetailClinic && dataDetailClinic.image && (
                        <div
                            className="clinic-banner"
                            style={{ backgroundImage: `url(${dataDetailClinic.image})` }}
                        >
                            <div className="banner-overlay">
                                <div className="clinic-name-inside">{dataDetailClinic.name}</div>
                            </div>
                        </div>
                    )}
                    <div className="clinic-description">
                        {dataDetailClinic && !_.isEmpty(dataDetailClinic) && (
                            <>
                                {/* Tớ bỏ tên ở đây vì đã đưa lên banner cho sang rồi Duy nhé */}
                                <div className="clinic-address">{dataDetailClinic.address}</div>
                                <div dangerouslySetInnerHTML={{ __html: dataDetailClinic.descriptionHTML }}></div>
                            </>
                        )}
                    </div>

                    <div className="clinic-doctor-list">
                        {arrDoctorId && arrDoctorId.length > 0 &&
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
                                                isShowDescriptionDoctor={true}
                                                isShowLinkDetail={true}
                                                isShowPrice={false}
                                                doctorImageFromParent={this.handleGetImageFromChild}
                                            />

                                        </div>
                                        <div className="dt-content-right">
                                            {/* <ScheduleDoctor doctorIdFromParent={item.doctorId} /> */}
                                            <ExtraInforDoctor doctorIdFromParent={item.doctorId} />
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        detailClinic: state.admin.detailClinic,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getDetailClinicById: (id) => dispatch(action.getDetailClinicById(id)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DetailClinic));