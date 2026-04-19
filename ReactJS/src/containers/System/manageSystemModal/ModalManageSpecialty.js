import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import CommonUtils from '../../../utils/CommonUtils';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import './ModalManageSpecialty.scss';

const mdParser = new MarkdownIt();

class ModalManageSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
            previewImgURL: ''
        }
    }

    componentDidMount() {
        let specialty = this.props.currentSpecialty;
        if (specialty && Object.keys(specialty).length > 0 && this.props.action === 'EDIT') {
            this.setState({
                id: specialty.id,
                name: specialty.name,
                imageBase64: specialty.image,
                descriptionHTML: specialty.descriptionHTML,
                descriptionMarkdown: specialty.descriptionMarkdown,
                previewImgURL: specialty.image
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
        this.props.saveSpecialty(this.state);
    }

    render() {
        let { isOpen, toggleFromParent, action } = this.props;
        return (
            <Modal isOpen={isOpen} toggle={() => toggleFromParent()} size="xl" centered className="modal-add-new-user modal-manage-specialty" backdrop="static">
                <ModalHeader toggle={() => toggleFromParent()}>
                    {action === 'CREATE' ? "Thêm mới Chuyên Khoa" : "Chỉnh sửa Chuyên Khoa"}
                </ModalHeader>
                <ModalBody>
                    <div className="user-form-grid">
                        <div className="input-group-apple full-width">
                            <label>Tên chuyên khoa <span className="text-danger">*</span></label>
                            <input type="text" value={this.state.name} onChange={(e) => this.handleOnChangeInput(e, 'name')} />
                        </div>
                        
                        <div className="input-group-apple full-width">
                            <label>Ảnh đại diện Chuyên khoa <span className="text-danger">*</span></label>
                            <div className="preview-img-container">
                                <input id="previewImg" type="file" hidden onChange={(event) => this.handleOnChangeImage(event)} accept="image/*" />
                                <label htmlFor="previewImg" className="btn-upload-apple">
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
                            <label>Nội dung chi tiết <span className="text-danger">*</span></label>
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
                        {action === 'CREATE' ? "Lưu" : "Cập nhật"}
                    </button>
                </ModalFooter>
            </Modal>
        )
    }
}

export default ModalManageSpecialty;
