import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import {
    getAllClinicService,
    deleteClinicService,
    postCreateNewClinicService,
    editClinicService
} from '../../../services/userService';
import ModalManageClinic from '../manageSystemModal/ModalManageClinic';
import { withSocket } from '../../../hoc/withSocket';
import './ManageClinic.scss';
import { toast } from 'react-toastify';

class ManageClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrClinics: [],
            isModalOpen: false,
            action: 'CREATE',
            clinicEdit: {},

            currentPage: 1,
            pageSize: 7,
            searchTerm: '',
            selectedClinics: [], // Track selected IDs
            showBulkDeleteConfirm: false,
            clinicToForceDelete: null,
            isForceDelete: false
        };
    }

    async componentDidMount() {
        await this.getAllClinics();
        if (this.props.socket) {
            this.props.socket.on('system_data_changed', this.handleSystemDataChanged);
        }
    }

    componentWillUnmount() {
        if (this.props.socket) {
            this.props.socket.off('system_data_changed', this.handleSystemDataChanged);
        }
    }

    handleSystemDataChanged = (data) => {
        if (data && data.entity === 'CLINIC') {
            this.getAllClinics();
        }
    }

    getAllClinics = async () => {
        let response = await getAllClinicService();
        if (response && response.errCode === 0) {
            this.setState({
                arrClinics: response.data || []
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

    handleEditClinic = (clinic) => {
        this.setState({
            isModalOpen: true,
            action: 'EDIT',
            clinicEdit: clinic
        });
    }

    handleSaveClinic = async (data) => {
        try {
            let res;
            if (this.state.action === 'CREATE') {
                res = await postCreateNewClinicService(data);
            } else {
                res = await editClinicService(data);
            }

            if (res && res.errCode === 0) {
                toast.success(this.state.action === 'CREATE' ? 'Thêm cơ sở y tế thành công!' : 'Cập nhật cơ sở y tế thành công!');
                this.setState({ isModalOpen: false });
                await this.getAllClinics();
            } else {
                toast.error(res.errMessage || 'Error saving clinic');
            }
        } catch (error) {
            console.log(error);
            toast.error('Error saving clinic');
        }
    }

    handleSelectClinic = (id) => {
        let { selectedClinics } = this.state;
        if (selectedClinics.includes(id)) {
            this.setState({ selectedClinics: selectedClinics.filter(cid => cid !== id) });
        } else {
            this.setState({ selectedClinics: [...selectedClinics, id] });
        }
    }

    handleSelectAll = (displayClinics) => {
        let { selectedClinics } = this.state;
        let allIdsOnPage = displayClinics.map(c => c.id);
        let allSelected = allIdsOnPage.every(id => selectedClinics.includes(id));

        if (allSelected) {
            this.setState({ selectedClinics: selectedClinics.filter(id => !allIdsOnPage.includes(id)) });
        } else {
            this.setState({ selectedClinics: [...new Set([...selectedClinics, ...allIdsOnPage])] });
        }
    }

    handleBulkDelete = () => {
        if (this.state.selectedClinics.length > 0) {
            this.setState({ showBulkDeleteConfirm: true, clinicToForceDelete: null, isForceDelete: false });
        }
    }

    confirmBulkDelete = async (force = false) => {
        let { selectedClinics } = this.state;
        let errors = [];
        let hasWarning = false;

        for (let id of selectedClinics) {
            let res = await deleteClinicService(id, force);
            if (res && res.errCode === 5) {
                hasWarning = true;
            } else if (res && res.errCode !== 0) {
                errors.push(res.errMessage || `Clinic ID ${id} error`);
            }
        }

        if (hasWarning && !force) {
            this.setState({ isForceDelete: true, showBulkDeleteConfirm: true });
            return;
        }

        if (errors.length > 0 && !hasWarning) alert(errors.join('\n'));

        this.setState({ selectedClinics: [], showBulkDeleteConfirm: false, isForceDelete: false });
        await this.getAllClinics();
    }

    handleCancelBulkDelete = () => {
        this.setState({ showBulkDeleteConfirm: false, clinicToForceDelete: null, isForceDelete: false });
    }

    getProcessedClinics = () => {
        let { arrClinics, searchTerm } = this.state;
        let filtered = [...arrClinics];
        if (searchTerm) {
            let term = searchTerm.toLowerCase();
            filtered = filtered.filter(c =>
                c.name.toLowerCase().includes(term) ||
                c.address.toLowerCase().includes(term)
            );
        }
        return filtered;
    }

    render() {
        let { isModalOpen, action, clinicEdit, currentPage, pageSize, searchTerm, selectedClinics } = this.state;
        let { language } = this.props;

        let processedClinics = this.getProcessedClinics();
        let displayClinics = processedClinics.slice((currentPage - 1) * pageSize, currentPage * pageSize);
        let totalPages = Math.ceil(processedClinics.length / pageSize);
        let isAllSelected = displayClinics.length > 0 && displayClinics.every(c => selectedClinics.includes(c.id));

        return (
            <div className="apple-clinic-manage">
                <div className="manage-header">
                    <div className="header-info">
                        <h1>Quản lý Cơ sở y tế</h1>
                        <span>{processedClinics.length} cơ sở</span>
                    </div>
                    <div className="header-btns">
                        <button className="btn-add" onClick={this.handleAddNewClinic}>
                            <i className="fas fa-plus"></i> Thêm cơ sở
                        </button>
                    </div>
                </div>

                <div className="manage-toolbar">
                    <div className="search-wrapper">
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên hoặc địa chỉ..."
                            value={searchTerm}
                            onChange={(e) => this.setState({ searchTerm: e.target.value, currentPage: 1 })}
                        />
                    </div>
                </div>

                <div className="table-wrapper">
                    <table className="clean-table">
                        <thead>
                            <tr>
                                <th className="check-col">
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        onChange={() => this.handleSelectAll(displayClinics)}
                                    />
                                </th>
                                <th className="id-col">ID</th>
                                <th className="name-col">Cơ sở y tế</th>
                                <th className="address-col">Địa chỉ</th>
                                <th className="actions-col">
                                    {selectedClinics.length > 0 ? (
                                        <div className="header-bulk-actions">
                                            <button className="btn-cancel-select" onClick={() => this.setState({ selectedClinics: [] })}>
                                                <i className="fas fa-times"></i>
                                            </button>
                                            <button className="btn-bulk-delete" onClick={this.handleBulkDelete}>
                                                <i className="fas fa-trash-alt"></i>
                                                <span>{selectedClinics.length}</span>
                                            </button>
                                        </div>
                                    ) : "Hành động"}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayClinics.map((item, index) => {
                                let isSelected = selectedClinics.includes(item.id);
                                return (
                                    <tr key={item.id} className={isSelected ? 'selected-row' : ''}>
                                        <td className="check-col">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => this.handleSelectClinic(item.id)}
                                            />
                                        </td>
                                        <td className="id-col">#{item.id}</td>
                                        <td>
                                            <div className="clinic-cell">
                                                <div className="clinic-image">
                                                    <img src={item.image} alt="clinic" />
                                                </div>
                                                <div className="clinic-info">
                                                    <div className="clinic-name">{item.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="address-col">{item.address}</td>
                                        <td>
                                            <div className="action-btns">
                                                <button className="edit" onClick={() => this.handleEditClinic(item)}><i className="fas fa-pencil-alt"></i></button>
                                                <button className="delete" onClick={() => {
                                                    this.setState({ clinicToForceDelete: item, showBulkDeleteConfirm: true, isForceDelete: false });
                                                }}><i className="fas fa-trash"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="pagination-bar">
                    <button disabled={currentPage === 1} onClick={() => this.setState({ currentPage: currentPage - 1 })}><i className="fas fa-chevron-left"></i></button>
                    <span>{currentPage} / {totalPages || 1}</span>
                    <button disabled={currentPage === totalPages} onClick={() => this.setState({ currentPage: currentPage + 1 })}><i className="fas fa-chevron-right"></i></button>
                </div>

                <ModalManageClinic
                    isOpen={isModalOpen}
                    action={action}
                    currentClinic={clinicEdit}
                    toggleFromParent={() => {
                        this.setState({ isModalOpen: false });
                    }}
                    saveClinic={this.handleSaveClinic}
                />

                <div style={{ display: 'none' }}>
                    {this.handleDeleteClinic = async (clinic, force = false) => {
                        try {
                            let res = await deleteClinicService(clinic.id, force);
                            if (res && res.errCode === 0) {
                                this.setState({
                                    selectedClinics: this.state.selectedClinics.filter(id => id !== clinic.id),
                                    showBulkDeleteConfirm: false,
                                    clinicToForceDelete: null,
                                    isForceDelete: false
                                });
                                await this.getAllClinics();
                                toast.success('Xóa cơ sở y tế thành công!');
                            } else if (res && res.errCode === 5) {
                                this.setState({
                                    showBulkDeleteConfirm: true,
                                    clinicToForceDelete: clinic,
                                    isForceDelete: true
                                });
                            } else {
                                toast.error(res.errMessage);
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    }}
                </div>

                {/* CONFIRM DELETE POPUP */}
                {this.state.showBulkDeleteConfirm && (
                    <div className="apple-confirm-overlay">
                        <div className="apple-confirm-popup">
                            <div className="popup-title">
                                {this.state.isForceDelete ? "Cảnh báo dữ liệu!" : (this.state.clinicToForceDelete ? "Xóa cơ sở y tế?" : `Xóa ${selectedClinics.length} cơ sở?`)}
                            </div>
                            <div className="popup-desc">
                                {this.state.isForceDelete ?
                                    "Cơ sở này đang có các bác sĩ đang công tác. Bạn có chắc chắn muốn xóa mềm?" :
                                    "Những dữ liệu được chọn sẽ bị xóa khỏi hệ thống. Hành động này không thể hoàn tác."}
                            </div>
                            <div className="popup-actions">
                                <button className="btn-cancel" onClick={this.handleCancelBulkDelete}>Hủy</button>
                                <button className="btn-delete" onClick={() => {
                                    if (this.state.clinicToForceDelete) {
                                        this.handleDeleteClinic(this.state.clinicToForceDelete, true);
                                    } else {
                                        this.confirmBulkDelete(this.state.isForceDelete);
                                    }
                                }}>Xác nhận xóa</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    language: state.app.language,
});

export default withSocket(connect(mapStateToProps)(ManageClinic));