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
import { toast } from 'react-toastify';
import { withRouter } from '../../../components/Navigator';
import './ManageClinic.scss';

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
        let { language } = this.props;
        try {
            let res;
            if (this.state.action === 'CREATE') {
                res = await postCreateNewClinicService(data);
            } else {
                res = await editClinicService(data);
            }

            if (res && res.errCode === 0) {
                let successMsg = this.state.action === 'CREATE'
                    ? (language === 'vi' ? "Thêm cơ sở y tế thành công!" : "Clinic added successfully!")
                    : (language === 'vi' ? "Cập nhật thông tin thành công!" : "Clinic updated successfully!");
                toast.success(successMsg);
                this.setState({
                    isModalOpen: false
                });
                await this.getAllClinics();
            } else {
                toast.error(res?.errMessage || (language === 'vi' ? "Lỗi hệ thống!" : "System error!"));
            }
        } catch (e) {
            console.log(e);
            let errorMsg = language === 'vi' ? "Lỗi kết nối Server!" : "Server connection error!";
            toast.error(errorMsg);
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
        let { language } = this.props;
        let confirmMsg = language === 'vi'
            ? `Bạn có chắc chắn muốn xóa hệ thống y tế: ${clinic.name}?`
            : `Are you sure you want to delete clinic: ${clinic.name}?`;

        if (window.confirm(confirmMsg)) {
            try {
                let res = await deleteClinicService(clinic.id);
                if (res && res.errCode === 0) {
                    toast.success(language === 'vi' ? "Xóa hệ thống y tế thành công!" : "Clinic deleted successfully!");
                    await this.getAllClinics();
                } else {
                    toast.error(res?.errMessage || (language === 'vi' ? "Xóa thất bại!" : "Delete failed!"));
                }
            } catch (e) {
                console.log(e);
                toast.error(language === 'vi' ? "Lỗi từ server!" : "Server error!");
            }
        }
    }

    render() {
        let { arrClinics, isModalOpen, action, clinicEdit } = this.state;
        let { language } = this.props;
        return (
            <div className="clinic-management-container">
                {isModalOpen && (
                    <ModalManageClinic
                        isOpen={isModalOpen}
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
                        <i className="fas fa-plus"></i>
                    </button>
                </div>

                <div className="table-wrapper">
                    <table className="apple-table">
                        <thead>
                            <tr>
                                <th><FormattedMessage id="manage-clinic.table-name" /></th>
                                <th><FormattedMessage id="manage-clinic.table-address" /></th>
                                <th className="text-right"><FormattedMessage id="manage-clinic.table-actions" /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {arrClinics && arrClinics.length > 0 ? (
                                arrClinics.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <div className="clinic-cell-info">
                                                    <div className="clinic-img-wrapper">
                                                        <img src={item.image || 'https://www.freeiconspng.com/thumbs/hospital-icon/hospital-icon-3.png'} alt="clinic" />
                                                    </div>
                                                    <div className="clinic-text">
                                                        <span className="clinic-name">{item.name}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="clinic-text">
                                                    <span className="clinic-address">{item.address}</span>
                                                </div>
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
                                    <td colSpan="3" className="text-center py-5">
                                        <div style={{ color: '#86868b', fontSize: '15px' }}>
                                            <i className="fas fa-folder-open" style={{ display: 'block', fontSize: '24px', marginBottom: '10px' }}></i>
                                            <FormattedMessage id="manage-clinic.no-data" />
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

export default withRouter(connect(mapStateToProps, null)(ManageClinic));