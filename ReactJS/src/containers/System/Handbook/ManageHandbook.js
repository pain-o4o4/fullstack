import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import {
    getAllHandbookService,
    createNewHandbookService,
    deleteHandbookService,
    editHandbookService
} from '../../../services/userService';
import ModalManageHandbook from './ModalManageHandbook';
import './ManageHandbook.scss';
import { toast } from 'react-toastify';
import { withRouter } from '../../../components/Navigator';

class ManageHandbook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrHandbooks: [],
            isModalOpen: false,
            action: 'CREATE',
            handbookEdit: {},

            currentPage: 1,
            pageSize: 6
        };
    }

    async componentDidMount() {
        await this.getAllHandbooks();
    }

    getAllHandbooks = async () => {
        let response = await getAllHandbookService();
        if (response && response.errCode === 0) {
            this.setState({
                arrHandbooks: response.data
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

    toggleModal = () => {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    saveHandbook = async (data) => {
        let { language } = this.props;
        try {
            let res;
            if (this.state.action === 'CREATE') {
                res = await createNewHandbookService(data);
            } else {
                res = await editHandbookService(data);
            }

            if (res && res.errCode === 0) {
                let successMsg = this.state.action === 'CREATE'
                    ? (language === 'vi' ? "Thêm cẩm nang thành công!" : "Handbook added successfully!")
                    : (language === 'vi' ? "Cập nhật cẩm nang thành công!" : "Handbook updated successfully!");
                toast.success(successMsg);
                this.setState({
                    isModalOpen: false
                });
                await this.getAllHandbooks();
            } else {
                toast.error(res?.errMessage || (language === 'vi' ? "Lỗi hệ thống!" : "System error!"));
            }
        } catch (e) {
            console.log(e);
            let errorMsg = language === 'vi' ? "Lỗi kết nối Server!" : "Server connection error!";
            toast.error(errorMsg);
        }
    }

    handleEditHandbook = (handbook) => {
        this.setState({
            isModalOpen: true,
            action: 'EDIT',
            handbookEdit: handbook
        });
    }

    handleDeleteHandbook = async (handbook) => {
        let { language } = this.props;
        let confirmMsg = language === 'vi'
            ? `Bạn có chắc chắn muốn xóa cẩm nang: ${handbook.name}?`
            : `Are you sure you want to delete handbook: ${handbook.name}?`;

        if (window.confirm(confirmMsg)) {
            try {
                let res = await deleteHandbookService(handbook.id);
                if (res && res.errCode === 0) {
                    toast.success(language === 'vi' ? "Xóa cẩm nang thành công!" : "Handbook deleted successfully!");
                    await this.getAllHandbooks();
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
        let { arrHandbooks, isModalOpen, action, handbookEdit, currentPage, pageSize } = this.state;
        let displayHandbooks = arrHandbooks.slice((currentPage - 1) * pageSize, currentPage * pageSize);
        return (
            <div className="specialty-management-container">
                {this.state.isModalOpen && (
                    <ModalManageHandbook
                        isOpen={this.state.isModalOpen}
                        toggleFromParent={this.toggleModal}
                        saveHandbook={this.saveHandbook}
                        action={this.state.action}
                        currentHandbook={this.state.handbookEdit}
                    />
                )}

                <div className="header-section">
                    <h2 className="title">
                        <FormattedMessage id="admin.manage-handbook.title" defaultMessage="Quản lý Cẩm nang" />
                    </h2>
                    <button className="btn-add-new" onClick={() => this.handleAddNewHandbook()}>
                        <i className="fas fa-plus"></i> <FormattedMessage id="admin.manage-handbook.title" defaultMessage="Thêm Cẩm nang" />
                    </button>
                </div>

                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th><FormattedMessage id="admin.manage-handbook.name" /></th>
                                <th className="text-right"><FormattedMessage id="manage-specialty.table-actions" /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayHandbooks && displayHandbooks.length > 0 ? (
                                displayHandbooks.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <div className="specialty-cell-info">
                                                    <div className="specialty-img-wrapper">
                                                        <img src={item.image || 'https://static.vecteezy.com/system/resources/previews/026/625/600/non_2x/person-icon-symbol-design-illustration-vector.jpg'} alt="handbook" />
                                                    </div>
                                                    <div className="specialty-text">
                                                        <span className="specialty-name">{item.name}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-right">
                                                <div className="actions-cell">
                                                    <button className="btn-action btn-edit" onClick={() => this.handleEditHandbook(item)} title="Chỉnh sửa">
                                                        <i className="fas fa-pen"></i>
                                                    </button>
                                                    <button className="btn-action btn-delete" onClick={() => this.handleDeleteHandbook(item)} title="Xóa">
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td colSpan="2" className="text-center py-5">
                                        <div style={{ color: '#86868b', fontSize: '15px' }}>
                                            <i className="fas fa-folder-open" style={{ display: 'block', fontSize: '24px', marginBottom: '10px' }}></i>
                                            <FormattedMessage id="manage-specialty.no-data" />
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {arrHandbooks && arrHandbooks.length > pageSize &&
                    <div className="pagination-footer">
                        <button
                            className="btn-pagination"
                            disabled={currentPage === 1}
                            onClick={() => this.setState({ currentPage: currentPage - 1 })}
                        >
                            <i className="fas fa-chevron-left"></i>
                        </button>

                        {[...Array(Math.ceil(arrHandbooks.length / pageSize))].map((_, i) => (
                            <button
                                key={i}
                                className={currentPage === i + 1 ? "btn-pagination active" : "btn-pagination"}
                                onClick={() => this.setState({ currentPage: i + 1 })}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            className="btn-pagination"
                            disabled={currentPage === Math.ceil(arrHandbooks.length / pageSize)}
                            onClick={() => this.setState({ currentPage: currentPage + 1 })}
                        >
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>
                }

            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

export default withRouter(connect(mapStateToProps, null)(ManageHandbook));
