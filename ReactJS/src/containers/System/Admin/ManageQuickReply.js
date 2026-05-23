import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllGlobalQuickRepliesApi, saveGlobalQuickReplyApi, deleteQuickReplyApi } from '../../../services/userService';
import { toast } from 'react-toastify';
import './ManageQuickReply.scss';

class ManageQuickReply extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listReplies: [],
            title: '',
            content: '',
            type: 'MANUAL',
            isEdit: false,
            editId: null
        }
    }

    async componentDidMount() {
        await this.fetchData();
    }

    fetchData = async () => {
        let res = await getAllGlobalQuickRepliesApi();
        if (res && res.errCode === 0) {
            this.setState({
                listReplies: res.data
            });
        }
    }

    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        });
    }

    handleSaveReply = async () => {
        let { title, content, type, isEdit, editId } = this.state;
        if (!content) {
            toast.error('Nội dung không được để trống!');
            return;
        }

        let res = await saveGlobalQuickReplyApi({
            id: isEdit ? editId : null,
            title: title,
            content: content,
            type: type
        });

        if (res && res.errCode === 0) {
            toast.success(isEdit ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
            this.setState({
                title: '',
                content: '',
                type: 'MANUAL',
                isEdit: false,
                editId: null
            });
            await this.fetchData();
        } else {
            toast.error('Có lỗi xảy ra!');
        }
    }

    handleEdit = (item) => {
        this.setState({
            title: item.title || '',
            content: item.content,
            type: item.type || 'MANUAL',
            isEdit: true,
            editId: item.id
        });
    }

    handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa mẫu này?')) {
            let res = await deleteQuickReplyApi(id);
            if (res && res.errCode === 0) {
                toast.success('Xóa thành công!');
                await this.fetchData();
            } else {
                toast.error('Lỗi khi xóa!');
            }
        }
    }

    handleCancelEdit = () => {
        this.setState({
            title: '',
            content: '',
            type: 'MANUAL',
            isEdit: false,
            editId: null
        });
    }

    render() {
        let { listReplies, title, content, isEdit } = this.state;
        return (
            <div className="manage-quick-reply-container">
                <div className="title">QUẢN LÝ TIN NHẮN NHANH </div>

                <div className="manage-quick-reply-body">
                    <div className="row section-add-new">
                        <div className="col-12 mb-3">
                            <label className="form-label">Thêm mẫu tin nhắn nhanh mới</label>
                            <div className="alert alert-info">
                                <b>Biến hỗ trợ:</b> <br />
                                <code>{'{{doctorName}}'}</code>: Tên bác sĩ |
                                <code>{'{{specialty}}'}</code>: Chuyên khoa |
                                <code>{'{{clinicName}}'}</code>: Phòng khám |
                                <code>{'{{patientName}}'}</code>: Tên bệnh nhân
                            </div>
                        </div>
                        <div className="col-3 mb-3">
                            <label>Loại tin nhắn</label>
                            <select className="form-select" value={this.state.type} onChange={(e) => this.handleOnChangeInput(e, 'type')}>
                                <option value="MANUAL">Thủ công (Bác sĩ chọn)</option>
                                <option value="AUTO_S2">Tự động (Khi đặt lịch & thanh toán thành công)</option>
                                <option value="AUTO_S3">Tự động (Khi Đã khám xong)</option>
                                <option value="AUTO_S5">Tự động (Khi Lỡ hẹn)</option>
                            </select>
                        </div>
                        <div className="col-4 mb-3">
                            <label>Tiêu đề (Gợi nhớ)</label>
                            <input className="form-control" type="text" value={title}
                                onChange={(event) => this.handleOnChangeInput(event, 'title')}
                                placeholder="VD: Chào hỏi, Hướng dẫn..."
                            />
                        </div>
                        <div className="col-5 mb-3">
                            <label>Nội dung tin nhắn</label>
                            <textarea className="form-control" rows="3" value={content}
                                onChange={(event) => this.handleOnChangeInput(event, 'content')}
                                placeholder="VD: Chào bạn {{patientName}}, tôi là {{doctorName}}..."
                            ></textarea>
                        </div>
                        <div className="col-12 text-end">
                            {isEdit ? (
                                <>
                                    <button className="btn btn-warning px-4 me-2" onClick={() => this.handleSaveReply()}>Cập nhật</button>
                                    <button className="btn btn-secondary px-4" onClick={() => this.handleCancelEdit()}>Hủy</button>
                                </>
                            ) : (
                                <button className="btn btn-primary px-5" onClick={() => this.handleSaveReply()}>Thêm mới</button>
                            )}
                        </div>
                    </div>

                    <div className="row section-table mt-5">
                        <div className="col-12">
                            <table className="table table-hover table-bordered shadow-sm">
                                <thead className="table-dark">
                                    <tr>
                                        <th style={{ width: '15%' }}>Phân loại</th>
                                        <th style={{ width: '20%' }}>Tiêu đề</th>
                                        <th>Nội dung mẫu</th>
                                        <th style={{ width: '10%' }}>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listReplies && listReplies.length > 0 ? (
                                        listReplies.map((item, index) => (
                                            <tr key={index}>
                                                <td>
                                                    {item.type === 'AUTO_S2' && <span className="badge bg-info text-dark">Tự động (Thanh toán)</span>}
                                                    {item.type === 'AUTO_S3' && <span className="badge bg-success">Tự động (Đã khám)</span>}
                                                    {item.type === 'AUTO_S5' && <span className="badge bg-danger">Tự động (Lỡ hẹn)</span>}
                                                    {(!item.type || item.type === 'MANUAL') && <span className="badge bg-secondary">Thủ công</span>}
                                                </td>
                                                <td className="fw-bold text-primary">{item.title || '---'}</td>
                                                <td>{item.content}</td>
                                                <td className="text-center">
                                                    <button className="btn-edit" onClick={() => this.handleEdit(item)}><i className="fas fa-pencil-alt"></i></button>
                                                    <button className="btn-delete" onClick={() => this.handleDelete(item.id)}><i className="fas fa-trash"></i></button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center italic">Chưa có mẫu nào được tạo</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageQuickReply);
