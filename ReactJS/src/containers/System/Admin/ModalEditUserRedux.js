import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { connect } from 'react-redux';
import _ from 'lodash';

class ModalEditUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            email: '',
            firstName: '',
            lastName: '',
            address: '',
        }
    }

    // Quan trọng: Khi Modal mở lên, đổ dữ liệu từ props vào state của Modal
    componentDidUpdate(prevProps) {
        if (prevProps.currentUser !== this.props.currentUser) {
            let user = this.props.currentUser;
            this.setState({
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                address: user.address,
            })
        }
    }

    handleSave = () => {
        // Gọi hàm lưu ở TableManager truyền xuống
        this.props.doEditUser(this.state);
    }

    render() {
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} size="lg" centered>
                <ModalHeader toggle={this.props.toggle}>Edit User</ModalHeader>
                <ModalBody>
                    <div className="container">
                        <div className="row">
                            <div className="col-6 form-group">
                                <label>Email</label>
                                <input className="form-control" value={this.state.email} disabled />
                            </div>
                            <div className="col-6 form-group">
                                <label>First Name</label>
                                <input className="form-control" value={this.state.firstName}
                                    onChange={(e) => this.setState({ firstName: e.target.value })} />
                            </div>
                            {/* Thêm các trường khác tương tự... */}
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.handleSave}>Save changes</Button>
                    <Button color="secondary" onClick={this.props.toggle}>Close</Button>
                </ModalFooter>
            </Modal>
        )
    }
}
export default ModalEditUser;