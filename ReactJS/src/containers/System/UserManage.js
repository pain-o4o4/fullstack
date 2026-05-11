import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { CommonUtils } from '../../utils';
import {
    getAllUsers,
    createNewUsersService,
    deleteUserService,
    editUserService,
    getAllCodeService
} from '../../services/userService';
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
            isPopupOpen: false,
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
            pageSize: 8,
            quickEditUser: null,

            searchTerm: '',
            sortBy: 'createdAt',
            sortOrder: 'desc',
            filterRole: 'ALL',
            selectedUsers: [], // Track selected user IDs
            showBulkDeleteConfirm: false, // Custom confirm popup
            userToForceDelete: null, // Track user for single force delete
            isForceDelete: false // Toggle for force delete mode
        };
        this.fileInputRef = React.createRef();
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

    handleQuickChangeAvatar = (user) => {
        this.setState({ quickEditUser: user }, () => {
            if (this.fileInputRef && this.fileInputRef.current) {
                this.fileInputRef.current.click();
            }
        });
    }

    handleQuickUploadImage = async (event) => {
        let { quickEditUser } = this.state;
        let file = event.target.files[0];
        if (file && quickEditUser) {
            let base64 = await CommonUtils.getBase64(file);
            let userData = {
                id: quickEditUser.id,
                email: quickEditUser.email,
                password: 'HIDDEN_PASSWORD',
                firstName: quickEditUser.firstName,
                lastName: quickEditUser.lastName,
                address: quickEditUser.address,
                phonenumber: quickEditUser.phonenumber,
                gender: quickEditUser.gender,
                roleId: quickEditUser.roleId,
                positionId: quickEditUser.positionId,
                avatar: base64
            };
            try {
                let res = await editUserService(userData);
                if (res && res.errCode === 0) {
                    await this.fetchAllData();
                } else {
                    alert(res.errMessage);
                }
            } catch (e) {
                console.log(e);
            }
        }
        event.target.value = ''; // reset file input
    }

    closePopup = () => {
        let { genderArr, roleArr, positionArr } = this.state;
        this.setState({
            isPopupOpen: false,
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
        this.closePopup();
        this.setState({ isPopupOpen: true, action: 'CREATE' });
    }

    handleEditUser = (user) => {
        let imageBase64 = decodeBase64Buffer(user.image);

        this.setState({
            isPopupOpen: true,
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
                this.closePopup();
                await this.fetchAllData();
            } else {
                alert(res.errMessage);
            }
        } catch (error) {
            console.log("Save error:", error);
        }
    }

    handleDeleteUser = async (user, force = false) => {
        let { language } = this.props;
        try {
            let res = await deleteUserService(user.id, force);
            if (res && res.errCode === 0) {
                this.setState({
                    selectedUsers: this.state.selectedUsers.filter(id => id !== user.id),
                    showBulkDeleteConfirm: false,
                    userToForceDelete: null,
                    isForceDelete: false
                });
                await this.fetchAllData();
            } else if (res && res.errCode === 5) {
                // Dependency warning - show custom confirm
                this.setState({
                    showBulkDeleteConfirm: true,
                    userToForceDelete: user,
                    isForceDelete: true
                });
            } else {
                alert(res.errMessage);
            }
        } catch (error) {
            console.log(error);
        }
    }

    handleSelectUser = (userId) => {
        let { selectedUsers } = this.state;
        if (selectedUsers.includes(userId)) {
            this.setState({ selectedUsers: selectedUsers.filter(id => id !== userId) });
        } else {
            this.setState({ selectedUsers: [...selectedUsers, userId] });
        }
    }

    handleSelectAll = (displayUsers) => {
        let { selectedUsers } = this.state;
        let allIdsOnPage = displayUsers.map(u => u.id);
        let allSelectedOnPage = allIdsOnPage.every(id => selectedUsers.includes(id));

        if (allSelectedOnPage) {
            this.setState({ selectedUsers: selectedUsers.filter(id => !allIdsOnPage.includes(id)) });
        } else {
            this.setState({ selectedUsers: [...new Set([...selectedUsers, ...allIdsOnPage])] });
        }
    }

    handleBulkDelete = async () => {
        let { selectedUsers } = this.state;
        if (selectedUsers.length === 0) return;
        this.setState({ showBulkDeleteConfirm: true });
    }

    confirmBulkDelete = async (force = false) => {
        let { selectedUsers } = this.state;
        let successCount = 0;
        let errors = [];
        let hasDependencyWarning = false;

        try {
            // Sequentially delete users and collect results
            for (let userId of selectedUsers) {
                let res = await deleteUserService(userId, force);
                if (res && res.errCode === 0) {
                    successCount++;
                } else if (res && res.errCode === 5) {
                    hasDependencyWarning = true;
                    errors.push(res.errMessage);
                } else {
                    errors.push(res.errMessage || `User ID ${userId} error`);
                }
            }

            if (hasDependencyWarning && !force) {
                this.setState({ isForceDelete: true, showBulkDeleteConfirm: true });
                return;
            }

            // Update state based on results
            if (errors.length > 0 && !hasDependencyWarning) {
                alert(errors.join('\n'));
            }

            this.setState({ selectedUsers: [], showBulkDeleteConfirm: false, isForceDelete: false });
            await this.fetchAllData();
        } catch (error) {
            console.log("Bulk delete error:", error);
            this.setState({ showBulkDeleteConfirm: false });
        }
    }

    handleCancelBulkDelete = () => {
        this.setState({ showBulkDeleteConfirm: false, userToForceDelete: null, isForceDelete: false });
    }

    handleCancelSelection = () => {
        this.setState({ selectedUsers: [] });
    }

    getProcessedUsers = () => {
        let { arrUsers, searchTerm, sortBy, sortOrder, filterRole } = this.state;
        let filtered = [...arrUsers];

        if (searchTerm) {
            let term = searchTerm.toLowerCase();
            filtered = filtered.filter(u =>
                u.id.toString().includes(term) ||
                u.email.toLowerCase().includes(term) ||
                (u.address && u.address.toLowerCase().includes(term))
            );
        }

        if (filterRole !== 'ALL') {
            filtered = filtered.filter(u => u.roleId === filterRole);
        }

        filtered.sort((a, b) => {
            let valA = a[sortBy];
            let valB = b[sortBy];
            if (sortBy === 'createdAt') {
                valA = new Date(a.createdAt || 0);
                valB = new Date(b.createdAt || 0);
            }
            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }

    handleSort = (key) => {
        let { sortBy, sortOrder } = this.state;
        if (sortBy === key) {
            this.setState({ sortOrder: sortOrder === 'asc' ? 'desc' : 'asc' });
        } else {
            this.setState({ sortBy: key, sortOrder: 'desc' });
        }
    }

    render() {
        let { isPopupOpen, action, genderArr, roleArr, positionArr, currentPage, pageSize, searchTerm, sortBy, sortOrder, filterRole, selectedUsers } = this.state;
        let { language, userInfo } = this.props;

        let processedUsers = this.getProcessedUsers();
        let displayUsers = processedUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
        let totalPages = Math.ceil(processedUsers.length / pageSize);

        let isAllSelectedOnPage = displayUsers.length > 0 && displayUsers.every(u => selectedUsers.includes(u.id));

        return (
            <div className="apple-user-manage">
                <div className="manage-header">
                    <div className="header-info">
                        <h1><FormattedMessage id="manage-user.title" defaultMessage="Quản lý Người Dùng" /></h1>
                        <span>{processedUsers.length} <FormattedMessage id="manage-user.total-users" defaultMessage="người dùng" /></span>
                    </div>
                    <div className="header-btns">
                        <button className="btn-add" onClick={this.handleAddNewUser}>
                            <i className="fas fa-plus"></i>
                            <FormattedMessage id="manage-user.add-user" defaultMessage="Thêm" />
                        </button>
                    </div>
                </div>

                <div className="manage-toolbar">
                    <div className="search-wrapper">
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder={language === 'vi' ? "Tìm theo tên, email..." : "Search users..."}
                            value={searchTerm}
                            onChange={(e) => this.setState({ searchTerm: e.target.value, currentPage: 1 })}
                        />
                    </div>
                    <div className="filter-group">
                        <select value={filterRole} onChange={(e) => this.setState({ filterRole: e.target.value, currentPage: 1 })}>
                            <option value="ALL">{language === 'vi' ? 'Mọi vai trò' : 'All Roles'}</option>
                            {roleArr.map((item, index) => (
                                <option key={index} value={item.keyMap}>{language === 'vi' ? item.valueVi : item.valueEn}</option>
                            ))}
                        </select>
                        <select value={sortBy} onChange={(e) => this.handleSort(e.target.value)}>
                            <option value="createdAt">{language === 'vi' ? 'Mới nhất' : 'Newest'}</option>
                            <option value="email">Email</option>
                            <option value="roleId">Vai trò</option>
                        </select>
                    </div>
                </div>

                <div className="table-wrapper">
                    <table className="clean-table">
                        <thead>
                            <tr>
                                <th className="check-col">
                                    <input
                                        type="checkbox"
                                        checked={isAllSelectedOnPage}
                                        onChange={() => this.handleSelectAll(displayUsers)}
                                    />
                                </th>
                                <th onClick={() => this.handleSort('id')}>ID</th>
                                <th><FormattedMessage id="manage-user.table-email" defaultMessage="Thông tin" /></th>
                                <th><FormattedMessage id="manage-user.table-role" defaultMessage="Vai trò" /></th>
                                <th><FormattedMessage id="manage-user.table-address" defaultMessage="Địa chỉ" /></th>
                                <th className="text-right">
                                    {selectedUsers.length > 0 ? (
                                        <div className="header-bulk-actions">
                                            <button className="btn-cancel-select" onClick={this.handleCancelSelection} title={language === 'vi' ? 'Hủy chọn' : 'Cancel'}>
                                                <i className="fas fa-times"></i>
                                            </button>
                                            <button className="btn-bulk-delete" onClick={this.handleBulkDelete} title={language === 'vi' ? 'Xóa mục đã chọn' : 'Delete selected'}>
                                                <i className="fas fa-trash-alt"></i>
                                                <span>{selectedUsers.length}</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <FormattedMessage id="manage-user.table-action" defaultMessage="Hành động" />
                                    )}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayUsers.map((item, index) => {
                                let imageBase64 = decodeBase64Buffer(item.image);
                                let isSelected = selectedUsers.includes(item.id);
                                return (
                                    <tr key={item.id || index} className={`${isSelected ? 'selected-row' : ''} ${item.id === userInfo.id ? 'current-user-row' : ''}`}>
                                        <td className="check-col">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => this.handleSelectUser(item.id)}
                                                disabled={item.id === userInfo.id}
                                            />
                                        </td>
                                        <td className="id-col">#{item.id}</td>
                                        <td>
                                            <div className="user-cell">
                                                <div className="user-avatar" onClick={() => this.handleQuickChangeAvatar(item)}>
                                                    <img src={imageBase64 || 'https://static.vecteezy.com/system/resources/previews/026/625/600/non_2x/person-icon-symbol-design-illustration-vector.jpg'} alt="avatar" />
                                                </div>
                                                <div className="user-info">
                                                    <div className="user-name">
                                                        {item.lastName} {item.firstName}
                                                        {item.id === userInfo.id && <span className="you-badge">(Bạn)</span>}
                                                    </div>
                                                    <div className="user-email">{item.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className={`badge ${item.roleId?.toLowerCase()}`}>{item.roleId}</span></td>
                                        <td className="address-col">{item.address}</td>
                                        <td>
                                            <div className="action-btns">
                                                <button onClick={() => this.handleEditUser(item)} className="edit"><i className="fas fa-pencil-alt"></i></button>
                                                {item.id !== userInfo.id && (
                                                    <button onClick={() => {
                                                        this.setState({ userToForceDelete: item, showBulkDeleteConfirm: true, isForceDelete: false });
                                                    }} className="delete"><i className="fas fa-trash"></i></button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="pagination-bar">
                    <button disabled={currentPage === 1} onClick={() => this.setState({ currentPage: currentPage - 1 })}><i className="fas fa-chevron-left"></i></button>
                    <span>{currentPage} / {totalPages || 1}</span>
                    <button disabled={currentPage === totalPages} onClick={() => this.setState({ currentPage: currentPage + 1 })}><i className="fas fa-chevron-right"></i></button>
                </div>

                <input type="file" hidden ref={this.fileInputRef} onChange={this.handleQuickUploadImage} accept="image/*" />

                {/* CUSTOM POPUP COMPONENT */}
                {isPopupOpen && (
                    <div className="apple-popup-overlay" onClick={this.closePopup}>
                        <div className="apple-popup-content" onClick={(e) => e.stopPropagation()}>
                            <div className="popup-header">
                                <div className="title">
                                    {action === 'CREATE' ? 'Thêm Người Dùng' : 'Cập Nhật Người Dùng'}
                                </div>
                                <button className="close-btn" onClick={this.closePopup}><i className="fas fa-times"></i></button>
                            </div>

                            <div className="popup-body">
                                <div className="avatar-picker">
                                    <div className="preview-wrap">
                                        <img src={this.state.previewImgURL || icon_icons} alt="Preview" />
                                        <input type="file" id="pAvatar" hidden onChange={this.handleOnChangeImage} />
                                        <label htmlFor="pAvatar" className="camera-btn"><i className="fas fa-camera"></i></label>
                                    </div>
                                </div>

                                <div className="form-grid">
                                    <div className="input-field">
                                        <label>Email</label>
                                        <input type="email" value={this.state.email} onChange={(e) => this.handleOnChangeInput(e, 'email')} disabled={action === 'EDIT'} placeholder="apple@icloud.com" />
                                    </div>
                                    <div className="input-field">
                                        <label>Mật khẩu</label>
                                        <input type="password" value={this.state.password} onChange={(e) => this.handleOnChangeInput(e, 'password')} disabled={action === 'EDIT'} placeholder="••••••••" />
                                    </div>
                                    <div className="input-field">
                                        <label>Họ</label>
                                        <input type="text" value={this.state.lastName} onChange={(e) => this.handleOnChangeInput(e, 'lastName')} placeholder="Họ" />
                                    </div>
                                    <div className="input-field">
                                        <label>Tên</label>
                                        <input type="text" value={this.state.firstName} onChange={(e) => this.handleOnChangeInput(e, 'firstName')} placeholder="Tên" />
                                    </div>
                                    <div className="input-field">
                                        <label>Số điện thoại</label>
                                        <input type="tel" value={this.state.phonenumber} onChange={(e) => this.handleOnChangeInput(e, 'phonenumber')} placeholder="09xx..." />
                                    </div>
                                    <div className="input-field">
                                        <label>Địa chỉ</label>
                                        <input type="text" value={this.state.address} onChange={(e) => this.handleOnChangeInput(e, 'address')} placeholder="Địa chỉ..." />
                                    </div>
                                    <div className="input-field">
                                        <label>Giới tính</label>
                                        <select value={this.state.gender} onChange={(e) => this.handleOnChangeInput(e, 'gender')}>
                                            {genderArr.map((item, index) => (<option key={index} value={item.keyMap}>{language === 'vi' ? item.valueVi : item.valueEn}</option>))}
                                        </select>
                                    </div>
                                    <div className="input-field">
                                        <label>Vai trò</label>
                                        <select value={this.state.roleId} onChange={(e) => this.handleOnChangeInput(e, 'roleId')}>
                                            {roleArr.map((item, index) => (<option key={index} value={item.keyMap}>{language === 'vi' ? item.valueVi : item.valueEn}</option>))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="popup-footer">
                                <button className="btn-secondary" onClick={this.closePopup}>Hủy</button>
                                <button className="btn-primary" onClick={this.handleSaveUser}>
                                    {action === 'CREATE' ? 'Tạo mới' : 'Cập nhật'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* BULK DELETE CONFIRM POPUP */}
                {this.state.showBulkDeleteConfirm && (
                    <div className="apple-confirm-overlay">
                        <div className="apple-confirm-popup">
                            <div className="popup-title">
                                {this.state.isForceDelete ?
                                    (language === 'vi' ? 'Cảnh báo dữ liệu!' : 'Data Warning!') :
                                    (language === 'vi' ? (this.state.userToForceDelete ? 'Xóa người dùng?' : `Xóa ${selectedUsers.length} người dùng?`) : (this.state.userToForceDelete ? 'Delete user?' : `Delete ${selectedUsers.length} users?`))
                                }
                            </div>
                            <div className="popup-desc">
                                {this.state.isForceDelete ?
                                    (language === 'vi'
                                        ? 'Người dùng này có dữ liệu lịch sử (lịch hẹn, bệnh án). Bạn có chắc chắn muốn xóa mềm? Dữ liệu lịch sử vẫn sẽ được giữ lại.'
                                        : 'This user has historical data. Do you still want to soft delete? Historical records will be preserved.') :
                                    (language === 'vi'
                                        ? 'Những người dùng được chọn sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.'
                                        : 'Selected users will be permanently deleted. This action cannot be undone.')
                                }
                            </div>
                            <div className="popup-actions">
                                <button className="btn-cancel" onClick={this.handleCancelBulkDelete}>
                                    {language === 'vi' ? 'Hủy' : 'Cancel'}
                                </button>
                                <button className="btn-delete" onClick={() => {
                                    if (this.state.userToForceDelete) {
                                        this.handleDeleteUser(this.state.userToForceDelete, true);
                                    } else {
                                        this.confirmBulkDelete(this.state.isForceDelete);
                                    }
                                }}>
                                    {language === 'vi' ? 'Xác nhận xóa' : 'Confirm Delete'}
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
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
