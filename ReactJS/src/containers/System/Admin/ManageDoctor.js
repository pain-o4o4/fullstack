import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as action from '../../../store/actions';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import Select from 'react-select';
import { LANGUAGES, CRUD_ACTION, USER_ROLE } from '../../../utils/constant';
import { getDetailDoctorByIdService } from '../../../services/userService';
import { toast } from 'react-toastify';
import './ManageDoctor.scss';

const mdParser = new MarkdownIt();

class ManageDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contentHTML: '',
            contentMarkdown: '',
            description: '',
            selectedDoctor: null,
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

            note: '',
            maxNumber: '',

            showConfirm: false,
            isLoading: false
        }
    }

    componentDidMount() {
        this.props.fetchAllDoctors();
        this.props.getRequiredDoctorInfor();

        let { userInfo } = this.props;
        if (userInfo && userInfo.roleId === USER_ROLE.DOCTOR) {
            let labelVi = `${userInfo.lastName} ${userInfo.firstName}`;
            let labelEn = `${userInfo.firstName} ${userInfo.lastName}`;
            let selectedDoctor = {
                label: this.props.language === LANGUAGES.VI ? labelVi : labelEn,
                value: userInfo.id
            }
            this.handleChangeSelect(selectedDoctor);
        }
    }

    buildDataInput = (data, type) => {
        let result = [];
        let { language } = this.props;
        if (data && data.length > 0) {
            if (type === 'USERS') {
                data.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.lastName} ${item.firstName}`;
                    let labelEn = `${item.firstName} ${item.lastName}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.id;
                    result.push(object);
                })
            }
            if (type === 'PRICE') {
                data.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi}`;
                    let labelEn = `${item.valueEn} USD`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object);
                })
            }
            if (type === 'PAYMENT' || type === 'PROVINCE') {
                data.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi}`;
                    let labelEn = `${item.valueEn}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object);
                })
            }
            if (type === 'SPECIALTY') {
                data.map((item, index) => {
                    let object = {};
                    object.label = item.name;
                    object.value = item.id;
                    result.push(object);
                })
            }
            if (type === 'CLINIC') {
                data.map((item, index) => {
                    let object = {};
                    object.label = item.name;
                    object.value = item.id;
                    result.push(object);
                })
            }
        }
        return result;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInput(this.props.allDoctors, 'USERS');
            this.setState({
                listAllDoctors: dataSelect
            })

            let { userInfo } = this.props;
            if (userInfo && userInfo.roleId === USER_ROLE.DOCTOR) {
                let labelVi = `${userInfo.lastName} ${userInfo.firstName}`;
                let labelEn = `${userInfo.firstName} ${userInfo.lastName}`;
                let selectedDoctor = {
                    label: this.props.language === LANGUAGES.VI ? labelVi : labelEn,
                    value: userInfo.id
                }
                this.handleChangeSelect(selectedDoctor);
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
                listClinic: dataSelectClinic,
            }, async () => {
                // If a doctor is already selected (e.g. auto-selected for Doctor role), 
                // we need to re-match the fields now that the lists are available
                if (this.state.selectedDoctor) {
                    await this.handleChangeSelect(this.state.selectedDoctor);
                }
            })
        }

        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInput(this.props.allDoctors, 'USERS');
            let { resPrice, resPayment, resProvince } = this.props.allRequiredDoctorInfor;
            let dataSelectPrice = this.buildDataInput(resPrice, 'PRICE');
            let dataSelectPayment = this.buildDataInput(resPayment, 'PAYMENT');
            let dataSelectProvince = this.buildDataInput(resProvince, 'PROVINCE');

            this.setState({
                listAllDoctors: dataSelect,
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
            })
        }
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html,
        })
    }

    handleSaveContentMarkdown = () => {
        let { hasOldData } = this.state;
        if (!this.state.selectedDoctor || !this.state.description || !this.state.contentMarkdown) {
            toast.error("Vui lòng nhập đầy đủ thông tin mô tả!");
            return;
        }
        this.setState({ showConfirm: true });
    }

    confirmSave = async () => {
        let { hasOldData } = this.state;
        this.setState({ isLoading: true });

        let res = await this.props.saveDetailDoctor({
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            doctorId: this.state.selectedDoctor.value,
            action: hasOldData === true ? CRUD_ACTION.EDIT : CRUD_ACTION.CREATE,

            selectedPrice: this.state.selectedPrice.value,
            selectedPayment: this.state.selectedPayment.value,
            selectedProvince: this.state.selectedProvince.value,
            note: this.state.note,
            specialtyId: this.state.selectedSpecialty.value,
            clinicId: this.state.selectedClinic.value,
            maxNumber: this.state.maxNumber
        })

        if (res && res.errCode === 0) {
            toast.success("Lưu thông tin bác sĩ thành công!");
            this.setState({ showConfirm: false, isLoading: false });
        } else if (res && res.errCode === 3) {
            // Future bookings error
            toast.error(res.errMessage);
            this.setState({ showConfirm: false, isLoading: false });
        } else {
            toast.error("Lưu thông tin bác sĩ thất bại!");
            this.setState({ isLoading: false });
        }
    }

    handleChangeSelect = async (selectedOption) => {
        this.setState({ selectedDoctor: selectedOption });
        let { listPrice, listPayment, listProvince, listSpecialty, listClinic } = this.state;

        let res = await getDetailDoctorByIdService(selectedOption.value);
        if (res && res.errCode === 0 && res.data) {
            let markdown = res.data.markdownData;
            let doctorinfor = res.data.doctorinforData;
            let hasOldData = false;

            let contentHTML = '', contentMarkdown = '', description = '';
            if (markdown) {
                contentHTML = markdown.contentHTML || '';
                contentMarkdown = markdown.contentMarkdown || '';
                description = markdown.description || '';
                hasOldData = true;
            }

            let note = '',
                paymentId = '', priceId = '', provinceId = '', specialtyId = '', clinicId = '',
                selectedPayment = '', selectedPrice = '', selectedProvince = '',
                selectedSpecialty = '', selectedClinic = '', maxNumber = '';

            if (doctorinfor) {
                note = doctorinfor.note || '';
                maxNumber = doctorinfor.count || '';
                paymentId = doctorinfor.paymentId || '';
                priceId = doctorinfor.priceId || '';
                provinceId = doctorinfor.provinceId || '';
                specialtyId = doctorinfor.specialtyId || '';
                clinicId = doctorinfor.clinicId || '';

                selectedPayment = listPayment.find(item => item && item.value === paymentId) || '';
                selectedPrice = listPrice.find(item => item && item.value === priceId) || '';
                selectedProvince = listProvince.find(item => item && item.value === provinceId) || '';
                selectedSpecialty = listSpecialty.find(item => item && item.value === specialtyId) || '';
                selectedClinic = listClinic.find(item => item && item.value === clinicId) || '';
                hasOldData = true;
            }

            this.setState({
                contentHTML: contentHTML,
                contentMarkdown: contentMarkdown,
                description: description,
                hasOldData: hasOldData,
                note: note,
                maxNumber: maxNumber,
                selectedPayment: selectedPayment,
                selectedPrice: selectedPrice,
                selectedProvince: selectedProvince,
                selectedSpecialty: selectedSpecialty,
                selectedClinic: selectedClinic,
            })
        } else {
            this.setState({
                contentHTML: '',
                contentMarkdown: '',
                description: '',
                hasOldData: false,
                note: '',
                maxNumber: '',
                selectedPayment: '',
                selectedPrice: '',
                selectedProvince: '',
                selectedSpecialty: '',
                selectedClinic: '',
            })
        }
    };

    handleOnChangeText = (event, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        })
    }

    handleChangeSelectDoctorInfor = async (selectedOption, name) => {
        let stateName = name.name;
        let stateCopy = { ...this.state };
        stateCopy[stateName] = selectedOption;
        this.setState({
            ...stateCopy
        })
    }

    render() {
        let { hasOldData, selectedDoctor, language } = this.state;

        return (
            <div className="manage-doctor-container">
                <div className="manage-header">
                    <div className="header-info">
                        <h1><FormattedMessage id="admin.manage-doctor.title" /></h1>
                        <span>Thiết lập thông tin chi tiết và chuyên môn cho bác sĩ</span>
                    </div>
                </div>

                <div className="doctor-main-layout">
                    <div className="settings-grid">
                        
                        {this.props.userInfo && this.props.userInfo.roleId !== USER_ROLE.DOCTOR && (
                            <div className="info-card">
                                <div className="card-header">
                                    <span className="card-title">BÁC SĨ & MÔ TẢ</span>
                                    <i className="fas fa-user-md"></i>
                                </div>
                                <div className="card-body">
                                    <div className="input-group-apple">
                                        <label><FormattedMessage id="admin.manage-doctor.select-doctor" /></label>
                                        <Select
                                            value={selectedDoctor}
                                            onChange={this.handleChangeSelect}
                                            options={this.state.listAllDoctors}
                                            placeholder='Tìm bác sĩ...'
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                        />
                                    </div>
                                    <div className="input-group-apple">
                                        <label><FormattedMessage id="admin.manage-doctor.specialty" /></label>
                                        <Select
                                            value={this.state.selectedSpecialty}
                                            onChange={this.handleChangeSelectDoctorInfor}
                                            options={this.state.listSpecialty}
                                            placeholder="Chọn chuyên khoa"
                                            name="selectedSpecialty"
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                        />
                                    </div>
                                    <div className="input-group-apple">
                                        <label><FormattedMessage id="admin.manage-doctor.select-clinic" /></label>
                                        <Select
                                            value={this.state.selectedClinic}
                                            onChange={this.handleChangeSelectDoctorInfor}
                                            options={this.state.listClinic}
                                            placeholder="Chọn phòng khám/bệnh viện"
                                            name="selectedClinic"
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        
                        <div className="info-card">
                            <div className="card-header">
                                <span className="card-title">Giá khám & Thanh toán</span>
                                <i className="fas fa-wallet"></i>
                            </div>
                            <div className="card-body">
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div className="input-group-apple">
                                        <label><FormattedMessage id="admin.manage-doctor.price" /></label>
                                        <Select
                                            value={this.state.selectedPrice}
                                            onChange={this.handleChangeSelectDoctorInfor}
                                            options={this.state.listPrice}
                                            placeholder="Giá khám"
                                            name="selectedPrice"
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                        />
                                    </div>
                                    <div className="input-group-apple">
                                        <label>SL Bệnh nhân/khung</label>
                                        <input
                                            type="number"
                                            onChange={(event) => this.handleOnChangeText(event, 'maxNumber')}
                                            value={this.state.maxNumber}
                                            placeholder="Vd: 5"
                                        />
                                    </div>
                                </div>
                                {selectedDoctor && (
                                    (() => {
                                        let doc = this.props.allDoctors.find(d => d.id === selectedDoctor.value);
                                        let image = '';
                                        let position = language === LANGUAGES.VI ? 'Bác sĩ hệ thống' : 'System Doctor';
                                        if (doc) {
                                            image = doc.image || '';
                                            if (doc.positionData) {
                                                position = language === LANGUAGES.VI ? doc.positionData.valueVi : doc.positionData.valueEn;
                                            }
                                        }
                                        return (
                                            <div className="doctor-summary" style={{ display: 'flex', gap: '12px', alignItems: 'center', background: '#f5f5f7', padding: '12px', borderRadius: '16px', marginTop: '8px' }}>
                                                <div style={{ width: '50px', height: '50px', borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>
                                                    {image ? <img src={image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="doc" /> : <i className="fas fa-user-md" style={{ display: 'flex', justifyContent: 'center', height: '100%', alignItems: 'center', color: '#0071e3' }}></i>}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '700', fontSize: '15px' }}>{selectedDoctor.label}</div>
                                                    <div style={{ fontSize: '12px', color: '#86868b' }}>{position}</div>
                                                </div>
                                            </div>
                                        );
                                    })()
                                )}
                                <div className="input-group-apple">
                                    <label><FormattedMessage id="admin.manage-doctor.payment" /></label>
                                    <Select
                                        value={this.state.selectedPayment}
                                        onChange={this.handleChangeSelectDoctorInfor}
                                        options={this.state.listPayment}
                                        placeholder="Phương thức thanh toán"
                                        name="selectedPayment"
                                        menuPortalTarget={document.body}
                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                    />
                                </div>
                            </div>
                        </div>

                        
                        <div className="info-card full-width">
                            <div className="card-header">
                                <span className="card-title">Thông tin giới thiệu & Ghi chú</span>
                                <i className="fas fa-info-circle"></i>
                            </div>
                            <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div className="input-group-apple">
                                    <label><FormattedMessage id="admin.manage-doctor.intro" /></label>
                                    <textarea
                                        rows="5"
                                        onChange={(event) => this.handleOnChangeText(event, 'description')}
                                        value={this.state.description}
                                        placeholder="Nhập giới thiệu ngắn về bác sĩ..."
                                    />
                                </div>
                                <div className="input-group-apple" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div className="input-group-apple">
                                        <label><FormattedMessage id="admin.manage-doctor.province" /></label>
                                        <Select
                                            value={this.state.selectedProvince}
                                            onChange={this.handleChangeSelectDoctorInfor}
                                            options={this.state.listProvince}
                                            placeholder="Chọn tỉnh thành"
                                            name="selectedProvince"
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                        />
                                    </div>
                                    <div className="input-group-apple">
                                        <label><FormattedMessage id="admin.manage-doctor.note" /></label>
                                        <input
                                            onChange={(event) => this.handleOnChangeText(event, 'note')}
                                            value={this.state.note}
                                            placeholder="Ghi chú thêm (Vd: Khám cả thứ 7)..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    
                    <div className="editor-section">
                        <div className="section-header">
                            <h2>Nội dung chi tiết</h2>
                            <p>Mô tả chi tiết về quá trình công tác, thành tựu và kinh nghiệm của bác sĩ</p>
                        </div>
                        <MdEditor
                            className="custom-md-editor"
                            renderHTML={(text) => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.contentMarkdown}
                        />
                    </div>
                </div>

                <div className="footer-actions">
                    <button
                        className={hasOldData === true ? "btn-save-doctor update" : "btn-save-doctor"}
                        onClick={this.handleSaveContentMarkdown}
                    >
                        {hasOldData === true ?
                            <><i className="fas fa-sync-alt"></i> <FormattedMessage id="admin.manage-doctor.update" /></> :
                            <><i className="fas fa-plus"></i> <FormattedMessage id="admin.manage-doctor.add" /></>
                        }
                    </button>
                </div>

                
                {this.state.showConfirm && (
                    <div className="apple-confirm-overlay">
                        <div className="apple-confirm-popup">
                            <div className="popup-title">{hasOldData ? "Cập nhật thông tin?" : "Thêm bác sĩ mới?"}</div>
                            <div className="popup-desc">
                                Bạn đang chuẩn bị {hasOldData ? "cập nhật" : "lưu"} thông tin cho bác sĩ {selectedDoctor ? selectedDoctor.label : ""}. Bạn có chắc chắn với các thay đổi này?
                            </div>
                            <div className="popup-actions">
                                <button className="btn-cancel" disabled={this.state.isLoading} onClick={() => this.setState({ showConfirm: false })}>Hủy</button>
                                <button className="btn-delete" style={{ background: '#0071e3' }} disabled={this.state.isLoading} onClick={this.confirmSave}>
                                    {this.state.isLoading ? 'Đang xử lý...' : 'Xác nhận'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(action.fetchAllDoctors()),
        getRequiredDoctorInfor: () => dispatch(action.getRequiredDoctorInfor()),
        saveDetailDoctor: (data) => dispatch(action.saveDetailDoctor(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
