import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllEmailTemplatesApi, saveEmailTemplateApi, deleteEmailTemplateApi } from '../../../services/userService';
import { toast } from 'react-toastify';
import './ManageEmailTemplate.scss';

class ManageEmailTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listTemplates: [],
            type: 'CONFIRMATION',
            subject: '',
            content: '',
            language: 'vi',
            isEdit: false,
            editId: null
        }
    }

    async componentDidMount() {
        await this.fetchData();
    }

    fetchData = async () => {
        let res = await getAllEmailTemplatesApi();
        if (res && res.errCode === 0) {
            this.setState({
                listTemplates: res.data
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

    handleSaveTemplate = async () => {
        let { type, subject, content, language, isEdit, editId } = this.state;
        if (!subject || !content) {
            toast.error('Tiêu đề và nội dung không được để trống!');
            return;
        }

        let res = await saveEmailTemplateApi({
            id: isEdit ? editId : null,
            type: type,
            subject: subject,
            content: content,
            language: language
        });

        if (res && res.errCode === 0) {
            toast.success(isEdit ? 'Cập nhật mẫu thành công!' : 'Thêm mới mẫu thành công!');
            this.setState({
                subject: '',
                content: '',
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
            type: item.type,
            subject: item.subject,
            content: item.content,
            language: item.language,
            isEdit: true,
            editId: item.id
        });
    }

    handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa mẫu email này?')) {
            let res = await deleteEmailTemplateApi(id);
            if (res && res.errCode === 0) {
                toast.success('Xóa thành công!');
                await this.fetchData();
            } else {
                toast.error('Lỗi khi xóa!');
            }
        }
    }

    render() {
        let { listTemplates, type, subject, content, language, isEdit } = this.state;
        return (
            <div className="manage-email-template-container">
                <div className="title">QUẢN LÝ MẪU EMAIL TỰ ĐỘNG</div>
                
                <div className="manage-email-template-body">
                    <div className="row section-add-new">
                        <div className="col-12 mb-3">
                            <label className="form-label"><b>Chỉnh sửa / Thêm mới mẫu Email</b></label>
                            <div className="alert alert-warning">
                                <b>Biến hỗ trợ (Copy và Paste vào nội dung):</b> <br/>
                                <code>{'{{patientName}}'}</code>, <code>{'{{doctorName}}'}</code>, 
                                <code>{'{{time}}'}</code>, <code>{'{{clinicName}}'}</code>, 
                                <code>{'{{addressClinic}}'}</code>
                            </div>
                        </div>
                        <div className="col-3 mb-3">
                            <label>Loại Email</label>
                            <select className="form-select" value={type} onChange={(e) => this.handleOnChangeInput(e, 'type')}>
                                <option value="CONFIRMATION">Xác nhận lịch hẹn</option>
                                <option value="REMEDY">Kết quả khám bệnh</option>
                                <option value="VERIFICATION_CODE">Mã xác thực đăng ký</option>
                            </select>
                        </div>
                        <div className="col-2 mb-3">
                            <label>Ngôn ngữ</label>
                            <select className="form-select" value={language} onChange={(e) => this.handleOnChangeInput(e, 'language')}>
                                <option value="vi">Tiếng Việt</option>
                                <option value="en">English</option>
                            </select>
                        </div>
                        <div className="col-7 mb-3">
                            <label>Tiêu đề Email (Subject)</label>
                            <input className="form-control" type="text" value={subject}
                                onChange={(event) => this.handleOnChangeInput(event, 'subject')}
                            />
                        </div>
                        <div className="col-12 mb-3">
                            <label>Nội dung HTML (Body)</label>
                            <textarea className="form-control html-editor" rows="10" value={content}
                                onChange={(event) => this.handleOnChangeInput(event, 'content')}
                                placeholder="Nhập mã HTML vào đây..."
                            ></textarea>
                        </div>
                        <div className="col-12 text-end">
                            <button className={`btn px-5 ${isEdit ? 'btn-warning' : 'btn-primary'}`} 
                                onClick={() => this.handleSaveTemplate()}>
                                {isEdit ? 'Cập nhật mẫu' : 'Lưu mẫu mới'}
                            </button>
                        </div>
                    </div>

                    <div className="row section-table mt-5">
                        <div className="col-12">
                            <table className="table table-hover table-bordered shadow-sm">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Loại</th>
                                        <th>Ngôn ngữ</th>
                                        <th>Tiêu đề</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listTemplates && listTemplates.length > 0 ? (
                                        listTemplates.map((item, index) => (
                                            <tr key={index}>
                                                <td><span className="badge bg-info text-dark">{item.type}</span></td>
                                                <td>{item.language === 'vi' ? '🇻🇳 Tiếng Việt' : '🇺🇸 English'}</td>
                                                <td>{item.subject}</td>
                                                <td className="text-center">
                                                    <button className="btn-edit" onClick={() => this.handleEdit(item)}><i className="fas fa-pencil-alt"></i></button>
                                                    <button className="btn-delete" onClick={() => this.handleDelete(item.id)}><i className="fas fa-trash"></i></button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center italic">Chưa có mẫu nào được lưu trong Database</td>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageEmailTemplate);
