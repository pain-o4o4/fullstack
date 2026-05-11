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
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/CustomBreadcrumb';
import HomeFooter from '../../HomePage/HomeFooter';
import { getAllClinicService } from '../../../services/userService';
import _ from 'lodash';

class DetailClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataDetailClinic: {},
            arrDoctorId: [],
            avatarFromChild: '',
            listOtherClinics: []
        }
    }

    async componentDidMount() {
        // Lấy id từ params của URL: /detail-clinic/:id
        if (this.props.params && this.props.params.id) {
            let id = this.props.params.id;
            this.props.getDetailClinicById(id);
            await this.fetchAllClinics();
        }
    }

    fetchAllClinics = async () => {
        let res = await getAllClinicService();
        if (res && res.errCode === 0) {
            this.setState({
                listOtherClinics: res.data || []
            });
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

        // Fix: Handle URL parameter changes
        if (this.props.params && this.props.params.id && this.props.params.id !== prevProps.params.id) {
            let id = this.props.params.id;
            this.props.getDetailClinicById(id);
            window.scrollTo(0, 0);
        }
    }

    handleViewOtherClinic = (clinicId) => {
        if (this.props.navigate) {
            this.props.navigate(`/detail-clinic/${clinicId}`);
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
                <CustomBreadcrumb 
                    items={[
                        { label: <FormattedMessage id="homeheader.booking" />, link: '/select-service' },
                        { label: <FormattedMessage id="homeheader.MedicalFacility" />, link: '/all-clinic' },
                        { label: dataDetailClinic?.name || 'Chi tiết cơ sở y tế' }
                    ]} 
                />
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

                    {/* Other Clinics Section */}
                    {this.state.listOtherClinics && this.state.listOtherClinics.length > 1 && (
                        <div className="other-clinics-section">
                            <div className="other-title">
                                <FormattedMessage id="homepage.medical-facility" defaultMessage="Cơ sở y tế nổi bật" />
                            </div>
                            <div className="other-list">
                                {this.state.listOtherClinics
                                    .filter(item => item.id !== +this.props.params.id)
                                    .map((item, index) => (
                                        <div 
                                            className="other-item" 
                                            key={index}
                                            onClick={() => this.handleViewOtherClinic(item.id)}
                                        >
                                            <div 
                                                className="clinic-img"
                                                style={{ backgroundImage: `url(${item.image})` }}
                                            ></div>
                                            <div className="clinic-name">{item.name}</div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )}
                </div>
                <HomeFooter />
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