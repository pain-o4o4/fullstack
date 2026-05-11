import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import {
    getAllHandbookService,
    deleteHandbookService,
    createNewHandbookService,
    editHandbookService
} from '../../../services/userService';
import ModalManageHandbook from './ModalManageHandbook';
import { withSocket } from '../../../hoc/withSocket';
import './ManageHandbook.scss';
import moment from 'moment';
import { toast } from 'react-toastify';

class ManageHandbook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrHandbooks: [],
            isModalOpen: false,
            action: 'CREATE',
            handbookEdit: {},

            currentPage: 1,
            pageSize: 7,
            searchTerm: '',
            selectedHandbooks: [], // Track selected IDs
            showBulkDeleteConfirm: false,
            handbookToForceDelete: null,
            isForceDelete: false
        };
    }

    async componentDidMount() {
        await this.getAllHandbooks();
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
        if (data && data.entity === 'HANDBOOK') {
            this.getAllHandbooks();
        }
    }

    getAllHandbooks = async () => {
        let response = await getAllHandbookService();
        if (response && response.errCode === 0) {
            this.setState({
                arrHandbooks: response.data || []
            });
        }
    }

    handleAddNewHandbook = () => {
        this.setState({
            isModalOpen: true,
            action: 'CREATE',
            handbookEdit: {}
        });
    }

    handleEditHandbook = (handbook) => {
        this.setState({
            isModalOpen: true,
            action: 'EDIT',
            handbookEdit: handbook
        });
    }

    handleSaveHandbook = async (data) => {
        try {
            let res;
            if (this.state.action === 'CREATE') {
                res = await createNewHandbookService(data);
            } else {
                res = await editHandbookService(data);
            }

            if (res && res.errCode === 0) {
                toast.success(this.state.action === 'CREATE' ? 'Thêm cẩm nang thành công!' : 'Cập nhật cẩm nang thành công!');
                this.setState({ isModalOpen: false });
                await this.getAllHandbooks();
            } else {
                toast.error(res.errMessage || 'Error saving handbook');
            }
        } catch (error) {
            console.log(error);
            toast.error('Error saving handbook');
        }
    }

    handleDeleteHandbook = async (handbook, force = false) => {
        try {
            let res = await deleteHandbookService(handbook.id, force);
            if (res && res.errCode === 0) {
                this.setState({
                    selectedHandbooks: this.state.selectedHandbooks.filter(id => id !== handbook.id),
                    showBulkDeleteConfirm: false,
                    handbookToForceDelete: null,
                    isForceDelete: false
                });
                await this.getAllHandbooks();
                toast.success('Xóa cẩm nang thành công!');
            } else {
                toast.error(res.errMessage || 'Error deleting handbook');
            }
        } catch (error) {
            console.log(error);
        }
    }

    handleSelectHandbook = (id) => {
        let { selectedHandbooks } = this.state;
        if (selectedHandbooks.includes(id)) {
            this.setState({ selectedHandbooks: selectedHandbooks.filter(sid => sid !== id) });
        } else {
            this.setState({ selectedHandbooks: [...selectedHandbooks, id] });
        }
    }

    handleSelectAll = (displayHandbooks) => {
        let { selectedHandbooks } = this.state;
        let allIdsOnPage = displayHandbooks.map(h => h.id);
        let allSelected = allIdsOnPage.every(id => selectedHandbooks.includes(id));

        if (allSelected) {
            this.setState({ selectedHandbooks: selectedHandbooks.filter(id => !allIdsOnPage.includes(id)) });
        } else {
            this.setState({ selectedHandbooks: [...new Set([...selectedHandbooks, ...allIdsOnPage])] });
        }
    }

    handleBulkDelete = () => {
        if (this.state.selectedHandbooks.length > 0) {
            this.setState({ showBulkDeleteConfirm: true, handbookToForceDelete: null, isForceDelete: false });
        }
    }

    confirmBulkDelete = async (force = false) => {
        let { selectedHandbooks } = this.state;
        let errors = [];

        for (let id of selectedHandbooks) {
            let res = await deleteHandbookService(id, force);
            if (res && res.errCode !== 0) {
                errors.push(res.errMessage || `Handbook ID ${id} error`);
            }
        }

        if (errors.length > 0) alert(errors.join('\n'));

        this.setState({ selectedHandbooks: [], showBulkDeleteConfirm: false, isForceDelete: false });
        await this.getAllHandbooks();
    }

    handleCancelBulkDelete = () => {
        this.setState({ showBulkDeleteConfirm: false, handbookToForceDelete: null, isForceDelete: false });
    }

    getProcessedHandbooks = () => {
        let { arrHandbooks, searchTerm } = this.state;
        let filtered = [...arrHandbooks];
        if (searchTerm) {
            let term = searchTerm.toLowerCase();
            filtered = filtered.filter(h => 
                h.name.toLowerCase().includes(term)
            );
        }
        return filtered;
    }

    render() {
        let { isModalOpen, action, handbookEdit, currentPage, pageSize, searchTerm, selectedHandbooks } = this.state;

        let processedHandbooks = this.getProcessedHandbooks();
        let displayHandbooks = processedHandbooks.slice((currentPage - 1) * pageSize, currentPage * pageSize);
        let totalPages = Math.ceil(processedHandbooks.length / pageSize);
        let isAllSelected = displayHandbooks.length > 0 && displayHandbooks.every(h => selectedHandbooks.includes(h.id));

        return (
            <div className="apple-handbook-manage">
                <div className="manage-header">
                    <div className="header-info">
                        <h1>Quản lý Cẩm nang</h1>
                        <span>{processedHandbooks.length} bài viết</span>
                    </div>
                    <div className="header-btns">
                        <button className="btn-add" onClick={this.handleAddNewHandbook}>
                            <i className="fas fa-plus"></i> Thêm cẩm nang
                        </button>
                    </div>
                </div>

                <div className="manage-toolbar">
                    <div className="search-wrapper">
                        <i className="fas fa-search"></i>
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm theo tiêu đề bài viết..." 
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
                                        onChange={() => this.handleSelectAll(displayHandbooks)}
                                    />
                                </th>
                                <th className="id-col">ID</th>
                                <th className="title-col">Cẩm nang</th>
                                <th className="date-col">Ngày tạo</th>
                                <th className="actions-col">
                                    {selectedHandbooks.length > 0 ? (
                                        <div className="header-bulk-actions">
                                            <button className="btn-cancel-select" onClick={() => this.setState({ selectedHandbooks: [] })}>
                                                <i className="fas fa-times"></i>
                                            </button>
                                            <button className="btn-bulk-delete" onClick={this.handleBulkDelete}>
                                                <i className="fas fa-trash-alt"></i>
                                                <span>{selectedHandbooks.length}</span>
                                            </button>
                                        </div>
                                    ) : "Hành động"}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayHandbooks.map((item, index) => {
                                let isSelected = selectedHandbooks.includes(item.id);
                                return (
                                    <tr key={item.id} className={isSelected ? 'selected-row' : ''}>
                                        <td className="check-col">
                                            <input 
                                                type="checkbox" 
                                                checked={isSelected}
                                                onChange={() => this.handleSelectHandbook(item.id)}
                                            />
                                        </td>
                                        <td className="id-col">#{item.id}</td>
                                        <td>
                                            <div className="handbook-cell">
                                                <div className="handbook-image">
                                                    <img src={item.image} alt="handbook" />
                                                </div>
                                                <div className="handbook-info">
                                                    <div className="handbook-name">{item.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="date-col">{moment(item.createdAt).format('DD/MM/YYYY')}</td>
                                        <td>
                                            <div className="action-btns">
                                                <button className="edit" onClick={() => this.handleEditHandbook(item)}><i className="fas fa-pencil-alt"></i></button>
                                                <button className="delete" onClick={() => {
                                                    this.setState({ handbookToForceDelete: item, showBulkDeleteConfirm: true, isForceDelete: false });
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

                <ModalManageHandbook 
                    isOpen={isModalOpen}
                    action={action}
                    currentHandbook={handbookEdit}
                    toggleFromParent={() => {
                        this.setState({ isModalOpen: false });
                    }}
                    saveHandbook={this.handleSaveHandbook}
                />

                {/* CONFIRM DELETE POPUP */}
                {this.state.showBulkDeleteConfirm && (
                    <div className="apple-confirm-overlay">
                        <div className="apple-confirm-popup">
                            <div className="popup-title">
                                {this.state.handbookToForceDelete ? "Xóa cẩm nang?" : `Xóa ${selectedHandbooks.length} cẩm nang?`}
                            </div>
                            <div className="popup-desc">
                                Bài viết sẽ được chuyển vào thùng rác (xóa mềm). Bạn có chắc chắn muốn thực hiện hành động này?
                            </div>
                            <div className="popup-actions">
                                <button className="btn-cancel" onClick={this.handleCancelBulkDelete}>Hủy</button>
                                <button className="btn-delete" onClick={() => {
                                    if (this.state.handbookToForceDelete) {
                                        this.handleDeleteHandbook(this.state.handbookToForceDelete, true);
                                    } else {
                                        this.confirmBulkDelete(true);
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

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withSocket(connect(mapStateToProps, mapDispatchToProps)(ManageHandbook));
