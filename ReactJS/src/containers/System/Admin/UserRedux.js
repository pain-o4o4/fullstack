import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getAllCodeService } from '../../../services/userService';
import { LANGUAGES, CRUD_ACTION, CommonUtils } from '../../../utils';
import * as action from '../../../store/actions';
import { add, first, get, last } from 'lodash';
import { injectIntl } from 'react-intl';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // CỰC KỲ QUAN TRỌNG
import TableManager from './TableManager';
import { Table } from 'reactstrap';
class UserRedux extends Component {

    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImgURL: '',
            isOpen: false,
            email: '',
            password: '',
            phoneNumber: '',
            firstName: '',
            lastName: '',
            address: '',
            genders: '',
            positions: '',
            roles: '',
            avatar: '',
            userEditId: '',
            // Khởi tạo là một mảng rỗng
        }
    }

    async componentDidMount() {
        this.props.getGenderStart();
        this.props.getPositionStart();
        this.props.getRoleStart();
        // try {
        //     // Nên truyền 'GENDER' để lấy đúng dữ liệu giới tính
        //     let response = await getAllCodeService('GENDER');
        //     if (response && response.errCode === 0) {
        //         this.setState({
        //             genderArr: response.data // Đổ dữ liệu vào state
        //         });
        //     }
        // } catch (error) {
        //     console.log(error);
        // }
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        // 1. Cập nhật danh sách Gender
        if (prevProps.genders !== this.props.genders) {
            this.setState({
                genderArr: this.props.genders,
                genders: this.props.genders && this.props.genders.length > 0 ? this.props.genders[0].keyMap : ''
            })
        }
        // 2. Cập nhật danh sách Role
        if (prevProps.roles !== this.props.roles) {
            this.setState({
                roleArr: this.props.roles,
                roles: this.props.roles && this.props.roles.length > 0 ? this.props.roles[0].keyMap : ''
            })
        }
        // 3. Cập nhật danh sách Position
        if (prevProps.positions !== this.props.positions) {
            this.setState({
                positionArr: this.props.positions,
                positions: this.props.positions && this.props.positions.length > 0 ? this.props.positions[0].keyMap : ''
            })
        }

        // 4. Khi lưu/xóa/sửa thành công (listUsers thay đổi)
        if (prevProps.listUsers !== this.props.listUsers) {
            this.setState({
                email: '', password: '', firstName: '', lastName: '',
                phoneNumber: '', address: '', avatar: '', previewImgURL: '', userEditId: '',
                // Quan trọng: Tên biến state phải là genders, roles, positions (có chữ s)
                genders: this.props.genders && this.props.genders.length > 0 ? this.props.genders[0].keyMap : '',
                roles: this.props.roles && this.props.roles.length > 0 ? this.props.roles[0].keyMap : '',
                positions: this.props.positions && this.props.positions.length > 0 ? this.props.positions[0].keyMap : '',
                action: CRUD_ACTION.CREATE // Reset trạng thái về thêm mới
            })
        }

    }
    openPreviewImage = () => {
        if (!this.state.previewImgURL) return; // Không có ảnh thì không mở
        this.setState({
            isOpen: true
        })
    }
    checkValidateInput = () => {
        let arrCheck = ['email', 'password', 'firstName', 'lastName', 'phoneNumber', 'address'];
        let isValid = true;
        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false;
                alert('Missing parameter: ' + arrCheck[i]);
                break;
            }
        }
        return isValid;
    }
    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];

        if (file) {
            try {
                // Chuyển file thành Base64
                let base64 = await CommonUtils.getBase64(file);

                // Tạo URL preview để hiển thị ảnh
                let objectUrl = URL.createObjectURL(file);
                console.log('>>> check base64: ', base64);
                this.setState({
                    previewImgURL: objectUrl,   // Dùng để hiển thị ảnh preview
                    avatar: base64,             // ← Quan trọng: Lưu Base64 để gửi API
                    // avatarFile: file         // Nếu cần giữ File object thì mới lưu thêm
                });
            } catch (error) {
                console.log('Error converting image to base64: ', error);
            }
        }

    };

    handleSaveUser = () => {
        let isValid = this.checkValidateInput();
        if (isValid === false) return;
        let { action } = this.state;
        if (action === CRUD_ACTION.CREATE) {
            this.props.createNewUser({
                id: this.state.userEditId,
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phonenumber: this.state.phoneNumber,
                gender: this.state.genders,
                roleId: this.state.roles,
                positionId: this.state.positions,
                avatar: this.state.avatar
            });
        }
        if (action === CRUD_ACTION.EDIT) {
            this.props.editUserRedux(
                {
                    id: this.state.userEditId,
                    email: this.state.email,
                    password: this.state.password,
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    address: this.state.address,
                    phonenumber: this.state.phoneNumber,
                    gender: this.state.genders,
                    roleId: this.state.roles,
                    positionId: this.state.positions,
                    avatar: this.state.avatar
                }
            );
        }

    }
    onChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        });
        console.log('>>> check state :)))))))))))))))))): ', this.state);
    }

    // handleEditUserFromParent = (user) => {
    //     // let previewImgURL = '';
    //     let imageBase64 = '';

    //     if (user.image) {

    //         const buffer = Buffer.from(user.image);
    //         const imageBase64 = buffer.toString('base64');
    //         // base64String = `data:image/jpeg;base64,${rawBase64}`;


    //     }

    //     this.setState({
    //         email: user.email || '',
    //         password: 'HASHCODE',
    //         firstName: user.firstName || '',
    //         lastName: user.lastName || '',
    //         phoneNumber: user.phonenumber || '',
    //         address: user.address || '',

    //         genders: user.gender || '',
    //         positions: user.positionId || '',
    //         roles: user.roleId || '',

    //         avatar: imageBase64,           // Lưu base64 để gửi API
    //         previewImgURL: imageBase64,   // Dùng để hiển thị ảnh
    //         userEditId: user.id,
    //         action: CRUD_ACTION.EDIT,
    //     }, () => {
    //         console.log('State sau khi edit user:', this.state);
    //     });
    // };
    handleEditUserFromParent = (user) => {
        let imageBase64 = '';
        if (user.image) {
            // Chuyển đổi Buffer từ DB sang Base64
            // Dữ liệu từ Sequelize thường nằm trong user.image.data
            imageBase64 = new Buffer(user.image, 'base64').toString('binary');
        }

        this.setState({
            email: user.email,
            password: 'HASHCODE',
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phonenumber,
            address: user.address,
            genders: user.gender,
            positions: user.positionId,
            roles: user.roleId,

            // --- QUAN TRỌNG NHẤT Ở ĐÂY ---
            avatar: imageBase64,           // Lưu để gửi ngược lại API khi Save
            previewImgURL: imageBase64,    // Gán vào URL để render ra ảnh
            userEditId: user.id,
            action: CRUD_ACTION.EDIT,
        });
        console.log('State sau khi edit user:', this.state);
    };
    render() {
        let gender = this.state.genderArr; // Lấy dữ liệu từ state
        let position = this.state.positionArr;
        let role = this.state.roleArr;
        let { language } = this.props;
        let isLoading = this.props.isLoadingGender;
        let { email, password, phoneNumber,
            firstName, lastName, address,
            genders, positions, roles,
            avatar } = this.state;
        console.log('Check props từ Redux:', this.props.genders, this.props.positions, this.props.roles);
        return (
            <React.Fragment>
                <TableManager
                    handleEditUserFromParent={this.handleEditUserFromParent}
                    action={this.state.action}
                />
                <div className="user-redux-overlay">

                    <div className="user-redux-add-new-user">


                        <div className="modal-header">
                            <h5 className="modal-title"><FormattedMessage id="manage-user.add" /></h5>
                            <button type="button" className="close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>


                        <div className="modal-body">
                            <div className="modal-user-body">

                                <div className="input-container">
                                    <label><FormattedMessage id="manage-user.email" /></label>
                                    <input type="email" placeholder="example@domain.com"
                                        disabled={this.state.action === CRUD_ACTION.EDIT ? true : false}
                                        value={email}
                                        onChange={(event) => { this.onChangeInput(event, 'email') }}
                                    />
                                </div>

                                <div className="input-container">
                                    <label><FormattedMessage id="manage-user.password" /></label>
                                    <input type="password"
                                        disabled={this.state.action === CRUD_ACTION.EDIT ? true : false}

                                        value={password}
                                        onChange={(event) => { this.onChangeInput(event, 'password') }} />
                                </div>

                                <div className="input-container">
                                    <label><FormattedMessage id="manage-user.first-name" /></label>
                                    <input type="text"
                                        value={firstName}
                                        onChange={(event) => { this.onChangeInput(event, 'firstName') }} />
                                </div>

                                <div className="input-container">
                                    <label><FormattedMessage id="manage-user.last-name" /></label>
                                    <input type="text"
                                        value={lastName}
                                        onChange={(event) => { this.onChangeInput(event, 'lastName') }} />
                                </div>

                                <div className="input-container">
                                    <label><FormattedMessage id="manage-user.phone-number" /></label>
                                    <input type="tel" placeholder="+84 ..."
                                        value={phoneNumber}
                                        onChange={(event) => { this.onChangeInput(event, 'phoneNumber') }} />
                                </div>

                                <div className="input-container max-width-input">
                                    <label><FormattedMessage id="manage-user.address" /></label>
                                    <input type="text"
                                        placeholder={this.props.intl.formatMessage({ id: "manage-user.address-place" })}
                                        value={address}
                                        onChange={(event) => { this.onChangeInput(event, 'address') }}
                                    />
                                </div>
                                <div className="input-container">
                                    <label><FormattedMessage id="manage-user.gender" /></label>
                                    <select
                                        onChange={(event) => { this.onChangeInput(event, 'genders') }}
                                        value={this.state.genders}
                                    >
                                        {gender && gender.length > 0 &&
                                            gender.map((item, index) => {
                                                return (
                                                    <option key={index} value={item.keyMap}>
                                                        {/* Hiển thị giá trị dựa trên ngôn ngữ đang chọn */}
                                                        {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                    </option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>

                                <div className="input-container">
                                    <label><FormattedMessage id="manage-user.position" /></label>
                                    {/* value={this.state.positions} */}
                                    <select
                                        onChange={(event) => { this.onChangeInput(event, 'positions') }}
                                        value={this.state.positions} // THÊM DÒNG NÀY
                                    >
                                        {position && position.length > 0 &&
                                            position.map((item, index) => {
                                                return (
                                                    <option key={index} value={item.keyMap}>
                                                        {/* Hiển thị giá trị dựa trên ngôn ngữ đang chọn */}
                                                        {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                    </option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>

                                <div className="input-container">
                                    <label><FormattedMessage id="manage-user.role" /></label>
                                    <select
                                        onChange={(event) => { this.onChangeInput(event, 'roles') }}
                                        value={this.state.roles}
                                    >
                                        {role && role.length > 0 &&
                                            role.map((item, index) => {
                                                return (
                                                    <option key={index} value={item.keyMap}>
                                                        {/* Hiển thị giá trị dựa trên ngôn ngữ đang chọn */}
                                                        {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                    </option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>

                                <div className="input-container">
                                    {/* <label><FormattedMessage id="manage-user.image" /></label>
                                    <input
                                        type="text"
                                        placeholder={this.props.intl.formatMessage({ id: "manage-user.image-palce" })}
                                    /> */}
                                    <label><FormattedMessage id="manage-user.image" /></label>
                                    <div className="preview-img-container">
                                        {/* Input thật bị ẩn đi */}
                                        <input id="previewImg" type="file" hidden
                                            onChange={(event) => this.handleOnChangeImage(event)}
                                        />

                                        {/* Cái label này đóng vai trò là nút bấm đẹp mắt */}
                                        <label className="label-upload" htmlFor="previewImg">
                                            Tải ảnh <i className="fas fa-upload"></i>
                                        </label>
                                        {this.state.isOpen === true && (
                                            <Lightbox
                                                mainSrc={this.state.previewImgURL}
                                                onCloseRequest={() => this.setState({ isOpen: false })}
                                            />
                                        )}
                                        {/* Ô hiển thị ảnh xem trước (Preview) */}
                                        <div className="preview-image"
                                            style={{ backgroundImage: `url(${this.state.previewImgURL})` }}
                                            onClick={() => this.openPreviewImage()} // Click vào ảnh để phóng to
                                        >

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="modal-footer">
                            <button
                                type="button"
                                className={this.state.action === CRUD_ACTION.EDIT ? "btn btn-warning px-4" : "btn btn-primary px-4"}
                                onClick={this.handleSaveUser}
                            >
                                {this.state.action === CRUD_ACTION.EDIT ?
                                    <FormattedMessage id="manage-user.edit" /> :
                                    <FormattedMessage id="manage-user.save" />
                                }
                            </button>
                        </div>

                    </div>
                </div>
                {/* <TableManager /> */}
            </React.Fragment>

        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
        isLoading: state.admin.isLoadingGender,
        roles: state.admin.roles,
        positions: state.admin.positions,
        listUsers: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(action.fetchGenderStart()),
        getPositionStart: () => dispatch(action.fetchPositionStart()),
        getRoleStart: () => dispatch(action.fetchRoleStart()),
        createNewUser: (data) => dispatch(action.createNewUser(data)),
        fetchUserRedux: () => dispatch(action.fetchAllUserStart()),
        editUserRedux: (data) => dispatch(action.editUser(data))


    };
};

// export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(UserRedux));