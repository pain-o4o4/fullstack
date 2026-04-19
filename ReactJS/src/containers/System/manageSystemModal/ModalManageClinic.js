import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import CommonUtils from '../../../utils/CommonUtils';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import './ModalManageClinic.scss';

const mdParser = new MarkdownIt();

class ModalManageClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            address: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
            previewImgURL: ''
        }
    }

    componentDidMount() {
        let clinic = this.props.currentClinic;
        if (clinic && Object.keys(clinic).length > 0 && this.props.action === 'EDIT') {
            this.setState({
                id: clinic.id,
                name: clinic.name,
                address: clinic.address,
                imageBase64: clinic.image,
                descriptionHTML: clinic.descriptionHTML,
                descriptionMarkdown: clinic.descriptionMarkdown,
                previewImgURL: clinic.image
            });
        }
    }

    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({ ...copyState });
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionHTML: html,
            descriptionMarkdown: text,
        });
    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgURL: objectUrl,
                imageBase64: base64
            });
        }
    }

    handleSave = () => {
        this.props.saveClinic(this.state);
    }

    render() {
        let { isOpen, toggleFromParent, action } = this.props;
        return (
            <Modal isOpen={isOpen} toggle={() => toggleFromParent()} size="xl" centered className="modal-add-new-user modal-manage-clinic" backdrop="static">
                <ModalHeader toggle={() => toggleFromParent()}>
                    {action === 'CREATE' ? "Thêm mới Cơ Sở Y Tế (Clinic)" : "Chỉnh sửa Cơ Sở Y Tế (Clinic)"}
                </ModalHeader>
                <ModalBody>
                    <div className="user-form-grid">
                        <div className="input-group-apple full-width">
                            <label>Tên cơ sở y tế <span className="text-danger">*</span></label>
                            <input type="text" value={this.state.name} onChange={(e) => this.handleOnChangeInput(e, 'name')} />
                        </div>
                        
                        <div className="input-group-apple full-width">
                            <label>Địa chỉ cơ sở y tế <span className="text-danger">*</span></label>
                            <input type="text" value={this.state.address} onChange={(e) => this.handleOnChangeInput(e, 'address')} />
                        </div>
                        
                        <div className="input-group-apple full-width">
                            <label>Ảnh đại diện (Logo / Hình ảnh nhìn ngoài) <span className="text-danger">*</span></label>
                            <div className="preview-img-container">
                                <input id="previewImgClinic" type="file" hidden onChange={(event) => this.handleOnChangeImage(event)} accept="image/*" />
                                <label htmlFor="previewImgClinic" className="btn-upload-apple">
                                    <i className="fas fa-upload"></i> Tải ảnh lên
                                </label>
                                {this.state.previewImgURL && (
                                    <div className="preview-image" style={{
                                        backgroundImage: `url(${this.state.previewImgURL})`
                                    }}></div>
                                )}
                            </div>
                        </div>

                        <div className="input-group-apple full-width editor-container">
                            <label>Nội dung giới thiệu chi tiết <span className="text-danger">*</span></label>
                            <MdEditor
                                renderHTML={text => mdParser.render(text)}
                                onChange={this.handleEditorChange}
                                value={this.state.descriptionMarkdown}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button className="btn-action apple-btn btn-cancel" onClick={() => toggleFromParent()}>Hủy bỏ</button>
                    <button className="btn-action apple-btn btn-save" onClick={() => this.handleSave()}>
                        {action === 'CREATE' ? "Lưu Mới" : "Cập Nhật"}
                    </button>
                </ModalFooter>
            </Modal>
        )
    }
}

export default ModalManageClinic;
