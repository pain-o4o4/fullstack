import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { CommonUtils } from '../../utils';
import {
    getAllUsers,
    createNewUsersService,
    deleteUserService,
    editUserService,
    getAllCodeService
} from '../../services/userService';
import ModalCreateUser from './manageSystemModal/ModalCreateUser';
import './UserManage.scss';
import icon_icons from '../../assets/images/icon_icons.svg';

const decodeBase64Buffer = (imgObj) => {
    if (imgObj && imgObj.data) {
        let bytes = new Uint8Array(imgObj.data);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return binary;
    } else if (typeof imgObj === 'string') {
        return imgObj;
    }
    return '';
};

class UserManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isModalOpen: false,
            action: 'CREATE',

            genderArr: [],
            roleArr: [],
            positionArr: [],


            id: '',
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
            phonenumber: '',
            gender: '',
            roleId: '',
            positionId: '',
            avatar: '',
            previewImgURL: '',

            currentPage: 1,
            pageSize: 8
        };
    }

    async componentDidMount() {
        await this.fetchAllData();
    }

    fetchAllData = async () => {
        try {
            let [usersRes, genderRes, roleRes, positionRes] = await Promise.all([
                getAllUsers('ALL'),
                getAllCodeService('GENDER'),
                getAllCodeService('ROLE'),
                getAllCodeService('POSITION')
            ]);

            let stateUpdate = {};

            if (usersRes && usersRes.errCode === 0) {
                stateUpdate.arrUsers = usersRes.users;
            }
            if (genderRes && genderRes.errCode === 0) {
                stateUpdate.genderArr = genderRes.data;
                if (genderRes.data && genderRes.data.length > 0) stateUpdate.gender = genderRes.data[0].keyMap;
            }
            if (roleRes && roleRes.errCode === 0) {
                stateUpdate.roleArr = roleRes.data;
                if (roleRes.data && roleRes.data.length > 0) stateUpdate.roleId = roleRes.data[0].keyMap;
            }
            if (positionRes && positionRes.errCode === 0) {
                stateUpdate.positionArr = positionRes.data;
                if (positionRes.data && positionRes.data.length > 0) stateUpdate.positionId = positionRes.data[0].keyMap;
            }

            this.setState(stateUpdate);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({ ...copyState });
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

    resetFormState = () => {
        let { genderArr, roleArr, positionArr } = this.state;
        this.setState({
            isModalOpen: false,
            action: 'CREATE',
            id: '',
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
            phonenumber: '',
            gender: genderArr && genderArr.length > 0 ? genderArr[0].keyMap : '',
            roleId: roleArr && roleArr.length > 0 ? roleArr[0].keyMap : '',
            positionId: positionArr && positionArr.length > 0 ? positionArr[0].keyMap : '',
            avatar: '',
            previewImgURL: ''
        });
    }

    handleAddNewUser = () => {
        this.resetFormState();
        this.setState({ isModalOpen: true, action: 'CREATE' });
    }

    handleEditUser = (user) => {
        let imageBase64 = decodeBase64Buffer(user.image);

        this.setState({
            isModalOpen: true,
            action: 'EDIT',
            id: user.id,
            email: user.email,
            password: 'HIDDEN_PASSWORD',
            firstName: user.firstName,
            lastName: user.lastName,
            address: user.address,
            phonenumber: user.phonenumber,
            gender: user.gender,
            roleId: user.roleId,
            positionId: user.positionId,
            avatar: imageBase64,
            previewImgURL: imageBase64
        });
    }

    handleSaveUser = async () => {
        let { action, id, email, password, firstName, lastName, address, phonenumber, gender, roleId, positionId, avatar } = this.state;
        let { language } = this.props;

        // Basic validation
        if (!email || !firstName || !lastName || !address || !phonenumber) {
            alert(language === 'vi' ? 'Vui lòng điền đủ các trường bắt buộc!' : 'Please fill in all required fields!');
            return;
        }

        let userData = {
            id, email, password, firstName, lastName, address, phonenumber, gender, roleId, positionId, avatar
        };

        try {
            let res;
            if (action === 'CREATE') {
                res = await createNewUsersService(userData);
            } else {
                res = await editUserService(userData);
            }

            if (res && res.errCode === 0) {
                this.resetFormState();
                await this.fetchAllData();
            } else {
                alert(res.errMessage);
            }
        } catch (error) {
            console.log("Save error:", error);
        }
    }

    handleDeleteUser = async (user) => {
        let { language } = this.props;
        try {
            let confirmMsg = language === 'vi'
                ? `Bạn có chắc chắn muốn xóa người dùng: ${user.email}?`
                : `Are you sure to delete user: ${user.email}?`;

            if (window.confirm(confirmMsg)) {
                let res = await deleteUserService(user.id);
                if (res && res.errCode === 0) {
                    await this.fetchAllData();
                } else {
                    alert(res.errMessage);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        let { arrUsers, isModalOpen, action, genderArr, roleArr, positionArr, currentPage, pageSize } = this.state;
        let { language } = this.props;
        let displayUsers = arrUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
        return (
            <div className="users-container">
                <div className="header-section">
                    <h1 className="page-title"><FormattedMessage id="manage-user.title" defaultMessage="Quản lý người dùng" /></h1>
                    <button className="btn-add-user" onClick={this.handleAddNewUser}>
                        <i className="fas fa-plus"></i>
                        <FormattedMessage id="manage-user.add-user" defaultMessage="Thêm tài khoản" />
                    </button>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th><FormattedMessage id="manage-user.table-email" defaultMessage="Email" /></th>
                                <th><FormattedMessage id="manage-user.table-role" defaultMessage="Quyền/Vai trò" /></th>
                                <th><FormattedMessage id="manage-user.table-address" defaultMessage="Địa chỉ" /></th>
                                <th><FormattedMessage id="manage-user.table-actions" defaultMessage="Thao tác" /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayUsers && displayUsers.length > 0 ? (
                                displayUsers.map((item, index) => {
                                    let imageBase64 = decodeBase64Buffer(item.image);

                                    return (
                                        <tr key={index}>
                                            <td>
                                                <div className="user-info-cell">
                                                    <div className="avatar-mini">
                                                        <img src={imageBase64 || 'https://static.vecteezy.com/system/resources/previews/026/625/600/non_2x/person-icon-symbol-design-illustration-vector.jpg'} alt="avatar" />
                                                    </div>
                                                    <div className="user-name-block">
                                                        <span className="name">{item.lastName} {item.firstName}</span>
                                                        <span className="email">{item.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{item.roleId}</td>
                                            <td>{item.address}</td>
                                            <td>
                                                <div className="actions-cell">
                                                    <button className="btn-edit" onClick={() => this.handleEditUser(item)} title="Edit">
                                                        <i className="fas fa-pencil-alt"></i>
                                                    </button>
                                                    <button className="btn-delete" onClick={() => this.handleDeleteUser(item)} title="Delete">
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#86868b' }}>
                                        <FormattedMessage id="manage-user.no-data" defaultMessage="Không có dữ liệu" />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>


                </div>
                {arrUsers && arrUsers.length > pageSize &&
                    <div className="pagination-footer" >
                        <button
                            className="btn btn-primary"
                            disabled={currentPage === 1}
                            onClick={() => this.setState({ currentPage: currentPage - 1 })}
                        >
                            <i className="fas fa-chevron-left"></i>
                        </button>

                        {/* Tạo danh sách số trang */}
                        {[...Array(Math.ceil(arrUsers.length / pageSize))].map((_, i) => (
                            <button
                                key={i}
                                className={currentPage === i + 1 ? "btn btn-info active" : "btn btn-outline-info"}
                                onClick={() => this.setState({ currentPage: i + 1 })}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            className="btn btn-primary"
                            disabled={currentPage === Math.ceil(arrUsers.length / pageSize)}
                            onClick={() => this.setState({ currentPage: currentPage + 1 })}
                        >
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>
                }
                {/* MODAL CẬP NHẬT/THÊM NGƯỜI DÙNG */}
                <Modal isOpen={isModalOpen} toggle={this.resetFormState} className="user-modal" size="lg" centered>
                    <ModalHeader toggle={this.resetFormState}>
                        {action === 'CREATE'
                            ? <FormattedMessage id="manage-user.modal-create" defaultMessage="Thêm mới người dùng" />
                            : <FormattedMessage id="manage-user.modal-update" defaultMessage="Cập nhật người dùng" />
                        }
                    </ModalHeader>
                    <div className="modal-body">
                        <div className="user-form-grid">
                            <div className="input-group-apple full-width">
                                <label><FormattedMessage id="manage-user.image" defaultMessage="Ảnh đại diện (Avatar)" /></label>
                                <div className="avatar-upload-area">
                                    <div className="avatar-preview">
                                        <img src={this.state.previewImgURL || icon_icons} alt="Preview" />
                                    </div>
                                    <input type="file" id="uploadAvatar" hidden onChange={this.handleOnChangeImage} />
                                    <label htmlFor="uploadAvatar" className="upload-btn-label">
                                        <i className="fas fa-camera mr-2"></i>
                                        <FormattedMessage id="manage-user.upload-avatar" defaultMessage="Thay đổi ảnh" />
                                    </label>
                                </div>
                            </div>

                            <div className="input-group-apple">
                                <label>Email <span className="text-danger">*</span></label>
                                <input type="email" value={this.state.email}
                                    placeholder="name@example.com"
                                    onChange={(e) => this.handleOnChangeInput(e, 'email')}
                                    disabled={action === 'EDIT'} />
                            </div>

                            <div className="input-group-apple">
                                <label><FormattedMessage id="system.user-manage.password" defaultMessage="Mật khẩu" /> <span className="text-danger">*</span></label>
                                <input type="password" value={this.state.password}
                                    placeholder="••••••••"
                                    onChange={(e) => this.handleOnChangeInput(e, 'password')}
                                    disabled={action === 'EDIT'} />
                            </div>

                            <div className="input-group-apple">
                                <label><FormattedMessage id="system.user-manage.first-name" defaultMessage="Tên" /> <span className="text-danger">*</span></label>
                                <input type="text" value={this.state.firstName}
                                    placeholder="Steve"
                                    onChange={(e) => this.handleOnChangeInput(e, 'firstName')} />
                            </div>

                            <div className="input-group-apple">
                                <label><FormattedMessage id="system.user-manage.last-name" defaultMessage="Họ" /> <span className="text-danger">*</span></label>
                                <input type="text" value={this.state.lastName}
                                    placeholder="Jobs"
                                    onChange={(e) => this.handleOnChangeInput(e, 'lastName')} />
                            </div>

                            <div className="input-group-apple">
                                <label><FormattedMessage id="manage-user.phone-number" defaultMessage="Số điện thoại" /> <span className="text-danger">*</span></label>
                                <input type="tel" value={this.state.phonenumber}
                                    placeholder="+84 ..."
                                    onChange={(e) => this.handleOnChangeInput(e, 'phonenumber')} />
                            </div>

                            <div className="input-group-apple">
                                <label><FormattedMessage id="manage-user.address" defaultMessage="Địa chỉ" /> <span className="text-danger">*</span></label>
                                <input type="text" value={this.state.address}
                                    placeholder="1 Infinite Loop, Cupertino..."
                                    onChange={(e) => this.handleOnChangeInput(e, 'address')} />
                            </div>

                            <div className="input-group-apple">
                                <label><FormattedMessage id="manage-user.gender" defaultMessage="Giới tính" /></label>
                                <select value={this.state.gender} onChange={(e) => this.handleOnChangeInput(e, 'gender')}>
                                    {genderArr && genderArr.length > 0 && genderArr.map((item, index) => {
                                        return (
                                            <option key={index} value={item.keyMap}>
                                                {language === 'vi' ? item.valueVi : item.valueEn}
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>

                            <div className="input-group-apple">
                                <label><FormattedMessage id="manage-user.role" defaultMessage="Vai trò (Role)" /></label>
                                <select value={this.state.roleId} onChange={(e) => this.handleOnChangeInput(e, 'roleId')}>
                                    {roleArr && roleArr.length > 0 && roleArr.map((item, index) => {
                                        return (
                                            <option key={index} value={item.keyMap}>
                                                {language === 'vi' ? item.valueVi : item.valueEn}
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>

                            <div className="input-group-apple full-width">
                                <label><FormattedMessage id="manage-user.position" defaultMessage="Chức danh" /></label>
                                <select value={this.state.positionId} onChange={(e) => this.handleOnChangeInput(e, 'positionId')}>
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
                    </div>
                    <div className="modal-footer">
                        <button className="btn-cancel" onClick={this.resetFormState}>
                            <FormattedMessage id="manage-user.btn-cancel" defaultMessage="Hủy" />
                        </button>
                        <button className="btn-save" onClick={this.handleSaveUser}>
                            {action === 'CREATE'
                                ? <FormattedMessage id="manage-user.btn-save" defaultMessage="Lưu mới" />
                                : <FormattedMessage id="manage-user.btn-update" defaultMessage="Cập nhật" />
                            }
                        </button>
                    </div>
                </Modal>

            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
