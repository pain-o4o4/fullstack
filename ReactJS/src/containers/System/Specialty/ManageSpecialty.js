import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import {
    getAllSpecialtyService,
    postCreateNewSpecialtyService,
    deleteSpecialtyService,
    editSpecialtyService
} from '../../../services/userService';
import ModalManageSpecialty from '../manageSystemModal/ModalManageSpecialty';
import './ManageSpecialty.scss';
import { toast } from 'react-toastify';
import { withRouter } from '../../../components/Navigator';

class ManageSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrSpecialties: [],
            isModalOpen: false,
            action: 'CREATE', 
            specialtyEdit: {}
        };
    }

    async componentDidMount() {
        await this.getAllSpecialties();
    }

    getAllSpecialties = async () => {
        let response = await getAllSpecialtyService();
        if (response && response.errCode === 0) {
            this.setState({
                arrSpecialties: response.data
            });
        }
    }

    handleAddNewSpecialty = () => {
        this.setState({
            isModalOpen: true,
            action: 'CREATE',
            specialtyEdit: {}
        });
    }

    toggleModal = () => {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    saveSpecialty = async (data) => {
        try {
            let res;
            if (this.state.action === 'CREATE') {
                res = await postCreateNewSpecialtyService(data);
            } else {
                res = await editSpecialtyService(data);
            }

            if (res && res.errCode === 0) {
                toast.success(this.state.action === 'CREATE' ? "Thêm chuyên khoa thành công!" : "Cập nhật chuyên khoa thành công!");
                this.setState({
                    isModalOpen: false
                });
                await this.getAllSpecialties();
            } else {
                toast.error(res?.errMessage || "Lỗi hệ thống!");
            }
        } catch (e) {
            console.log(e);
            toast.error("Lỗi kêt nối Server!");
        }
    }

    handleEditSpecialty = (specialty) => {
        this.setState({
            isModalOpen: true,
            action: 'EDIT',
            specialtyEdit: specialty
        });
    }

    handleDeleteSpecialty = async (specialty) => {
        if(window.confirm(`Bạn có chắc chắn muốn xóa chuyên khoa: ${specialty.name}?`)) {
            try {
                let res = await deleteSpecialtyService(specialty.id);
                if (res && res.errCode === 0) {
                    toast.success("Xóa chuyên khoa thành công!");
                    await this.getAllSpecialties();
                } else {
                    toast.error(res?.errMessage || "Xóa thất bại!");
                }
            } catch (e) {
                console.log(e);
                toast.error("Lỗi từ server!");
            }
        }
    }

    render() {
        let arrSpecialties = this.state.arrSpecialties;
        return (
            <div className="users-container">
                {this.state.isModalOpen && (
                    <ModalManageSpecialty
                        isOpen={this.state.isModalOpen}
                        toggleFromParent={this.toggleModal}
                        saveSpecialty={this.saveSpecialty}
                        action={this.state.action}
                        currentSpecialty={this.state.specialtyEdit}
                    />
                )}
                
                <div className="header-section">
                    <h2 className="title">
                        <FormattedMessage id="manage-specialty.title" defaultMessage="Quản lý Chuyên khoa" />
                    </h2>
                    <button className="btn-add-new" onClick={() => this.handleAddNewSpecialty()}>
                        <i className="fas fa-plus"></i> Thêm chuyên khoa
                    </button>
                </div>

                <div className="table-wrapper">
                    <div className="table-card">
                        <table className="apple-table">
                            <thead>
                                <tr>
                                    <th>Chuyên khoa</th>
                                    <th>Mô tả tóm tắt</th>
                                    <th className="text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {arrSpecialties && arrSpecialties.length > 0 ? (
                                    arrSpecialties.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <div className="user-info-cell">
                                                        <div className="avatar-mini rounded">
                                                            <img src={item.image || 'https://static.vecteezy.com/system/resources/previews/026/625/600/non_2x/person-icon-symbol-design-illustration-vector.jpg'} alt="specialty" />
                                                        </div>
                                                        <div className="user-name-block">
                                                            <span className="name">{item.name}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="role-badge green">Trạng thái Tốt</span>
                                                </td>
                                                <td className="text-right">
                                                    <div className="actions-cell">
                                                        <button className="btn-action btn-edit" onClick={() => this.handleEditSpecialty(item)} title="Chỉnh sửa">
                                                            <i className="fas fa-pen"></i>
                                                        </button>
                                                        <button className="btn-action btn-delete" onClick={() => this.handleDeleteSpecialty(item)} title="Xóa">
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="text-center py-4">Chưa có dữ liệu chuyên khoa!</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(connect(null, null)(ManageSpecialty));
