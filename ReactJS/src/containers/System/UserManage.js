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
import './UserManage.scss';

// Utility helper to decode DB buffer without requiring Webpack Buffer polyfills
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
            action: 'CREATE', // 'CREATE' or 'EDIT'
            
            // Dropdown Data
            genderArr: [],
            roleArr: [],
            positionArr: [],
            
            // Form state
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
            previewImgURL: ''
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
                if(genderRes.data && genderRes.data.length > 0) stateUpdate.gender = genderRes.data[0].keyMap;
            }
            if (roleRes && roleRes.errCode === 0) {
                stateUpdate.roleArr = roleRes.data;
                if(roleRes.data && roleRes.data.length > 0) stateUpdate.roleId = roleRes.data[0].keyMap;
            }
            if (positionRes && positionRes.errCode === 0) {
                stateUpdate.positionArr = positionRes.data;
                if(positionRes.data && positionRes.data.length > 0) stateUpdate.positionId = positionRes.data[0].keyMap;
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

        // Basic validation
        if (!email || !firstName || !lastName || !address || !phonenumber) {
            alert('Vui lòng điền đủ các trường bắt buộc!');
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
        try {
            if (window.confirm(`Are you sure to delete user: ${user.email}?`)) {
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
        let { arrUsers, isModalOpen, action, genderArr, roleArr, positionArr } = this.state;
        let { language } = this.props;

        return (
            <div className="users-container">
                <div className="header-section">
                    <h1 className="page-title"><FormattedMessage id="menu.admin.crud" defaultMessage="Quản lý người dùng" /></h1>
                    <button className="btn-add-user" onClick={this.handleAddNewUser}>
                        <i className="fas fa-plus"></i>
                        Thêm tài khoản
                    </button>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Quyền/Vai trò</th>
                                <th>Địa chỉ</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {arrUsers && arrUsers.length > 0 ? (
                                arrUsers.map((item, index) => {
                                    let imageBase64 = decodeBase64Buffer(item.image);
                                    
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <div className="user-info-cell">
                                                    <div className="avatar-mini">
                                                        <img src={imageBase64 || 'https://static.vecteezy.com/system/resources/previews/026/625/600/non_2x/person-icon-symbol-design-illustration-vector.jpg'} alt="avatar"/>
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
                                        Không có dữ liệu
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* MODAL CẬP NHẬT/THÊM NGƯỜI DÙNG */}
                <Modal isOpen={isModalOpen} toggle={this.resetFormState} className="user-modal" size="lg" centered>
                    <div className="modal-header">
                        <span className="modal-title">
                            {action === 'CREATE' ? 'Thêm mới người dùng' : 'Cập nhật người dùng'}
                        </span>
                        <button className="close" onClick={this.resetFormState}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="user-form-grid">
                            
                            <div className="input-group-apple">
                                <label>Email <span className="text-danger">*</span></label>
                                <input type="email" value={this.state.email} 
                                       onChange={(e) => this.handleOnChangeInput(e, 'email')} 
                                       disabled={action === 'EDIT'} />
                            </div>

                            <div className="input-group-apple">
                                <label>Password <span className="text-danger">*</span></label>
                                <input type="password" value={this.state.password} 
                                       onChange={(e) => this.handleOnChangeInput(e, 'password')}
                                       disabled={action === 'EDIT'} />
                            </div>

                            <div className="input-group-apple">
                                <label>First Name <span className="text-danger">*</span></label>
                                <input type="text" value={this.state.firstName} 
                                       onChange={(e) => this.handleOnChangeInput(e, 'firstName')} />
                            </div>

                            <div className="input-group-apple">
                                <label>Last Name <span className="text-danger">*</span></label>
                                <input type="text" value={this.state.lastName} 
                                       onChange={(e) => this.handleOnChangeInput(e, 'lastName')} />
                            </div>

                            <div className="input-group-apple">
                                <label>Số điện thoại <span className="text-danger">*</span></label>
                                <input type="tel" value={this.state.phonenumber} 
                                       onChange={(e) => this.handleOnChangeInput(e, 'phonenumber')} />
                            </div>

                            <div className="input-group-apple full-width">
                                <label>Địa chỉ <span className="text-danger">*</span></label>
                                <input type="text" value={this.state.address} 
                                       onChange={(e) => this.handleOnChangeInput(e, 'address')} />
                            </div>

                            <div className="input-group-apple">
                                <label>Giới tính</label>
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
                                <label>Chức danh</label>
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

                            <div className="input-group-apple">
                                <label>Vai trò (Role)</label>
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

                            <div className="input-group-apple">
                                <label>Ảnh đại diện (Avatar)</label>
                                <div className="avatar-upload-area">
                                    <div className="avatar-preview">
                                        <img src={this.state.previewImgURL || 'https://static.vecteezy.com/system/resources/previews/026/625/600/non_2x/person-icon-symbol-design-illustration-vector.jpg'} alt="Preview" />
                                    </div>
                                    <input type="file" id="uploadAvatar" hidden onChange={this.handleOnChangeImage} />
                                    <label htmlFor="uploadAvatar" className="upload-btn-label">Tải ảnh lên</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn-cancel" onClick={this.resetFormState}>Hủy</button>
                        <button className="btn-save" onClick={this.handleSaveUser}>
                            {action === 'CREATE' ? 'Lưu mới' : 'Cập nhật'}
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
