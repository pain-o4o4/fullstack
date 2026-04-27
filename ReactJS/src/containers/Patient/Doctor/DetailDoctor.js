import React, { Component } from 'react';
import { connect } from "react-redux";

import { withRouter } from '../../../components/Navigator';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../../utils/constant'
import './DetailDoctor.scss'
import HomeHeader from '../../HomePage/HomeHeader';
import * as action from '../../../store/actions'
import ScheduleDoctor from './ScheduleDoctor'
import ExtraInforDoctor from './ExtraInforDoctor'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/CustomBreadcrumb';
class DetailDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailDoctor: {},
            currentDoctorId: this.props.params && this.props.params.id ? this.props.params.id : -1,
            selectedClinicData: null,
        }
    }

    componentDidMount() {

        if (this.props.params && this.props.params.id) {
            let id = this.props.params.id;
            this.setState({
                currentDoctorId: id // Thêm dòng này
            });
            this.props.getDetailDoctor(id);
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.detailDoctor !== this.props.detailDoctor) {
            this.setState({
                detailDoctor: this.props.detailDoctor
            })
        }
        if (prevProps.params && this.props.params && prevProps.params.id !== this.props.params.id) {
            let id = this.props.params.id;
            this.setState({
                currentDoctorId: id
            });
            this.props.getDetailDoctor(id);
        }
    }
    handleClinicSelection = (clinicData) => {
        this.setState({
            selectedClinicData: clinicData
        });
    }

    render() {
        let { detailDoctor, selectedClinicData } = this.state;
        let { language } = this.props;
        let nameVi = '', nameEn = '';

        if (detailDoctor && detailDoctor.positionData) {
            nameVi = `${detailDoctor.positionData.valueVi}, ${detailDoctor.lastName} ${detailDoctor.firstName}`;
            nameEn = `${detailDoctor.positionData.valueEn}, ${detailDoctor.firstName} ${detailDoctor.lastName}`;
        }

        return (
            <React.Fragment>
                <HomeHeader isShowBanner={false} />
                <CustomBreadcrumb 
                    items={[
                        { label: <FormattedMessage id="homeheader.booking" />, link: '/select-service' },
                        { label: <FormattedMessage id="homeheader.Physician" />, link: '/all-doctor' },
                        { label: <FormattedMessage id="homepage.detail-doctor" /> }
                    ]} 
                />

                <div className='doctor-detail-container'>
                    <div className='intro-doctor'>
                        <div className='content-left'
                            style={{ backgroundImage: `url(${detailDoctor && detailDoctor.image ? detailDoctor.image : ''})` }}>
                        </div>
                        <div className='content-right'>
                            <div className='up'>
                                {language === LANGUAGES.VI ? nameVi : nameEn}
                            </div>
                            <div className='down'>
                                {detailDoctor && detailDoctor.markdownData && detailDoctor.markdownData.description
                                    && <span>{detailDoctor.markdownData.description}</span>
                                }
                            </div>
                        </div>
                    </div>
                    <div className='schedule-doctor'>
                        <div className='content-left'>
                            <ScheduleDoctor
                                doctorIdFromParent={this.state.currentDoctorId}
                                handleClinicSelection={this.handleClinicSelection}
                            />
                        </div>
                        <div className='content-right'>
                            <ExtraInforDoctor
                                doctorIdFromParent={this.state.currentDoctorId}
                                clinicData={selectedClinicData}
                            />
                        </div>
                    </div>
                    {/* Hiển thị nội dung Markdown bằng dangerouslySetInnerHTML */}
                    <div className='detail-info-doctor'>
                        {detailDoctor && detailDoctor.markdownData && detailDoctor.markdownData.contentHTML
                            && <div dangerouslySetInnerHTML={{ __html: detailDoctor.markdownData.contentHTML }}></div>
                        }
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        detailDoctor: state.admin.detailDoctor

    };
};

const mapDispatchToProps = dispatch => {
    return {

        getDetailDoctor: (id) => dispatch(action.getDetailDoctor(id))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DetailDoctor));
