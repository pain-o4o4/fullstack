import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss';
import { getAllUsers, createNewUsersService, deleteUserService, editUserService } from '../../services/userService';
import addUser from '../../assets/images/addUser.png';
import deleteUser from '../../assets/images/deleteUser.png';
import editUser from '../../assets/images/editUser.png';
import closeXwhite from '../../assets/images/close-x-white.png';
// import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';close-x-white.png
import ModalCreateUser from "./ModalCreateUser"
import ModalEditUser from "./ModalEditUser"
class UserManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],// Bước 1: Khởi tạo mảng rỗng,
            editUser: {},
            isOpenModalCreate: false,
            isOpenModalEdit: false
        }
    }

    async componentDidMount() {
        // let response = await getAllUsers('ALL');
        // if (response && response.errCode === 0) {
        //     // Bước 2: Cập nhật state khi có dữ liệu
        //     console.log('Get all users from Node.js: ', response);
        //     this.setState({
        //         arrUsers: response.users
        //     });
        // }
        await this.getAllUsersFromReact()
    }
    getAllUsersFromReact = async () => {
        let response = await getAllUsers('ALL');
        if (response && response.errCode === 0) {
            // Bước 2: Cập nhật state khi có dữ liệu
            console.log('Get all users from Node.js: ', response);
            this.setState({
                arrUsers: response.users
            });
        }
    }
    toggleUserCreateModal = () => {
        this.setState({
            isOpenModalCreate: !this.state.isOpenModalCreate,
        })
    }
    toggleUserEditModal = () => {
        this.setState({
            isOpenModalEdit: !this.state.isOpenModalEdit,
        })
    }

    // handleAddNewUser = async () => { // Chuyển thành arrow function để không lỗi 'this'
    //     try {
    //         // let response = await createNewUserService(data);
    //         let response = "await createNewUserService(data);"
    //         if (response && response.errCode !== 0) {
    //             alert(response.errMessage);
    //         } else {
    //             // Thành công: Load lại bảng và đóng modal
    //             await this.getAllUsersFromReact();
    //             this.setState({
    //                 isOpenModalCreate: false
    //             })
    //         }
    //     } catch (e) {
    //         console.log(e);
    //     }
    // }
    createNewUser = async (data) => {
        try {
            let response = await createNewUsersService(data)
            if (response && response.errCode === 0) {
                // alert(response.errMessage)
                await this.getAllUsersFromReact()
                this.toggleUserCreateModal()
            } else {
                alert(response.errMessage)


            }
        } catch (error) {
            console.log(error)
        }
        // console.log("check data: ", data)
    }
    handleAddNewUser = () => {

        this.setState({
            isOpenModalCreate: true
        })
    }
    handleDeleteUsers = async (user) => {
        try {
            let response = await deleteUserService(user.id)
            if (response && response.errCode === 0) {
                await this.getAllUsersFromReact()

                console.log(response)

            }
            else
                alert(response.errMessage)
        } catch (error) {
            console.log(error)

        }

    }
    handleEditUser = async (user) => {
        this.setState({
            isOpenModalEdit: true,
            editUser: user
        })
    }
    handleSaveEditUser = async (user) => {
        console.log("handleDoEditUser: ", user)
        try {
            let response = await editUserService(user)
            if (response && response.errCode === 0) {
                this.setState({
                    isOpenModalEdit: false
                })
                await this.getAllUsersFromReact()
                console.log("handleSaveEditUser ", response)

            }
            else {
                alert(response.errMessage)

            }
        } catch (error) {
            console.log(error)
        }

    }
    render() {
        return (
            <div className="users-container">
                <ModalCreateUser
                    isOpen={this.state.isOpenModalCreate}
                    toggleFromParent={this.toggleUserCreateModal}
                    createNewUser={this.createNewUser} // Truyền hàm lưu xuống cho Con

                />
                {
                    this.state.isOpenModalEdit && <ModalEditUser
                        isOpen={this.state.isOpenModalEdit}
                        toggleFromParent={this.toggleUserEditModal}
                        editUser={this.state.editUser} // Truyền hàm lưu xuống cho Con
                        handleEditUser={this.handleSaveEditUser}

                    />
                }

                <div className="title text-center">
                    <h1 className="header-title">Manage User</h1>
                </div>
                <div className="mb-3">
                    <button
                        className="btn btn-primary px-3"
                        onClick={() => this.handleAddNewUser()}
                    >
                        <img className="addUser" src={addUser} alt="addUser" />
                    </button>
                </div>
                <table id="customers" className="table-manage-user">
                    <thead>
                        <tr>
                            <th className="th-email">Email</th>
                            <th className="th-firstname">First Name</th>
                            <th className="th-lastname">Last Name</th>
                            <th className="th-address">Address</th>
                            <th className="th-actions">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.arrUsers && this.state.arrUsers.length > 0 ? (
                            this.state.arrUsers.map((item, index) => {
                                return (
                                    <tr key={index} className="row-user">
                                        <td>{item.email}</td>
                                        <td>{item.firstName}</td>
                                        <td>{item.lastName}</td>
                                        <td>{item.address}</td>
                                        <td className="actions-cell">
                                            <button className="btn-edit" onClick={() => { this.handleEditUser(item) }} title="Edit">
                                                <i className="fas fa-pencil-alt"></i>
                                            </button>
                                            <button className="btn-delete" onClick={() => { this.handleDeleteUsers(item) }} title="Delete">
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">No data found</td>
                            </tr>
                        )}
                    </tbody>
                </table>

            </div>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
