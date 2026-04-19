import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import {
    getAllClinicService,
    postCreateNewClinicService,
    deleteClinicService,
    editClinicService
} from '../../../services/userService';
import ModalManageClinic from '../manageSystemModal/ModalManageClinic';
import '../Specialty/ManageSpecialty.scss'; // Share exact same Apple Table Theme
import { toast } from 'react-toastify';
import { withRouter } from '../../../components/Navigator';

class ManageClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrClinics: [],
            isModalOpen: false,
            action: 'CREATE', 
            clinicEdit: {}
        };
    }

    async componentDidMount() {
        await this.getAllClinics();
    }

    getAllClinics = async () => {
        let response = await getAllClinicService();
        if (response && response.errCode === 0) {
            this.setState({
                arrClinics: response.data
            });
        }
    }

    handleAddNewClinic = () => {
        this.setState({
            isModalOpen: true,
            action: 'CREATE',
            clinicEdit: {}
        });
    }

    toggleModal = () => {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    saveClinic = async (data) => {
        try {
            let res;
            if (this.state.action === 'CREATE') {
                res = await postCreateNewClinicService(data);
            } else {
                res = await editClinicService(data);
            }

            if (res && res.errCode === 0) {
                toast.success(this.state.action === 'CREATE' ? "Thêm cơ sở y tế thành công!" : "Cập nhật thông tin thành công!");
                this.setState({
                    isModalOpen: false
                });
                await this.getAllClinics();
            } else {
                toast.error(res?.errMessage || "Lỗi hệ thống!");
            }
        } catch (e) {
            console.log(e);
            toast.error("Lỗi kêt nối Server!");
        }
    }

    handleEditClinic = (clinic) => {
        this.setState({
            isModalOpen: true,
            action: 'EDIT',
            clinicEdit: clinic
        });
    }

    handleDeleteClinic = async (clinic) => {
        if(window.confirm(`Bạn có chắc chắn muốn xóa hệ thống y tế: ${clinic.name}?`)) {
            try {
                let res = await deleteClinicService(clinic.id);
                if (res && res.errCode === 0) {
                    toast.success("Xóa hệ thống y tế thành công!");
                    await this.getAllClinics();
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
        let arrClinics = this.state.arrClinics;
        return (
            <div className="users-container">
                {this.state.isModalOpen && (
                    <ModalManageClinic
                        isOpen={this.state.isModalOpen}
                        toggleFromParent={this.toggleModal}
                        saveClinic={this.saveClinic}
                        action={this.state.action}
                        currentClinic={this.state.clinicEdit}
                    />
                )}
                
                <div className="header-section">
                    <h2 className="title">
                        <FormattedMessage id="manage-clinic.title" defaultMessage="Quản lý Cơ Sở Y Tế" />
                    </h2>
                    <button className="btn-add-new" onClick={() => this.handleAddNewClinic()}>
                        <i className="fas fa-plus"></i> Thêm Cơ Sở Mới
                    </button>
                </div>

                <div className="table-wrapper">
                    <div className="table-card">
                        <table className="apple-table">
                            <thead>
                                <tr>
                                    <th>Cơ Sở Y Tế</th>
                                    <th>Khu Vực Phủ Giao Dịch</th>
                                    <th className="text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {arrClinics && arrClinics.length > 0 ? (
                                    arrClinics.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <div className="user-info-cell">
                                                        <div className="avatar-mini rounded">
                                                            <img src={item.image || 'https://www.freeiconspng.com/thumbs/hospital-icon/hospital-icon-3.png'} alt="clinic" />
                                                        </div>
                                                        <div className="user-name-block">
                                                            <span className="name">{item.name}</span>
                                                            <span className="email">{item.address}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="role-badge green">Đang Mở Cửa</span>
                                                </td>
                                                <td className="text-right">
                                                    <div className="actions-cell">
                                                        <button className="btn-action btn-edit" onClick={() => this.handleEditClinic(item)} title="Chỉnh sửa">
                                                            <i className="fas fa-pen"></i>
                                                        </button>
                                                        <button className="btn-action btn-delete" onClick={() => this.handleDeleteClinic(item)} title="Xóa">
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="text-center py-4">Chưa có dữ liệu cơ sở y tế!</td>
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

export default withRouter(connect(null, null)(ManageClinic));