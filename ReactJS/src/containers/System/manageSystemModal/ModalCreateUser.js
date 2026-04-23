import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import './ModalCreateUser.scss';
import { CommonUtils } from '../../../utils';
import icon_icons from '../../../assets/images/icon_icons.svg';

class ModalCreateUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phonenumber: '',
            address: '',
            gender: '',
            roleId: '',
            positionId: '',
            avatar: '',
            previewImgURL: ''
        }
    }

    componentDidMount() {
    }

    toggle = () => {
        this.props.toggleFromParent();
    }

    handleOnChangeInput = (event, id) => {
        let value = event.target.value;
        this.setState({
            [id]: value
        });
    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgURL: objectUrl,
                avatar: base64
            });
        }
    }

    checkValidateInput = () => {
        let isValid = true;
        let arrInput = ['email', 'password', 'firstName', 'lastName', 'phonenumber', 'address'];
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                isValid = false;
                alert('Missing parameter: ' + arrInput[i]);
                break;
            }
        }
        return isValid;
    }

    handleAddNewUser = () => {
        let isValid = this.checkValidateInput();
        if (isValid === true) {
            this.props.createNewUser(this.state);
        }
    }

    render() {
        let { genderArr, roleArr, positionArr, language } = this.props;

        return (
            <Modal
                isOpen={this.props.isOpen}
                toggle={() => this.toggle()}
                size="lg"
                centered
                className="modal-add-new-user"
            >
                <ModalHeader toggle={() => this.toggle()}>
                    <FormattedMessage id="manage-user.modal-create" defaultMessage="Tạo người dùng mới" />
                </ModalHeader>

                <ModalBody>
                    <div className="modal-user-body">
                        {/* Avatar Upload */}
                        <div className="input-container max-width-input">
                            <label><FormattedMessage id="manage-user.image" defaultMessage="Ảnh đại diện (Avatar)" /></label>
                            <div className="avatar-upload-area" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div className="avatar-preview" style={{ 
                                    width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', 
                                    border: '2px solid #d2d2d7', background: '#f5f5f7' 
                                }}>
                                    <img src={this.state.previewImgURL || icon_icons} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <input type="file" id="uploadAvatar" hidden onChange={this.handleOnChangeImage} />
                                <label htmlFor="uploadAvatar" className="upload-btn-label" style={{
                                    background: '#0071e3', color: '#fff', padding: '8px 16px', borderRadius: '20px', 
                                    fontSize: '14px', fontWeight: '500', cursor: 'pointer'
                                }}>
                                    <FormattedMessage id="manage-user.upload-avatar" defaultMessage="Tải ảnh lên" />
                                </label>
                            </div>
                        </div>

                        <div className="input-container">
                            <label><FormattedMessage id="manage-user.email" defaultMessage="Email" /></label>
                            <input
                                type="email"
                                onChange={(e) => this.handleOnChangeInput(e, "email")}
                                value={this.state.email}
                                placeholder="name@apple.com"
                            />
                        </div>
                        <div className="input-container">
                            <label><FormattedMessage id="manage-user.password" defaultMessage="Mật khẩu" /></label>
                            <input
                                type="password"
                                onChange={(e) => this.handleOnChangeInput(e, "password")}
                                value={this.state.password}
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="input-container">
                            <label><FormattedMessage id="manage-user.first-name" defaultMessage="Tên" /></label>
                            <input
                                type="text"
                                onChange={(e) => this.handleOnChangeInput(e, "firstName")}
                                value={this.state.firstName}
                                placeholder="Steve"
                            />
                        </div>
                        <div className="input-container">
                            <label><FormattedMessage id="manage-user.last-name" defaultMessage="Họ" /></label>
                            <input
                                type="text"
                                onChange={(e) => this.handleOnChangeInput(e, "lastName")}
                                value={this.state.lastName}
                                placeholder="Jobs"
                            />
                        </div>
                        <div className="input-container">
                            <label><FormattedMessage id="manage-user.phone-number" defaultMessage="Số điện thoại" /></label>
                            <input
                                type="tel"
                                onChange={(e) => this.handleOnChangeInput(e, "phonenumber")}
                                value={this.state.phonenumber}
                                placeholder="+84 ..."
                            />
                        </div>
                        <div className="input-container">
                            <label><FormattedMessage id="manage-user.address" defaultMessage="Địa chỉ" /></label>
                            <input
                                type="text"
                                onChange={(e) => this.handleOnChangeInput(e, "address")}
                                value={this.state.address}
                                placeholder="1 Infinite Loop, Cupertino..."
                            />
                        </div>

                        {/* Selects */}
                        <div className="input-container" style={{ width: '33.33%' }}>
                            <label><FormattedMessage id="manage-user.gender" defaultMessage="Giới tính" /></label>
                            <select 
                                style={{ width: '100%', height: '48px', borderRadius: '12px', border: '1px solid #d2d2d7', padding: '0 12px' }}
                                value={this.state.gender} onChange={(e) => this.handleOnChangeInput(e, 'gender')}
                            >
                                <option value="">Select Gender</option>
                                {genderArr && genderArr.length > 0 && genderArr.map((item, index) => {
                                    return (
                                        <option key={index} value={item.keyMap}>
                                            {language === 'vi' ? item.valueVi : item.valueEn}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="input-container" style={{ width: '33.33%' }}>
                            <label><FormattedMessage id="manage-user.role" defaultMessage="Vai trò" /></label>
                            <select 
                                style={{ width: '100%', height: '48px', borderRadius: '12px', border: '1px solid #d2d2d7', padding: '0 12px' }}
                                value={this.state.roleId} onChange={(e) => this.handleOnChangeInput(e, 'roleId')}
                            >
                                <option value="">Select Role</option>
                                {roleArr && roleArr.length > 0 && roleArr.map((item, index) => {
                                    return (
                                        <option key={index} value={item.keyMap}>
                                            {language === 'vi' ? item.valueVi : item.valueEn}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="input-container" style={{ width: '33.33%' }}>
                            <label><FormattedMessage id="manage-user.position" defaultMessage="Chức danh" /></label>
                            <select 
                                style={{ width: '100%', height: '48px', borderRadius: '12px', border: '1px solid #d2d2d7', padding: '0 12px' }}
                                value={this.state.positionId} onChange={(e) => this.handleOnChangeInput(e, 'positionId')}
                            >
                                <option value="">Select Position</option>
                                {positionArr && positionArr.length > 0 && positionArr.map((item, index) => {
                                    return (
                                        <option key={index} value={item.keyMap}>
                                            {language === 'vi' ? item.valueVi : item.valueEn}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <button className="btn-cancel" onClick={() => this.toggle()}>
                        <FormattedMessage id="manage-user.btn-cancel" defaultMessage="Hủy" />
                    </button>
                    <button className="btn-primary" onClick={() => this.handleAddNewUser()}>
                        <FormattedMessage id="manage-user.btn-save" defaultMessage="Lưu mới" />
                    </button>
                </ModalFooter>
            </Modal>
        )
    }
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalCreateUser);
