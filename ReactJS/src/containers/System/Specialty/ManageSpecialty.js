import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import {
    getAllSpecialtyService,
    deleteSpecialtyService,
} from '../../../services/userService';
import ModalManageSpecialty from '../manageSystemModal/ModalManageSpecialty';
import { withSocket } from '../../../hoc/withSocket';
import './ManageSpecialty.scss';

class ManageSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrSpecialties: [],
            isModalOpen: false,
            action: 'CREATE',
            specialtyEdit: {},

            currentPage: 1,
            pageSize: 7,
            searchTerm: '',
            selectedSpecialties: [], // Track selected IDs
            showBulkDeleteConfirm: false,
            specialtyToForceDelete: null,
            isForceDelete: false
        };
    }

    async componentDidMount() {
        await this.getAllSpecialties();
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
        if (data && data.entity === 'SPECIALTY') {
            this.getAllSpecialties();
        }
    }

    getAllSpecialties = async () => {
        let response = await getAllSpecialtyService();
        if (response && response.errCode === 0) {
            this.setState({
                arrSpecialties: response.data || []
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

    handleEditSpecialty = (specialty) => {
        this.setState({
            isModalOpen: true,
            action: 'EDIT',
            specialtyEdit: specialty
        });
    }

    handleDeleteSpecialty = async (specialty, force = false) => {
        try {
            let res = await deleteSpecialtyService(specialty.id, force);
            if (res && res.errCode === 0) {
                this.setState({
                    selectedSpecialties: this.state.selectedSpecialties.filter(id => id !== specialty.id),
                    showBulkDeleteConfirm: false,
                    specialtyToForceDelete: null,
                    isForceDelete: false
                });
                await this.getAllSpecialties();
            } else if (res && res.errCode === 5) {
                this.setState({
                    showBulkDeleteConfirm: true,
                    specialtyToForceDelete: specialty,
                    isForceDelete: true
                });
            } else {
                alert(res.errMessage);
            }
        } catch (error) {
            console.log(error);
        }
    }

    handleSelectSpecialty = (id) => {
        let { selectedSpecialties } = this.state;
        if (selectedSpecialties.includes(id)) {
            this.setState({ selectedSpecialties: selectedSpecialties.filter(sid => sid !== id) });
        } else {
            this.setState({ selectedSpecialties: [...selectedSpecialties, id] });
        }
    }

    handleSelectAll = (displaySpecialties) => {
        let { selectedSpecialties } = this.state;
        let allIdsOnPage = displaySpecialties.map(s => s.id);
        let allSelected = allIdsOnPage.every(id => selectedSpecialties.includes(id));

        if (allSelected) {
            this.setState({ selectedSpecialties: selectedSpecialties.filter(id => !allIdsOnPage.includes(id)) });
        } else {
            this.setState({ selectedSpecialties: [...new Set([...selectedSpecialties, ...allIdsOnPage])] });
        }
    }

    handleBulkDelete = () => {
        if (this.state.selectedSpecialties.length > 0) {
            this.setState({ showBulkDeleteConfirm: true, specialtyToForceDelete: null, isForceDelete: false });
        }
    }

    confirmBulkDelete = async (force = false) => {
        let { selectedSpecialties } = this.state;
        let errors = [];
        let hasWarning = false;

        for (let id of selectedSpecialties) {
            let res = await deleteSpecialtyService(id, force);
            if (res && res.errCode === 5) {
                hasWarning = true;
            } else if (res && res.errCode !== 0) {
                errors.push(res.errMessage || `Specialty ID ${id} error`);
            }
        }

        if (hasWarning && !force) {
            this.setState({ isForceDelete: true, showBulkDeleteConfirm: true });
            return;
        }

        if (errors.length > 0 && !hasWarning) alert(errors.join('\n'));

        this.setState({ selectedSpecialties: [], showBulkDeleteConfirm: false, isForceDelete: false });
        await this.getAllSpecialties();
    }

    handleCancelBulkDelete = () => {
        this.setState({ showBulkDeleteConfirm: false, specialtyToForceDelete: null, isForceDelete: false });
    }

    getProcessedSpecialties = () => {
        let { arrSpecialties, searchTerm } = this.state;
        let filtered = [...arrSpecialties];
        if (searchTerm) {
            let term = searchTerm.toLowerCase();
            filtered = filtered.filter(s => 
                s.name.toLowerCase().includes(term)
            );
        }
        return filtered;
    }

    render() {
        let { isModalOpen, action, specialtyEdit, currentPage, pageSize, searchTerm, selectedSpecialties } = this.state;

        let processedSpecialties = this.getProcessedSpecialties();
        let displaySpecialties = processedSpecialties.slice((currentPage - 1) * pageSize, currentPage * pageSize);
        let totalPages = Math.ceil(processedSpecialties.length / pageSize);
        let isAllSelected = displaySpecialties.length > 0 && displaySpecialties.every(s => selectedSpecialties.includes(s.id));

        return (
            <div className="apple-specialty-manage">
                <div className="manage-header">
                    <div className="header-info">
                        <h1>Quản lý Chuyên khoa</h1>
                        <span>{processedSpecialties.length} chuyên khoa</span>
                    </div>
                    <div className="header-btns">
                        <button className="btn-add" onClick={this.handleAddNewSpecialty}>
                            <i className="fas fa-plus"></i> Thêm chuyên khoa
                        </button>
                    </div>
                </div>

                <div className="manage-toolbar">
                    <div className="search-wrapper">
                        <i className="fas fa-search"></i>
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm theo tên chuyên khoa..." 
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
                                        onChange={() => this.handleSelectAll(displaySpecialties)}
                                    />
                                </th>
                                <th className="id-col">ID</th>
                                <th className="name-col">Chuyên khoa</th>
                                <th className="actions-col">
                                    {selectedSpecialties.length > 0 ? (
                                        <div className="header-bulk-actions">
                                            <button className="btn-cancel-select" onClick={() => this.setState({ selectedSpecialties: [] })}>
                                                <i className="fas fa-times"></i>
                                            </button>
                                            <button className="btn-bulk-delete" onClick={this.handleBulkDelete}>
                                                <i className="fas fa-trash-alt"></i>
                                                <span>{selectedSpecialties.length}</span>
                                            </button>
                                        </div>
                                    ) : "Hành động"}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {displaySpecialties.map((item, index) => {
                                let isSelected = selectedSpecialties.includes(item.id);
                                return (
                                    <tr key={item.id} className={isSelected ? 'selected-row' : ''}>
                                        <td className="check-col">
                                            <input 
                                                type="checkbox" 
                                                checked={isSelected}
                                                onChange={() => this.handleSelectSpecialty(item.id)}
                                            />
                                        </td>
                                        <td className="id-col">#{item.id}</td>
                                        <td>
                                            <div className="specialty-cell">
                                                <div className="specialty-image">
                                                    <img src={item.image} alt="specialty" />
                                                </div>
                                                <div className="specialty-info">
                                                    <div className="specialty-name">{item.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="action-btns">
                                                <button className="edit" onClick={() => this.handleEditSpecialty(item)}><i className="fas fa-pencil-alt"></i></button>
                                                <button className="delete" onClick={() => {
                                                    this.setState({ specialtyToForceDelete: item, showBulkDeleteConfirm: true, isForceDelete: false });
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

                <ModalManageSpecialty 
                    isOpen={isModalOpen}
                    action={action}
                    specialtyEdit={specialtyEdit}
                    closeModal={() => {
                        this.setState({ isModalOpen: false });
                        this.getAllSpecialties();
                    }}
                />

                {/* CONFIRM DELETE POPUP */}
                {this.state.showBulkDeleteConfirm && (
                    <div className="apple-confirm-overlay">
                        <div className="apple-confirm-popup">
                            <div className="popup-title">
                                {this.state.isForceDelete ? "Cảnh báo dữ liệu!" : (this.state.specialtyToForceDelete ? "Xóa chuyên khoa?" : `Xóa ${selectedSpecialties.length} chuyên khoa?`)}
                            </div>
                            <div className="popup-desc">
                                {this.state.isForceDelete ? 
                                    "Chuyên khoa này đang có các bác sĩ đang công tác. Bạn có chắc chắn muốn xóa mềm?" : 
                                    "Những dữ liệu được chọn sẽ bị xóa khỏi hệ thống. Hành động này không thể hoàn tác."}
                            </div>
                            <div className="popup-actions">
                                <button className="btn-cancel" onClick={this.handleCancelBulkDelete}>Hủy</button>
                                <button className="btn-delete" onClick={() => {
                                    if (this.state.specialtyToForceDelete) {
                                        this.handleDeleteSpecialty(this.state.specialtyToForceDelete, true);
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

export default withSocket(connect(mapStateToProps)(ManageSpecialty));
