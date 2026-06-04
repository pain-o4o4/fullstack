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
        let { language, clinicData } = this.props;
        let listExtraInforLanguage = this.getInfoByLanguage();
        
        // Dữ liệu hiển thị (ưu tiên từ props nếu có, fallback về extraInfor)
        let displayClinicName = clinicData ? clinicData.name : (extraInfor && extraInfor.clinicData ? extraInfor.clinicData.name : '');
        let displayClinicAddress = clinicData ? clinicData.address : (extraInfor && extraInfor.clinicData ? extraInfor.clinicData.address : listExtraInforLanguage.province);

        console.log('check state', this.state)
        return (
            <React.Fragment>
                <div className="extra-infor-doctor-container">
                    <div className="content-up">
                        <div className="text-address">
                            <FormattedMessage id="schedule-doctor.text-address" />
                        </div>
                        <div className="name-clinic">
                            {displayClinicName}
                        </div>
                        <div className="detail-address">
                            <span className="address-text">{displayClinicAddress}</span>
                            {displayClinicAddress && (
                                <a 
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayClinicAddress + ' ' + displayClinicName)}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="map-directions-link"
                                    title="Xem vị trí trên bản đồ"
                                >
                                    <i className="fas fa-map-marked-alt"></i> Bản đồ
                                </a>
                            )}
                        </div>
                    </div>
                    <div className="content-donw">
                        <div className="price-detail-card">
                            <div className="price-row">
                                <span className="left">
                                    <i className="fas fa-tags"></i> <FormattedMessage id="schedule-doctor.price" />
                                </span>
                                <span className="right">
                                    {listExtraInforLanguage.price}
                                </span>
                            </div>
                            <div className="payment-row">
                                <span className="label">
                                    <i className="far fa-credit-card"></i> Phương thức thanh toán:
                                </span>
                                <span className="value">{listExtraInforLanguage.payment}</span>
                            </div>
                        </div>
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
