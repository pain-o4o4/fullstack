import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllEmailTemplatesApi, saveEmailTemplateApi } from '../../../services/userService';
import { toast } from 'react-toastify';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import './ManageEmailTemplate.scss';

const mdParser = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
});

class ManageEmailTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listTemplates: [],
            type: 'CONFIRMATION',
            subject: '',
            contentMarkdown: '',
            contentHTML: '',
            language: 'vi',
            isEdit: false,
            editId: null
        }
    }

    async componentDidMount() {
        await this.fetchData();
    }

    autoFillTemplate = (type, language, list = this.state.listTemplates) => {
        let match = list.find(item => item.type === type && item.language === language);
        if (match) {
            this.setState({
                subject: match.subject || '',
                contentHTML: match.content || '',
                contentMarkdown: match.contentMarkdown || match.content || '',
                isEdit: true,
                editId: match.id
            });
        } else {
            this.setState({
                subject: '',
                contentHTML: '',
                contentMarkdown: '',
                isEdit: false,
                editId: null
            });
        }
    }

    fetchData = async () => {
        let res = await getAllEmailTemplatesApi();
        if (res && res.errCode === 0) {
            this.setState({
                listTemplates: res.data
            }, () => {
                this.autoFillTemplate(this.state.type, this.state.language);
            });
        }
    }

    handleOnChangeInput = (event, id) => {
        let value = event.target.value;
        this.setState({
            [id]: value
        }, () => {
            if (id === 'type' || id === 'language') {
                this.autoFillTemplate(this.state.type, this.state.language);
            }
        });
    }

    handleSaveTemplate = async () => {
        let { type, subject, contentHTML, contentMarkdown, language, isEdit, editId } = this.state;
        if (!subject || !contentHTML) {
            toast.error('Tiêu đề và nội dung không được để trống!');
            return;
        }

        let res = await saveEmailTemplateApi({
            id: isEdit ? editId : null,
            type: type,
            subject: subject,
            content: contentHTML, // We save HTML to DB for email sending
            contentMarkdown: contentMarkdown, // Save markdown to retrieve and edit later
            language: language
        });

        if (res && res.errCode === 0) {
            toast.success(isEdit ? 'Cập nhật mẫu thành công!' : 'Thêm mới mẫu thành công!');
            await this.fetchData();
        } else {
            toast.error('Có lỗi xảy ra!');
        }
    }

    handleEdit = (item) => {
        this.setState({
            type: item.type,
            subject: item.subject,
            contentHTML: item.content || '',
            contentMarkdown: item.contentMarkdown || item.content || '',
            language: item.language,
            isEdit: true,
            editId: item.id
        });
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentHTML: html,
            contentMarkdown: text
        })
    }


    render() {
        let { listTemplates, type, subject, language, isEdit } = this.state;
        return (
            <div className="manage-email-template-container">
                <div className="title">QUẢN LÝ MẪU EMAIL TỰ ĐỘNG</div>
                
                <div className="manage-email-template-body">
                    <div className="row section-add-new">
                        <div className="col-12 mb-3">
                            <label className="form-label"><b>Chỉnh sửa / Thêm mới mẫu Email</b></label>
                            <div className="alert alert-warning">
                                <b>Biến hỗ trợ chung:</b> <code>{'{{patientName}}'}</code>, <code>{'{{doctorName}}'}</code>, <code>{'{{time}}'}</code>, <code>{'{{clinicName}}'}</code>, <code>{'{{addressClinic}}'}</code><br/>
                                <b>Biến cho Mã xác thực:</b> <code>{'{{code}}'}</code> (Mã OTP), <code>{'{{expireMinutes}}'}</code> (Thời gian hết hạn)<br/>
                                <b>Biến cho Đổi mật khẩu:</b> <code>{'{{resetLink}}'}</code> (Link đổi mật khẩu)
                            </div>
                        </div>
                        <div className="col-3 mb-3">
                            <label>Loại Email</label>
                            <select className="form-select" value={type} onChange={(e) => this.handleOnChangeInput(e, 'type')}>
                                <option value="CONFIRMATION">Xác nhận lịch hẹn</option>
                                <option value="REMEDY">Kết quả khám bệnh</option>
                                <option value="MISSED">Thông báo lỡ hẹn</option>
                                <option value="VERIFICATION">Mã xác thực đăng ký</option>
                                <option value="RESET_PASSWORD">Khôi phục mật khẩu</option>
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
                        <div className="col-12 mb-4">
                            <label className="form-label"><b>Nội dung Email (Trình soạn thảo)</b></label>
                            <MdEditor
                                style={{ height: '400px' }}
                                renderHTML={text => mdParser.render(text)}
                                onChange={this.handleEditorChange}
                                value={this.state.contentMarkdown}
                                placeholder="Soạn thảo nội dung email tại đây..."
                            />
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
