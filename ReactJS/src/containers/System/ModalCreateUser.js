




import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
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
        }, () => {
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
            console.log('This is PROPS: ', this.props)
            this.props.createNewUser(this.state);

            // this.setState({
            //     email: '', password: '', phonenumber: '', firstName: '', lastName: '', address: ''
            // });
            console.log('Add Success: ', this.state);

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
                    Create A New User
                </ModalHeader>

                <ModalBody>
                    <div className="modal-user-body">
                        <div className="input-container">
                            <label>Email</label>
                            <input
                                type="email"
                                onChange={(e) => this.handleOnChangeInput(e, "email")}
                                value={this.state.email}
                                placeholder="example@domain.com"
                            />
                        </div>
                        <div className="input-container">
                            <label>Password</label>
                            <input
                                type="password"
                                onChange={(e) => this.handleOnChangeInput(e, "password")}
                                value={this.state.password}
                            />
                        </div>

                        {/*<div className="input-container">
                            <label>Gender</label>
                            <input
                                type="tel"    // 
                                onChange={(e) => this.handleOnChangeInput(e, "gender")}
                                value={this.state.gender}
                            />
                        </div> */}
                        <div className="input-container">
                            <label>First Name</label>
                            <input
                                type="text"
                                onChange={(e) => this.handleOnChangeInput(e, "firstName")}
                                value={this.state.firstName}
                            />
                        </div>
                        <div className="input-container">
                            <label>Last Name</label>
                            <input
                                type="text"
                                onChange={(e) => this.handleOnChangeInput(e, "lastName")}
                                value={this.state.lastName}
                            />
                        </div>
                        <div className="input-container">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                onChange={(e) => this.handleOnChangeInput(e, "phonenumber")}
                                value={this.state.phonenumber}
                                placeholder="+84 ..."
                            />
                        </div>
                        <div className="input-container max-width-input">
                            <label>Address</label>
                            <input
                                type="text"
                                onChange={(e) => this.handleOnChangeInput(e, "address")}
                                value={this.state.address}
                                placeholder="123 Example Street..."
                            />
                        </div>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button color="secondary" className="px-4" onClick={() => this.toggle()}>
                        Close
                    </Button>
                    <Button color="primary" className="px-4" onClick={() => this.handleAddNewUser()}>
                        Add New
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


