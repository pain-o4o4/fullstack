import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import { createRegister } from '../../services/userService';
import './Login.scss'; // Dùng chung scss cho đồng bộ
import { toast } from 'react-toastify';
import gender_icon from '../../assets/images/gender_icon.svg';
class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
            phonenumber: '',
            gender: 'M',
            errMessage: ''
        }
    }

    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({ ...copyState });
    }

    handleRegister = async () => {
        this.setState({ errMessage: '' });
        try {
            let res = await createRegister({
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phonenumber: this.state.phonenumber,
                gender: this.state.gender,
                roleId: ':))',
            });

            if (res && res.errCode !== 0) {
                toast.error(res.errMessage);
                this.setState({ errMessage: res.errMessage });
            } else {
                toast.success("Register succeed! Please login with your account.");
                this.props.navigate('/login');
            }
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        console.log('>>> check state:', this.state);
        return (
            <div className="auth-split-container">
                <div className="welcome-left">
                    <div className="welcome-text">
                        <h1>Join us!</h1>
                        <p>Create an account to manage your health appointments easily.</p>
                    </div>
                </div>
                <div className="form-right-signup">
                    <div className="container">
                        <div className="header">
                            <div className="text">Sign Up</div>
                            <div className="underline"></div>
                        </div>
                        <div className="inputs">
                            {/* First Name - Last Name */}
                            <div className="input-group-row" style={{ display: 'flex', gap: '10px' }}>
                                <div className="input" style={{ width: '50%' }}>
                                    <input placeholder="First Name"
                                        value={this.state.firstName}
                                        onChange={(event) => this.handleOnChangeInput(event, 'firstName')}
                                    />
                                </div>
                                <div className="input" style={{ width: '50%' }}>
                                    <input placeholder="Last Name"
                                        value={this.state.lastName}
                                        onChange={(event) => this.handleOnChangeInput(event, 'lastName')}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="input">
                                <input type="email" placeholder="Email"
                                    value={this.state.email}
                                    onChange={(event) => this.handleOnChangeInput(event, 'email')} />
                            </div>

                            {/* Password */}
                            <div className="input">
                                <input type="password" placeholder="Password"
                                    value={this.state.password}
                                    onChange={(event) => this.handleOnChangeInput(event, 'password')} />
                            </div>

                            {/* Phone Number */}
                            <div className="input">
                                <input placeholder="Phone Number"
                                    value={this.state.phonenumber}
                                    onChange={(event) => this.handleOnChangeInput(event, 'phonenumber')} />
                            </div>

                            {/* Address */}
                            <div className="input">
                                <input placeholder="Address"
                                    value={this.state.address}
                                    onChange={(event) => this.handleOnChangeInput(event, 'address')} />
                            </div>

                            {/* Gender */}
                            <div className="input-gender">
                                <img src={gender_icon} alt="Gender" />
                                <select
                                    value={this.state.gender}
                                    onChange={(event) => this.handleOnChangeInput(event, 'gender')}
                                    className="select-gender"
                                >
                                    <option value="" disabled>Select Gender</option>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                    <option value="O">Other</option>
                                </select>
                            </div>

                            <div className="error-message">{this.state.errMessage}</div>

                            <div className="submit-container">
                                <button className="submit" onClick={this.handleRegister}>Register</button>
                                <button className="submit gray" onClick={() => this.props.navigate('/login')}>Back to Login</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    navigate: (path) => dispatch(push(path)),
});

export default connect(null, mapDispatchToProps)(Register);