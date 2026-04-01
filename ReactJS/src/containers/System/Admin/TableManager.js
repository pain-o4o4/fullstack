import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
// import './TableManager.scss';
import * as action from '../../../store/actions';
class TableManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userRedux: [],
            isOpenModalEdit: false

        }
    }
    componentDidMount() {
        this.props.fetchUserRedux();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listUsers !== this.props.listUsers) {
            this.setState({
                userRedux: this.props.listUsers // Kiểm tra kỹ tên biến userRedux này nhé
            })
        }
    }
    handleDeleteUser = (user) => {
        this.props.deleteUserRedux(user.id);
    }
    handleEditUser = (user) => {
        // this.props.editUserRedux(user);
        this.props.handleEditUserFromParent(user);

    }
    render() {
        console.log('>>> check props listUsers: ', this.props.listUsers);
        let arrUsers = this.state.userRedux;
        return (
            <table id="customers" className="table-manage">
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
                    {/* Dùng trực tiếp biến arrUsers đã khai báo ở trên */}
                    {arrUsers && arrUsers.length > 0 ? (
                        arrUsers.map((item, index) => {
                            return (
                                <tr key={index} className="row-user">
                                    <td>{item.email}</td>
                                    <td>{item.firstName}</td>
                                    <td>{item.lastName}</td>
                                    <td>{item.address}</td>
                                    <td className="actions-cell">
                                        <button className="btn-edit" title="Edit"
                                            onClick={() => { this.handleEditUser(item) }}>
                                            <i className="fas fa-pencil-alt"></i>
                                        </button>
                                        <button className="btn-delete" title="Delete"
                                            onClick={() => { this.handleDeleteUser(item) }}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            {/* Nhớ thêm style textAlign center để chữ nằm giữa bảng kính mờ cho đẹp nhé */}
                            <td colSpan="5" style={{ textAlign: 'center' }}>No data found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

}

const mapStateToProps = state => {
    return {
        listUsers: state.admin.users,
        editUser: state.admin.editUser
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchUserRedux: () => dispatch(action.fetchAllUserStart()),
        deleteUserRedux: (id) => dispatch(action.deleteUser(id)),
        editUserRedux: (user) => dispatch(action.editUser(user))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManager);
