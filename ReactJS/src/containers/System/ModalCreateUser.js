import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import './ModalCreateUser.scss';

class ModalCreateUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phonenumber: '',
            address: ''
        }
    }

    componentDidMount() {
    }

    toggle = () => {
        this.props.toggleFromParent();
    }

    handleOnChangeInput = (event, id) => {
        let value = event.target.value;
        this.setState({
            [id]: value
        });
    }

    checkValidateInput = () => {
        let isValid = true;
        let arrInput = ['email', 'password', 'firstName', 'lastName', 'phonenumber', 'address'];
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                isValid = false;
                alert('Missing parameter: ' + arrInput[i]);
                break;
            }
        }
        return isValid;
    }

    handleAddNewUser = () => {
        let isValid = this.checkValidateInput();
        if (isValid === true) {
            this.props.createNewuser(this.state);
        }
    }

    render() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                toggle={() => { this.toggle() }}
                className={'modal-user-container'}
                size="lg"
                centered
            >
                <ModalHeader toggle={() => { this.toggle() }}>
                    <FormattedMessage id="system.user-manage.add" defaultMessage="Tạo người dùng mới" />
                </ModalHeader>
                <ModalBody>
                    <div className="user-redux-body">
                        <div className="container">
                            <div className="row">
                                <div className="col-6 input-container">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        onChange={(event) => { this.handleOnChangeInput(event, "email") }}
                                        value={this.state.email}
                                        placeholder="email@example.com"
                                    />
                                </div>
                                <div className="col-6 input-container">
                                    <label><FormattedMessage id="system.user-manage.password" defaultMessage="Mật khẩu" /></label>
                                    <input
                                        type="password"
                                        onChange={(event) => { this.handleOnChangeInput(event, "password") }}
                                        value={this.state.password}
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="col-6 input-container">
                                    <label><FormattedMessage id="system.user-manage.first-name" defaultMessage="Tên" /></label>
                                    <input
                                        type="text"
                                        onChange={(event) => { this.handleOnChangeInput(event, "firstName") }}
                                        value={this.state.firstName}
                                    />
                                </div>
                                <div className="col-6 input-container">
                                    <label><FormattedMessage id="system.user-manage.last-name" defaultMessage="Họ" /></label>
                                    <input
                                        type="text"
                                        onChange={(event) => { this.handleOnChangeInput(event, "lastName") }}
                                        value={this.state.lastName}
                                    />
                                </div>
                                <div className="col-6 input-container">
                                    <label><FormattedMessage id="system.user-manage.phone-number" defaultMessage="Số điện thoại" /></label>
                                    <input
                                        type="text"
                                        onChange={(event) => { this.handleOnChangeInput(event, "phonenumber") }}
                                        value={this.state.phonenumber}
                                    />
                                </div>
                                <div className="col-6 input-container">
                                    <label><FormattedMessage id="system.user-manage.address" defaultMessage="Địa chỉ" /></label>
                                    <input
                                        type="text"
                                        onChange={(event) => { this.handleOnChangeInput(event, "address") }}
                                        value={this.state.address}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button
                        className="btn-save-user"
                        onClick={() => { this.handleAddNewUser() }}>
                        <FormattedMessage id="system.user-manage.add-btn" defaultMessage="Lưu thay đổi" />
                    </button>
                    <button
                        className="btn-cancel-user"
                        onClick={() => { this.toggle() }}>
                        <FormattedMessage id="system.user-manage.cancel-btn" defaultMessage="Hủy" />
                    </button>
                </ModalFooter>
            </Modal>
        )
    }
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalCreateUser);
