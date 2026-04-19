import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import * as action from '../../../store/actions'
import MarkdownIt from 'markdown-it'
import './ManageDoctor.scss'
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'
import Select from 'react-select';
import { LANGUAGES } from '../../../utils/constant'
import { getDetailDoctorByIdService } from '../../../services/userService'

const mdParser = new MarkdownIt();

class ManageDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contentHTML: '',
            selectedDoctor: null,
            contentMarkdown: '',
            description: '',
            listAllDoctors: [],
            hasOldData: false,

            listPrice: [],
            listPayment: [],
            listProvince: [],
            listSpecialty: [],
            listClinic: [],

            selectedPrice: '',
            selectedPayment: '',
            selectedProvince: '',
            selectedSpecialty: '',
            selectedClinic: '',

            nameClinic: '',
            addressClinic: '',
            note: '',
        }
    }

    componentDidMount() {
        this.props.fetchAllDoctors();
        this.props.getRequiredDoctorInfor();

        // Lock doctor immediately if user is Doctor (R2)
        let { userInfo, language } = this.props;
        if (userInfo && userInfo.roleId === 'R2') {
            let labelVi = `${userInfo.lastName} ${userInfo.firstName}`;
            let labelEn = `${userInfo.firstName} ${userInfo.lastName}`;

            let doctorOption = {
                value: userInfo.id,
                label: language === LANGUAGES.VI ? labelVi : labelEn
            };

            this.setState({ selectedDoctor: doctorOption }, () => {
                this.handleChange(doctorOption); // auto fetch their old info
            });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInput(this.props.allDoctors, 'USER');
            this.setState({ listAllDoctors: dataSelect });
        }

        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInput(this.props.allDoctors, 'USER');
            this.setState({ listAllDoctors: dataSelect });

            // Re-translate pre-fixed selected option for Doctor role
            let { userInfo, language } = this.props;
            if (userInfo && userInfo.roleId === 'R2' && this.state.selectedDoctor) {
                let labelVi = `${userInfo.lastName} ${userInfo.firstName}`;
                let labelEn = `${userInfo.firstName} ${userInfo.lastName}`;
                
                let updatedOption = {
                    value: userInfo.id,
                    label: language === LANGUAGES.VI ? labelVi : labelEn
                }
                
                this.setState({ selectedDoctor: updatedOption });
            }
        }

        if (prevProps.allRequiredDoctorInfor !== this.props.allRequiredDoctorInfor) {
            let { resPrice, resPayment, resProvince, resSpecialty, resClinic } = this.props.allRequiredDoctorInfor;
            
            let dataSelectPrice = this.buildDataInput(resPrice, 'PRICE');
            let dataSelectPayment = this.buildDataInput(resPayment, 'PAYMENT');
            let dataSelectProvince = this.buildDataInput(resProvince, 'PROVINCE');
            let dataSelectSpecialty = this.buildDataInput(resSpecialty, 'SPECIALTY');
            let dataSelectClinic = this.buildDataInput(resClinic, 'CLINIC');

            this.setState({
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
                listSpecialty: dataSelectSpecialty,
                listClinic: dataSelectClinic
            });
        }
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentHTML: html,
            contentMarkdown: text
        })
    }

    handleSaveContent = () => {
        let { language } = this.props;
        let { hasOldData, selectedDoctor,
            selectedPrice, selectedPayment, selectedProvince,
            selectedSpecialty, selectedClinic,
            nameClinic, addressClinic, note,
        } = this.state;

        this.props.saveDetailDoctor({
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            doctorId: selectedDoctor && selectedDoctor.value ? selectedDoctor.value : '',
            action: hasOldData === true ? 'EDIT' : 'CREATE',

            selectedPrice: selectedPrice && selectedPrice.value ? selectedPrice.value : '',
            selectedPayment: selectedPayment && selectedPayment.value ? selectedPayment.value : '',
            selectedProvince: selectedProvince && selectedProvince.value ? selectedProvince.value : '',
            specialtyId: selectedSpecialty && selectedSpecialty.value ? selectedSpecialty.value : '',
            clinicId: selectedClinic && selectedClinic.value ? selectedClinic.value : '',

            nameClinic: nameClinic,
            addressClinic: addressClinic,
            note: note,
        });
    }

    handleChange = async (selectedDoctor) => {
        this.setState({ selectedDoctor });
        let res = await getDetailDoctorByIdService(selectedDoctor.value);
        let { listPrice, listPayment, listProvince, listSpecialty, listClinic } = this.state;

        if (res && res.errCode === 0 && res.data) {
            let markdown = res.data.markdownData;
            let doctorInfor = res.data.doctorinforData;
            
            let addressClinic = '', nameClinic = '', note = '',
                selectedPrice = '', selectedPayment = '',
                selectedProvince = '', selectedSpecialty = '',
                selectedClinic = '';

            if (doctorInfor) {
                addressClinic = doctorInfor.addressClinic;
                nameClinic = doctorInfor.nameClinic;
                note = doctorInfor.note;

                selectedPrice = listPrice.find(item => item && item.value === doctorInfor.priceId);
                selectedPayment = listPayment.find(item => item && item.value === doctorInfor.paymentId);
                selectedProvince = listProvince.find(item => item && item.value === doctorInfor.provinceId);
                selectedSpecialty = listSpecialty.find(item => item && item.value === doctorInfor.specialtyId);
                selectedClinic = listClinic.find(item => item && item.value === doctorInfor.clinicId);
            }

            this.setState({
                description: markdown ? markdown.description : '',
                contentHTML: markdown ? markdown.contentHTML : '',
                contentMarkdown: markdown ? markdown.contentMarkdown : '',
                hasOldData: markdown ? true : false,

                addressClinic: addressClinic || '',
                nameClinic: nameClinic || '',
                note: note || '',
                selectedPrice: selectedPrice || '',
                selectedPayment: selectedPayment || '',
                selectedProvince: selectedProvince || '',
                selectedSpecialty: selectedSpecialty || '',
                selectedClinic: selectedClinic || '',
            });
        } else {
            this.setState({
                description: '', contentHTML: '', contentMarkdown: '',
                hasOldData: false,
                addressClinic: '', nameClinic: '', note: '',
                selectedPrice: '', selectedPayment: '',
                selectedProvince: '', selectedSpecialty: '',
                selectedClinic: '',
            });
        }
    }

    handleChangeText = (event, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({ ...stateCopy });
    }

    buildDataInput = (dataInput, type) => {
        let result = [];
        let { language } = this.props;

        if (dataInput && dataInput.length > 0) {
            if (type === "USER") {
                dataInput.map((item) => {
                    let object = {};
                    let labelVi = `${item.lastName} ${item.firstName}`;
                    let labelEn = `${item.firstName} ${item.lastName}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.id;
                    result.push(object);
                    return result;
                });
            } else if (type === "PAYMENT" || type === "PROVINCE") {
                dataInput.map((item) => {
                    let object = {};
                    object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                    object.value = item.keyMap;
                    result.push(object);
                    return result;
                });
            } else if (type === "PRICE") {
                dataInput.map((item) => {
                    let object = {};
                    object.label = language === LANGUAGES.VI ? `${item.valueVi} VNĐ` : `${item.valueEn} USD`;
                    object.value = item.keyMap;
                    result.push(object);
                    return result;
                });
            } else if (type === "SPECIALTY" || type === "CLINIC") {
                dataInput.map((item) => {
                    let object = {};
                    object.label = item.name;
                    object.value = item.id;
                    result.push(object);
                    return result;
                });
            }
        }
        return result;
    }

    handleChangeSelectDoctorInfor = (selectedOption, action) => {
        const stateName = action.name;
        if (!stateName) return;
        this.setState({ [stateName]: selectedOption });
    };

    render() {
        let { selectedDoctor, listDoctors, hasOldData } = this.state;
        let { userInfo, language } = this.props;
        let isDoctorRole = userInfo && userInfo.roleId === 'R2';

        return (
            <div className="manage-doctor-wrapper">
                <div className="header-section">
                    <h2 className="title">
                        <FormattedMessage id='manage-doctor.title' defaultMessage="Quản Lý Thông Tin Bác Sĩ" />
                    </h2>
                </div>

                <div className="apple-card">
                    <div className="card-header-title">
                        <FormattedMessage id="manage-doctor.basic-info" defaultMessage="Thông Tin Cơ Bản" />
                    </div>
                    
                    <div className="form-grid">
                        <div className="input-group-apple outline-group">
                            <label><FormattedMessage id='manage-doctor.select' defaultMessage="Chọn Bác Sĩ" /></label>
                            <Select
                                classNamePrefix="react-select"
                                value={this.state.selectedDoctor}
                                onChange={this.handleChange}
                                options={this.state.listAllDoctors}
                                isDisabled={isDoctorRole}
                                placeholder={language === LANGUAGES.VI ? 'Tìm kiếm bác sĩ...' : 'Search doctor...'}
                            />
                        </div>

                        <div className="input-group-apple outline-group">
                            <label><FormattedMessage id='manage-doctor.price' defaultMessage="Giá Khám Bệnh" /></label>
                            <Select
                                classNamePrefix="react-select"
                                value={this.state.selectedPrice}
                                onChange={this.handleChangeSelectDoctorInfor}
                                options={this.state.listPrice}
                                placeholder={language === LANGUAGES.VI ? 'Chọn giá...' : 'Choose price...'}
                                name="selectedPrice"
                            />
                        </div>

                        <div className="input-group-apple outline-group">
                            <label><FormattedMessage id='manage-doctor.payment' defaultMessage="Phương Thức Thanh Toán" /></label>
                            <Select
                                classNamePrefix="react-select"
                                value={this.state.selectedPayment}
                                onChange={this.handleChangeSelectDoctorInfor}
                                options={this.state.listPayment}
                                placeholder={language === LANGUAGES.VI ? 'Chọn phương thức...' : 'Choose payment...'}
                                name="selectedPayment"
                            />
                        </div>

                        <div className="input-group-apple outline-group">
                            <label><FormattedMessage id='manage-doctor.province' defaultMessage="Tỉnh / Thành Phố" /></label>
                            <Select
                                classNamePrefix="react-select"
                                value={this.state.selectedProvince}
                                onChange={this.handleChangeSelectDoctorInfor}
                                options={this.state.listProvince}
                                placeholder={language === LANGUAGES.VI ? 'Chọn tỉnh thành...' : 'Choose province...'}
                                name="selectedProvince"
                            />
                        </div>

                        <div className="input-group-apple outline-group">
                            <label><FormattedMessage id='manage-doctor.choose-specialty' defaultMessage="Chuyên Khoa" /></label>
                            <Select
                                classNamePrefix="react-select"
                                value={this.state.selectedSpecialty}
                                onChange={this.handleChangeSelectDoctorInfor}
                                options={this.state.listSpecialty}
                                placeholder={language === LANGUAGES.VI ? 'Chọn chuyên khoa...' : 'Choose specialty...'}
                                name="selectedSpecialty"
                            />
                        </div>

                        <div className="input-group-apple outline-group">
                            <label><FormattedMessage id='manage-doctor.choose-clinic' defaultMessage="Phòng Khám" /></label>
                            <Select
                                classNamePrefix="react-select"
                                value={this.state.selectedClinic}
                                onChange={this.handleChangeSelectDoctorInfor}
                                options={this.state.listClinic}
                                placeholder={language === LANGUAGES.VI ? 'Chọn phòng khám...' : 'Choose clinic...'}
                                name="selectedClinic"
                            />
                        </div>

                        <div className="input-group-apple outline-group">
                            <label><FormattedMessage id='manage-doctor.clinic' defaultMessage="Tên Phòng Khám" /></label>
                            <input 
                                type="text"
                                className="apple-input"
                                value={this.state.nameClinic}
                                onChange={(e) => this.handleChangeText(e, "nameClinic")}
                                placeholder={language === LANGUAGES.VI ? 'Nhập tên phòng khám' : 'Enter clinic name'}
                            />
                        </div>

                        <div className="input-group-apple outline-group">
                            <label><FormattedMessage id='manage-doctor.address' defaultMessage="Địa Chỉ Phòng Khám" /></label>
                            <input 
                                type="text"
                                className="apple-input"
                                value={this.state.addressClinic}
                                onChange={(e) => this.handleChangeText(e, "addressClinic")}
                                placeholder={language === LANGUAGES.VI ? 'Nhập địa chỉ' : 'Enter address'}
                            />
                        </div>
                    </div>

                    <div className="input-group-apple full-width" style={{ marginTop: '20px' }}>
                        <label><FormattedMessage id='manage-doctor.note' defaultMessage="Ghi Chú Chung" /></label>
                        <input 
                            type="text"
                            className="apple-input"
                            value={this.state.note}
                            onChange={(e) => this.handleChangeText(e, "note")}
                            placeholder={language === LANGUAGES.VI ? 'Ghi chú thêm nếu có...' : 'Add more notes if any...'}
                        />
                    </div>

                    <div className="input-group-apple full-width" style={{ marginTop: '20px' }}>
                        <label><FormattedMessage id='manage-doctor.infor' defaultMessage="Đoạn Giới Thiệu Ngắn (Introduction)" /></label>
                        <textarea
                            className="apple-textarea"
                            value={this.state.description}
                            onChange={(e) => this.handleChangeText(e, "description")}
                            placeholder={language === LANGUAGES.VI ? 'Mô tả kỹ năng, chức danh...' : 'Describe skills, titles...'}
                            rows={3}
                        />
                    </div>
                </div>

                <div className="apple-card markdown-editor-card">
                    <div className="card-header-title">
                        <FormattedMessage id="manage-doctor.detail-desc" defaultMessage="Mô Tả Chi Tiết (Markdown)" />
                    </div>
                    <MdEditor
                        className="apple-md-editor"
                        renderHTML={text => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={this.state.contentMarkdown}
                    />
                </div>

                <div className="action-footer">
                    <button className="btn-save-apple" onClick={() => this.handleSaveContent()}>
                        <i className={`fas ${this.state.hasOldData ? 'fa-pen' : 'fa-save'}`}></i>
                        {this.state.hasOldData 
                            ? (language === LANGUAGES.VI ? " Cập Nhật Thông Tin" : " Update Information")
                            : (language === LANGUAGES.VI ? " Lưu Mới Thông Tin" : " Save New Information")
                        }
                    </button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        allDoctors: state.admin.allDoctors,
        allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,
        language: state.app.language,
        userInfo: state.user.userInfo 
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(action.fetchAllDoctors()),
        getRequiredDoctorInfor: () => dispatch(action.getRequiredDoctorInfor()),
        saveDetailDoctor: (data) => dispatch(action.saveDetailDoctor(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
