import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader'
import { withRouter } from '../../../components/Navigator';

import './PatientSettings.scss'
import { postUpdatePatientService } from '../../../services/userService'; // Import hàm update của ông
import { toast } from "react-toastify";
import * as action from '../../../store/actions'
import './PatientSettings.scss'
import { first } from 'lodash';
class PatientSettings extends Component {
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
            console.log(">>> check userInfo: ", userInfo, this.state, this.props.userInfo, ">>> check userInfo!");
        }

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
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
        this.setState({
            ...copyState
        })
    }

    handleSaveSettings = async () => {
        // Check sơ bộ dữ liệu
        if (!this.state.firstName || !this.state.lastName) {
            toast.error("Full name is required!");
            return;
        }

        let res = await postUpdatePatientService(this.state);
        if (res && res.errCode === 0) {
            toast.success("Update the patient's information successfully!");
            this.setState({
                password: ''
            })

            this.props.updateUserSuccess(this.state);
        } else {
            toast.error("Update the patient's information fail!");
        }
    }

    render() {
        let {
            email, firstName, lastName,
            phonenumber, address, password
        } = this.state;
        console.log('State: ', this.state);
        return (
            <div className="apple-account-page">
                {/* Header phụ của Apple */}
                <div className="apple-sub-header">
                    <div className="sub-header-content">
                        <span className="brand-name">Booking</span>
                        <button className="btn-signout" onClick={this.props.processLogout}>Sign Out</button>
                    </div>
                </div>
                {/* <HomeHeader /> */}
                <div className="apple-settings-container">
                    <div className="container-flex">
                        {/* SIDEBAR BÊN TRÁI */}
                        <aside className="apple-sidebar">
                            <div className="user-profile-summary">
                                <div className="avatar-circle">

                                    <img src={this.state.image || 'https://static.vecteezy.com/system/resources/previews/026/625/600/non_2x/person-icon-symbol-design-illustration-vector.jpg'} alt="avatar" />
                                </div>
                                <h2 className="user-name">{this.state.lastName} {this.state.firstName}</h2>
                                <p className="user-email">{this.state.email}</p>
                            </div>

                            <nav className="sidebar-nav">
                                <div className="nav-item">Personal Information</div>
                                <div className="nav-item active">Sign-In and Security</div>
                                <div className="nav-item">Payment & Shipping</div>
                                <div className="nav-item">Subscriptions</div>
                                <div className="nav-item">Family Sharing</div>
                                <div className="nav-item">Devices</div>
                                <div className="nav-item">Privacy</div>
                            </nav>
                        </aside>

                        {/* CONTENT BÊN PHẢI */}
                        <main className="apple-main-content">
                            <h1 className="main-title">Sign-In and Security</h1>
                            <p className="main-subtitle">
                                Manage settings related to signing in to your account, account security, as well as how to recover your data when you're having trouble signing in.
                            </p>

                            <div className="settings-grid">
                                {/* Ô Email & Phone */}
                                <div className="info-card">
                                    <div className="card-header">
                                        <span className="card-title">Email & Phone Numbers</span>
                                        <i className="fab fa-apple card-icon blue"></i>
                                    </div>
                                    <div className="card-body">
                                        <p>{this.state.email}</p>
                                        <p>{this.state.phonenumber}</p>
                                    </div>
                                </div>

                                {/* Ô Password */}
                                <div className="info-card pointer" onClick={() => this.openEditPassword()}>
                                    <div className="card-header">
                                        <span className="card-title">Password</span>
                                        <i className="fas fa-ellipsis-h card-icon gray"></i>
                                    </div>
                                    <div className="card-body">
                                        <p>Last updated October 8, 2023</p>
                                        <input
                                            type="password"
                                            className="apple-inline-input"
                                            placeholder="Change password..."
                                            value={this.state.password || ''}
                                            onChange={(e) => this.handleOnChangeInput(e, 'password')}
                                        />
                                    </div>
                                </div>

                                {/* Ô Account Security */}
                                <div className="info-card">
                                    <div className="card-header">
                                        <span className="card-title">Account Security</span>
                                        <i className="fas fa-shield-alt card-icon blue"></i>
                                    </div>
                                    <div className="card-body">
                                        <p>Two-factor authentication</p>
                                        <p>2 trusted phone numbers</p>
                                    </div>
                                </div>

                                {/* Các ô khác Duy có thể hardcode tương tự */}
                                <div className="info-card">
                                    <div className="card-header">
                                        <span className="card-title">Address</span>
                                        <i className="fas fa-map-marker-alt card-icon blue"></i>
                                    </div>
                                    <div className="card-body">
                                        <input
                                            className="apple-inline-input"
                                            value={this.state.address || ''}
                                            onChange={(e) => this.handleOnChangeInput(e, 'address')}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="apple-footer-action">
                                <button className="apple-save-btn" onClick={() => this.handleSaveSettings()}>
                                    Save Changes
                                </button>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        userInfo: state.user.userInfo,

    };
};

const mapDispatchToProps = dispatch => {
    return {

        updateUserSuccess: (userInfo) => dispatch(action.updateUserSuccess(userInfo))
    };
};

// import { withRouter } from 'react-router'; // hoặc 'react-router-dom'
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PatientSettings));
