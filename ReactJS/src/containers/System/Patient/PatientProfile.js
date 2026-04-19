import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
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
        let { language } = this.props;
        if (!this.state.firstName || !this.state.lastName) {
            toast.error(language === 'vi' ? "Vui lòng nhập đầy đủ Họ và Tên!" : "Please enter both First and Last Name!");
            return;
        }

        let res = await postUpdatePatientService(this.state);
        if (res && res.errCode === 0) {
            toast.success(language === 'vi' ? "Cập nhật thông tin thành công!" : "Information updated successfully!");
            this.setState({ password: '' });
            this.props.updateUserSuccess(this.state);
        } else {
            toast.error(language === 'vi' ? "Cập nhật thông tin thất bại!" : "Failed to update information!");
        }
    }

    render() {
        let { language } = this.props;
        return (
            <div className="patient-profile-section">
                <h1 className="main-title">
                    <FormattedMessage id="patient-profile.title" />
                </h1>
                <p className="main-subtitle">
                    <FormattedMessage id="patient-profile.subtitle" />
                </p>

                <div className="settings-grid">
                    <div className="info-card">
                        <div className="card-header">
                            <span className="card-title"><FormattedMessage id="patient-profile.name-label" /></span>
                            <i class="fas fa-user" ></i>
                        </div>
                        <div className="card-body form-group-row">
                            <input className="apple-inline-input" value={this.state.lastName || ''} onChange={(e) => this.handleOnChangeInput(e, 'lastName')} placeholder={language === 'vi' ? "Họ" : "Last name"} />
                            <input className="apple-inline-input" value={this.state.firstName || ''} onChange={(e) => this.handleOnChangeInput(e, 'firstName')} placeholder={language === 'vi' ? "Tên" : "First name"} />
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="card-header">
                            <span className="card-title"><FormattedMessage id="patient-profile.contact-label" /></span>
                            <i className="fas fa-envelope"></i>
                        </div>
                        <div className="card-body">
                            <p className="readonly-text">{this.state.email}</p>
                            <input className="apple-inline-input" value={this.state.phonenumber || ''} onChange={(e) => this.handleOnChangeInput(e, 'phonenumber')} placeholder={language === 'vi' ? "Số điện thoại" : "Phone number"} />
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="card-header">
                            <span className="card-title"><FormattedMessage id="patient-profile.password-label" /></span>
                            <i className="fas fa-shield-alt card-icon blue"></i>
                        </div>
                        <div className="card-body">
                            <input type="password"
                                className="apple-inline-input"
                                placeholder={language === 'vi' ? "Đổi mật khẩu mới..." : "Change new password..."}
                                value={this.state.password || ''}
                                onChange={(e) => this.handleOnChangeInput(e, 'password')}
                                autoComplete="new-password"
                            />
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="card-header">
                            <span className="card-title"><FormattedMessage id="patient-profile.address-label" /></span>
                            <i className="fas fa-map-marker-alt card-icon blue"></i>
                        </div>
                        <div className="card-body">
                            <input className="apple-inline-input"
                                value={this.state.address || ''}
                                onChange={(e) => this.handleOnChangeInput(e, 'address')}
                                placeholder={language === 'vi' ? "Nhập địa chỉ nhà..." : "Enter your home address..."}
                            />
                        </div>
                    </div>
                </div>

                <div className="apple-footer-action">
                    <button className="apple-save-btn" onClick={() => this.handleSaveSettings()}>
                        <FormattedMessage id="patient-profile.btn-save" />
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
