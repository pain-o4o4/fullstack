import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createRegister } from '../../services/userService';
import './Login.scss'; // Dùng chung scss cho đồng bộ
import { toast } from 'react-toastify';
import Select from 'react-select';
import gender_icon from '../../assets/images/gender_icon.svg';
import * as action from "../../store/actions";
import { withRouter } from '../../components/Navigator';
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
    componentDidMount() {
        this.props.fetchGenderStart()
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
                toast.success("Register succeed!");
                // After successful registration, navigate to login
                this.props.navigate('/login');
            }
        } catch (e) {
            console.log(e);
        }
    }
    handleSelectGender = () => {
        let { genders, language } = this.props;
        let options = genders && genders.length > 0 ? genders.map(item => ({
            value: item.keyMap,
            label: language === 'vi' ? item.valueVi : item.valueEn
        })) : [];
        return options
    }
    render() {
        let { genders, language } = this.props;

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

                            <div style={{ display: 'flex', gap: '10px' }}>
                                {/* Phone Number */}
                                <div className="input"
                                    style={{ width: '50%' }}>
                                    <input placeholder="Phone Number"
                                        value={this.state.phonenumber}
                                        onChange={(event) => this.handleOnChangeInput(event, 'phonenumber')} />
                                </div>
                                {/* Gender */}
                                <div className="input-gender"
                                    style={{ width: '50%' }}>
                                    {/* <img src={gender_icon} alt="Gender" /> */}
                                    <Select
                                        className="react-select-container"
                                        classNamePrefix="select"
                                        options={this.handleSelectGender()}
                                        placeholder={language === 'vi' ? "Chọn giới tính" : "Select Gender"}
                                        onChange={(selected) => this.handleOnChangeInput({ target: { value: selected.value } }, 'gender')}
                                    />
                                </div>
                            </div>
                            {/* Address */}
                            <div className="input">
                                <input placeholder="Address"
                                    value={this.state.address}
                                    onChange={(event) => this.handleOnChangeInput(event, 'address')} />
                            </div>



                            <div className="error-message">{this.state.errMessage}</div>

                            <div className="submit-container">
                                <button className="submit" onClick={this.handleRegister}>Register</button>
                                <button
                                    className="submit gray"
                                    onClick={() => this.props.navigate('/login')}
                                >
                                    Back to Login
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders
    };
};
const mapDispatchToProps = dispatch => ({
    fetchGenderStart: () => dispatch(action.fetchGenderStart()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Register));