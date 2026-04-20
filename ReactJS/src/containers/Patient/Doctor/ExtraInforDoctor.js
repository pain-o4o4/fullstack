import React, { Component } from 'react';
import { connect } from "react-redux";
import { getExtraInforDoctorById } from '../../../services/userService'
import { LANGUAGES } from '../../../utils/constant'
import './ExtraInforDoctor.scss'
import { withRouter } from '../../../components/Navigator'; // hoặc 'react-router-dom'
import { FormattedMessage } from 'react-intl';
import { FormattedNumber } from 'react-intl';
class ExtraInforDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowDetailInfor: false,
            extraInfor: {},
        }
    }


    async componentDidMount() {
        // Chỉ gọi API nếu doctorId hợp lệ và khác -1
        if (this.props.doctorIdFromParent && this.props.doctorIdFromParent !== -1) {
            let res = await getExtraInforDoctorById(this.props.doctorIdFromParent);
            if (res && res.errCode === 0) {
                this.setState({
                    isShowDetailInfor: false,
                    extraInfor: res.data
                })
            }
        }

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            let res = await getExtraInforDoctorById(this.props.doctorIdFromParent)
            console.log("res", res, "this.props.doctorIdFromParent", this.props.doctorIdFromParent)
            if (res && res.errCode === 0) {
                this.setState({
                    isShowDetailInfor: false,
                    extraInfor: res.data
                })
            }
        }
    }

    showHideDetailInfor = (status) => {
        this.setState({
            isShowDetailInfor: status
        });
    }
    getInfoByLanguage = () => {
        let { extraInfor } = this.state;
        let { language } = this.props;

        // Khởi tạo giá trị mặc định
        let result = {
            price: '',
            province: '',
            payment: '',
        };

        // Kiểm tra đa tầng để tránh lỗi "Cannot read property of undefined"
        if (extraInfor) {


            if (extraInfor.priceTypeData && extraInfor.provinceTypeData && extraInfor.paymentTypeData) {
                result.price = language === LANGUAGES.VI
                    ? extraInfor.priceTypeData.valueVi
                    : extraInfor.priceTypeData.valueEn;

                result.province = language === LANGUAGES.VI
                    ? extraInfor.provinceTypeData.valueVi
                    : extraInfor.provinceTypeData.valueEn;

                result.payment = language === LANGUAGES.VI
                    ? extraInfor.paymentTypeData.valueVi
                    : extraInfor.paymentTypeData.valueEn;

                result.price = language === LANGUAGES.VI
                    ? new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                    }).format(extraInfor.priceTypeData.valueVi)
                    : new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD'
                    }).format(extraInfor.priceTypeData.valueEn);
            }
        }

        return result;
    }
    render() {
        let { isShowDetailInfor, extraInfor } = this.state
        let { language } = this.props;
        let listExtraInforLanguage = this.getInfoByLanguage();
        console.log('check state', this.state)
        return (
            <React.Fragment>
                <div className="schedule-doctor">
                    <div className="content-up">
                        <div className="text-address">
                            <FormattedMessage id="schedule-doctor.text-address" />
                        </div>
                        <div className="name-clinic">
                            {extraInfor && extraInfor.nameClinic ? extraInfor.nameClinic : ''}
                        </div>
                        <div className="detail-address">
                            {listExtraInforLanguage.province}
                        </div>

                    </div>
                    <div className="content-donw">

                        {isShowDetailInfor === false ? <div className="short-infor">



                            <span onClick={() => this.showHideDetailInfor(true)}>
                                <FormattedMessage id="schedule-doctor.show-price" />
                            </span>
                        </div> :
                            <>
                                <div className="title-price">
                                    {

                                    }
                                </div>
                                <div className="detail-infor">
                                    {extraInfor && extraInfor.addressClinic ? extraInfor.addressClinic : ''}
                                </div>
                                <div className="price">
                                    <span className="left">
                                        <FormattedMessage id="schedule-doctor.price" />
                                    </span>
                                    <span className="right">
                                        {listExtraInforLanguage.price}
                                    </span>
                                </div>
                                <div className="note">
                                    {
                                        extraInfor && extraInfor.note ? extraInfor.note : ''
                                    }
                                </div>
                                <div className="payment">
                                    {listExtraInforLanguage.payment}
                                </div>
                                <div className="hide-price">
                                    <span onClick={() => this.showHideDetailInfor(false)}>
                                        <FormattedMessage id="schedule-doctor.hide-price" />
                                    </span>

                                </div>
                            </>
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
        // ExtraInforDoctor: state.admin.ExtraInforDoctor

    };
};

const mapDispatchToProps = dispatch => {
    return {

        // getExtraInforDoctor: (id) => dispatch(action.getExtraInforDoctor(id))
    };
};

// import { withRouter } from 'react-router'; // hoặc 'react-router-dom'
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ExtraInforDoctor));
