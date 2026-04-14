import React, { Component } from 'react';
import { connect } from "react-redux";
import { getManageSpecialtyById } from '../../../services/userService';
import { LANGUAGES } from '../../../utils/constant';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import './ManageSpecialty.scss';
import MarkdownIt from 'markdown-it/index.js';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import CommonUtils from '../../../utils/CommonUtils';
import { postCreateNewSpecialtyService } from '../../../services/userService'
import { toast } from 'react-toastify'




const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
            previewImgURL: '',
            isOpen: false
        }
    }

    handleOnChangeInput = (event, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({ ...stateCopy });
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionHTML: html,
            descriptionMarkdown: text,
        })
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
            })
        }
    }

    handleSaveNewSpecialty = async () => {
        // 1. Validate sơ bộ ở FE
        if (!this.state.name || !this.state.imageBase64 || !this.state.descriptionMarkdown) {
            toast.error("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        console.log('>>> Check state save:', this.state);

        // 2. Gọi API
        let res = await postCreateNewSpecialtyService({
            name: this.state.name,
            imageBase64: this.state.imageBase64,
            descriptionHTML: this.state.descriptionHTML,
            descriptionMarkdown: this.state.descriptionMarkdown
        });
        console.log('>>> Check res save specialty:', res);
        // 3. Xử lý kết quả trả về
        if (res && res.errCode === 0) {
            toast.success("Add new specialty succeed!");
            // Reset form về trạng thái trống
            this.setState({
                name: '',
                imageBase64: '',
                descriptionHTML: '',
                descriptionMarkdown: '',
                previewImgURL: '',
                isOpen: false
            });
        } else {
            toast.error("Add new specialty error!");
            console.log('>>> Check error response:', res);
        }
    }
    openPreviewImage = () => {
        if (!this.state.previewImgURL) return; // Không có ảnh thì không mở
        this.setState({
            isOpen: true
        })
    }
    render() {
        return (
            <div className="manage-specialty-container">
                <div className="manage-specialty-title"><FormattedMessage id="manage-specialty.title" /></div>
                <div className="add-new-specialty row">
                    <div className="col-6 form-group">
                        <label><FormattedMessage id="manage-specialty.name" /></label>
                        <input className="form-control" type="text"
                            value={this.state.name}
                            onChange={(event) => this.handleOnChangeInput(event, 'name')}
                        />
                    </div>
                    <div className="col-6 form-group">
                        <label><FormattedMessage id="manage-specialty.image" /></label>
                        <div className="preview-img-container">
                            <input id="previewImg" type="file" hidden
                                onChange={(event) => this.handleOnChangeImage(event)}
                            />
                            <label className="label-upload" htmlFor="previewImg">
                                <FormattedMessage id="manage-specialty.image-place" />
                                <i className="fas fa-upload"></i></label>
                            <div className="preview-image"
                                style={{ backgroundImage: `url(${this.state.previewImgURL})` }}
                                onClick={() => this.openPreviewImage()}
                            ></div>
                        </div>
                    </div>
                    <div className="col-12">
                        <MdEditor
                            style={{ height: '300px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.descriptionMarkdown}
                        />
                    </div>
                    <div className="col-12">
                        <button className="btn-save-specialty"
                            onClick={() => this.handleSaveNewSpecialty()}
                        >
                            <FormattedMessage id="manage-specialty.save" />
                        </button>
                    </div>
                </div>

                {this.state.isOpen === true &&
                    <Lightbox
                        mainSrc={this.state.previewImgURL}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        // language: state.app.language,
        // // ManageSpecialty: state.admin.ManageSpecialty

    };
};

const mapDispatchToProps = dispatch => {
    return {

        // getManageSpecialty: (id) => dispatch(action.getManageSpecialty(id))
    };
};

// import { withRouter } from 'react-router'; // hoặc 'react-router-dom'
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty));

