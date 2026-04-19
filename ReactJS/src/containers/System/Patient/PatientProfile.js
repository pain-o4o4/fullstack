import React, { Component } from 'react';
import { connect } from "react-redux";
import { toast } from "react-toastify";
import * as action from '../../../store/actions';
import { postUpdatePatientService } from '../../../services/userService';
import './PatientProfile.scss';

class PatientProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            email: '',
            firstName: '',
            lastName: '',
            phonenumber: '',
            address: '',
            image: '',
            password: '',
        }
    }

    async componentDidMount() {
        let { userInfo } = this.props;
        if (userInfo && Object.keys(userInfo).length > 0) {
            this.setState({
                id: userInfo.id,
                email: userInfo.email,
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                phonenumber: userInfo.phonenumber,
                address: userInfo.address,
                image: userInfo.image,
            });
        }
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.userInfo !== this.props.userInfo) {
            let { userInfo } = this.props;
            if (userInfo) {
                let { id, email, firstName, lastName, phonenumber, address, image } = userInfo;
                this.setState({
                    id, email, firstName, lastName, phonenumber, address, image
                });
            }
        }
    }

    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({ ...copyState });
    }

    handleSaveSettings = async () => {
        if (!this.state.firstName || !this.state.lastName) {
            toast.error("Vui lòng nhập đầy đủ Họ và Tên!");
            return;
        }

        let res = await postUpdatePatientService(this.state);
        if (res && res.errCode === 0) {
            toast.success("Cập nhật thông tin thành công!");
            this.setState({ password: '' });
            this.props.updateUserSuccess(this.state);
        } else {
            toast.error("Cập nhật thông tin thất bại!");
        }
    }

    render() {
        return (
            <div className="patient-profile-section">
                <h1 className="main-title">Thông tin Cá nhân & Bảo mật</h1>
                <p className="main-subtitle">
                    Quản lý các cài đặt liên quan đến tài khoản của bạn, bảo mật, và cách khôi phục dữ liệu khi cần thiết.
                </p>

                <div className="settings-grid">
                    <div className="info-card">
                        <div className="card-header">
                            <span className="card-title">Họ và Tên</span>
                        </div>
                        <div className="card-body form-group-row">
                            <input className="apple-inline-input" value={this.state.lastName || ''} onChange={(e) => this.handleOnChangeInput(e, 'lastName')} placeholder="Họ" />
                            <input className="apple-inline-input" value={this.state.firstName || ''} onChange={(e) => this.handleOnChangeInput(e, 'firstName')} placeholder="Tên" />
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="card-header">
                            <span className="card-title">Email & Số điện thoại</span>
                            <i className="fab fa-apple card-icon blue"></i>
                        </div>
                        <div className="card-body">
                            <p className="readonly-text">{this.state.email}</p>
                            <input className="apple-inline-input" value={this.state.phonenumber || ''} onChange={(e) => this.handleOnChangeInput(e, 'phonenumber')} placeholder="Số điện thoại" />
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="card-header">
                            <span className="card-title">Mật khẩu</span>
                            <i className="fas fa-shield-alt card-icon blue"></i>
                        </div>
                        <div className="card-body">
                            <input type="password"
                                className="apple-inline-input"
                                placeholder="Đổi mật khẩu mới..."
                                value={this.state.password || ''}
                                onChange={(e) => this.handleOnChangeInput(e, 'password')}
                                autoComplete="new-password"
                            />
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="card-header">
                            <span className="card-title">Địa chỉ liên hệ</span>
                            <i className="fas fa-map-marker-alt card-icon blue"></i>
                        </div>
                        <div className="card-body">
                            <input className="apple-inline-input"
                                value={this.state.address || ''}
                                onChange={(e) => this.handleOnChangeInput(e, 'address')}
                                placeholder="Nhập địa chỉ nhà..."
                            />
                        </div>
                    </div>
                </div>

                <div className="apple-footer-action">
                    <button className="apple-save-btn" onClick={() => this.handleSaveSettings()}>
                        Lưu Thay Đổi
                    </button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    language: state.app.language,
    userInfo: state.user.userInfo,
});

const mapDispatchToProps = dispatch => ({
    updateUserSuccess: (userInfo) => dispatch(action.updateUserSuccess(userInfo))
});

export default connect(mapStateToProps, mapDispatchToProps)(PatientProfile);
