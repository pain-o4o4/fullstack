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
            phonenumber: '',
            lastName: '',
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
        let arrInput = ['email', 'password', 'phonenumber', 'firstName', 'lastName', 'address'];
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
            this.props.createNewUser(this.state);
        }
    }
    render() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                toggle={() => this.toggle()}
                size="lg"
                centered
                backdrop="static"
                className="modal-add-new-user"
                fade={true}
            >
                <ModalHeader toggle={() => this.toggle()}>
                    <FormattedMessage id="manage-user.modal-create" />
                </ModalHeader>

                <ModalBody>
                    <div className="modal-user-body">
                        <div className="input-container">
                            <label><FormattedMessage id="manage-user.first-name" /></label>
                            <input
                                type="text"
                                onChange={(e) => this.handleOnChangeInput(e, "firstName")}
                                value={this.state.firstName}
                                placeholder="Apple"
                            />
                        </div>
                        <div className="input-container">
                            <label><FormattedMessage id="manage-user.last-name" /></label>
                            <input
                                type="text"
                                onChange={(e) => this.handleOnChangeInput(e, "lastName")}
                                value={this.state.lastName}
                                placeholder="Steve"
                            />
                        </div>
                        <div className="input-container">
                            <label><FormattedMessage id="manage-user.email" /></label>
                            <input
                                type="email"
                                onChange={(e) => this.handleOnChangeInput(e, "email")}
                                value={this.state.email}
                                placeholder="name@apple.com"
                            />
                        </div>
                        <div className="input-container">
                            <label><FormattedMessage id="manage-user.password" /></label>
                            <input
                                type="password"
                                onChange={(e) => this.handleOnChangeInput(e, "password")}
                                value={this.state.password}
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="input-container">
                            <label><FormattedMessage id="manage-user.phone-number" /></label>
                            <input
                                type="tel"
                                onChange={(e) => this.handleOnChangeInput(e, "phonenumber")}
                                value={this.state.phonenumber}
                                placeholder="+84 ..."
                            />
                        </div>
                        <div className="input-container">
                            <label><FormattedMessage id="manage-user.address" /></label>
                            <input
                                type="text"
                                onChange={(e) => this.handleOnChangeInput(e, "address")}
                                value={this.state.address}
                                placeholder="1 Infinite Loop, Cupertino..."
                            />
                        </div>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button className="btn-cancel" onClick={() => this.toggle()}>
                        <FormattedMessage id="manage-user.btn-cancel" />
                    </Button>
                    <Button className="btn-primary" onClick={() => this.handleAddNewUser()}>
                        <FormattedMessage id="manage-user.btn-save" />
                    </Button>
                </ModalFooter>
            </Modal>
        )
    }
}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalCreateUser);
