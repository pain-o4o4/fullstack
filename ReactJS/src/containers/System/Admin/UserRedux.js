import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getAllCodeService } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import * as action from '../../../store/actions';
import { add, first, get, last } from 'lodash';
import { injectIntl } from 'react-intl';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // CỰC KỲ QUAN TRỌNG
import TableManager from './TableManager';
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
            avatar: ''
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
        let arrGenders = this.props.genders;
        if (prevProps.genders !== this.props.genders) {
            this.setState({
                genderArr: this.props.genders,
                genders: arrGenders && arrGenders.length > 0 ? arrGenders[0].key : ''
            })
        }
        if (prevProps.roles !== this.props.roles) {
            let arrRoles = this.props.roles;
            this.setState({
                roleArr: this.props.roles,
                roles: arrRoles && arrRoles.length > 0 ? arrRoles[0].key : ''
            })
        }
        if (prevProps.positions !== this.props.positions) {
            let arrPositions = this.props.positions;
            this.setState({
                positionArr: this.props.positions,
                positions: arrPositions && arrPositions.length > 0 ? arrPositions[0].key : ''
            })
        }
        if (prevProps.listUsers !== this.props.listUsers) {
            // Render lại bảng: Vì listUsers là props, khi nó đổi thì TableManager tự render lại
            // Ở đây Duy thực hiện "Xóa trắng Form" cho chuyên nghiệp:
            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                address: '',
                // Reset về giá trị mặc định đầu tiên của các mảng
                gender: this.props.genders && this.props.genders.length > 0 ? this.props.genders[0].key : '',
                role: this.props.roles && this.props.roles.length > 0 ? this.props.roles[0].key : '',
                position: this.props.positions && this.props.positions.length > 0 ? this.props.positions[0].key : '',
                avatar: '',
                previewImgURL: ''
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
    handleOnChangeImage(event) {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgURL: objectUrl,
                avatar: file
            })
        }
    }

    handleSaveUser = () => {
        let isValid = this.checkValidateInput();
        if (isValid === false) return;
        this.props.createNewUser(
            {
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phonenumber: this.state.phoneNumber,
                gender: this.state.genders,
                roleID: this.state.roles,
                positionId: this.state.positions,
                // avatar: this.state.avatar
            }
        );

    }
    onChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        });
        console.log('>>> check state: ', this.state);
    }

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

                <div class="user-redux-overlay">

                    <div class="user-redux-add-new-user">


                        <div class="modal-header">
                            <h5 class="modal-title"><FormattedMessage id="manage-user.add" /></h5>
                            <button type="button" class="close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>


                        <div class="modal-body">
                            <div class="modal-user-body">

                                <div class="input-container">
                                    <label><FormattedMessage id="manage-user.email" /></label>
                                    <input type="email" placeholder="example@domain.com"
                                        value={email}
                                        onChange={(event) => { this.onChangeInput(event, 'email') }}
                                    />
                                </div>

                                <div class="input-container">
                                    <label><FormattedMessage id="manage-user.password" /></label>
                                    <input type="password"
                                        value={password}
                                        onChange={(event) => { this.onChangeInput(event, 'password') }} />
                                </div>

                                <div class="input-container">
                                    <label><FormattedMessage id="manage-user.first-name" /></label>
                                    <input type="text"
                                        value={firstName}
                                        onChange={(event) => { this.onChangeInput(event, 'firstName') }} />
                                </div>

                                <div class="input-container">
                                    <label><FormattedMessage id="manage-user.last-name" /></label>
                                    <input type="text"
                                        value={lastName}
                                        onChange={(event) => { this.onChangeInput(event, 'lastName') }} />
                                </div>

                                <div class="input-container">
                                    <label><FormattedMessage id="manage-user.phone-number" /></label>
                                    <input type="tel" placeholder="+84 ..."
                                        value={phoneNumber}
                                        onChange={(event) => { this.onChangeInput(event, 'phoneNumber') }} />
                                </div>

                                <div class="input-container max-width-input">
                                    <label><FormattedMessage id="manage-user.address" /></label>
                                    <input type="text"
                                        placeholder={this.props.intl.formatMessage({ id: "manage-user.address-place" })}
                                        value={address}
                                        onChange={(event) => { this.onChangeInput(event, 'address') }}
                                    />
                                </div>
                                <div class="input-container">
                                    <label><FormattedMessage id="manage-user.gender" /></label>
                                    <select
                                        onChange={(event) => { this.onChangeInput(event, 'genders') }}
                                    >
                                        {gender && gender.length > 0 &&
                                            gender.map((item, index) => {
                                                return (
                                                    <option key={index} value={item.key}>
                                                        {/* Hiển thị giá trị dựa trên ngôn ngữ đang chọn */}
                                                        {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                    </option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>

                                <div class="input-container">
                                    <label><FormattedMessage id="manage-user.position" /></label>

                                    <select
                                        onChange={(event) => { this.onChangeInput(event, 'positions') }}

                                    >
                                        {position && position.length > 0 &&
                                            position.map((item, index) => {
                                                return (
                                                    <option key={index} value={item.key}>
                                                        {/* Hiển thị giá trị dựa trên ngôn ngữ đang chọn */}
                                                        {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                    </option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>

                                <div class="input-container">
                                    <label><FormattedMessage id="manage-user.role" /></label>
                                    <select
                                        onChange={(event) => { this.onChangeInput(event, 'roles') }}

                                    >
                                        {role && role.length > 0 &&
                                            role.map((item, index) => {
                                                return (
                                                    <option key={index} value={item.key}>
                                                        {/* Hiển thị giá trị dựa trên ngôn ngữ đang chọn */}
                                                        {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                    </option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>

                                <div class="input-container">
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
                            <button type="button" className="btn btn-primary px-4" onClick={this.handleSaveUser}>
                                <FormattedMessage id="manage-user.save" />
                            </button>
                        </div>

                    </div>
                </div>
                <TableManager />
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


    };
};

// export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(UserRedux));