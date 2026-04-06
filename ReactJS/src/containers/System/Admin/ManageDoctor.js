import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import * as action from '../../../store/actions'
import MarkdownIt from 'markdown-it'
import './ManageDoctor.scss'
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'
import Select from 'react-select';
import { LANGUAGES, manageActions } from '../../../utils/constant'
import { getDetailDoctorByIdService } from '../../../services/userService'
const mdParser = new MarkdownIt

class ManageDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contentHTML: '',
            selectedDoctor: null,
            contentMarkdown: '',
            description: '',
            listAllDoctors: [],
            hasOldData: false,


        }
    }
    componentDidMount() {
        this.props.fetchAllDoctors()
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInput(this.props.allDoctors)
            this.setState({
                listAllDoctors: dataSelect
            })
        }
        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInput(this.props.allDoctors)
            this.setState({
                listAllDoctors: dataSelect
            })
        }

    }
    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentHTML: html,
            contentMarkdown: text
        })
    }
    handleSaveContent = () => {
        let { hasOldData } = this.state;
        this.props.saveDetailDoctor({
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            doctorId: this.state.selectedDoctor.value,
            action: hasOldData === true ? 'EDIT' : 'CREATE' // Thêm dòng này
        });
    }
    handleChange = async (selectedDoctor) => {
        this.setState({ selectedDoctor });
        console.log('this.state.selectedDoctor selectedDoctor', selectedDoctor);
        let res = await getDetailDoctorByIdService(selectedDoctor.value);

        if (res && res.errCode === 0 && res.data && res.data.markdownData) {
            let markdown = res.data.markdownData;
            this.setState({
                description: markdown.description || '',
                contentHTML: markdown.contentHTML || '',
                contentMarkdown: markdown.contentMarkdown || '',
                hasOldData: true // Đã có dữ liệu cũ 
            });
        } else {
            this.setState({
                description: '',
                contentHTML: '',
                contentMarkdown: '',
                hasOldData: false // Chưa có dữ liệu, sẽ là lưu mới
            });
        }
    }
    handleChangeDes = (event) => {
        this.setState({
            description: event.target.value
        })
    }
    buildDataInput = (dataInput) => {
        let result = [];
        let { language } = this.props;

        if (dataInput && dataInput.length > 0) {
            dataInput.map((item) => {
                let object = {};
                let labelVi = `${item.lastName} ${item.firstName}`;
                let labelEn = `${item.firstName} ${item.lastName}`;

                object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                object.value = item.id;

                result.push(object);
            });
        }

        return result;
    }
    render() {
        console.log('check state this state list All Doctors', this.state.listAllDoctors)
        console.log('this.props.allDoctors', this.props.allDoctors)
        return (
            <React.Fragment>
                <div className='manage-doctor-container'>
                    <div className='manage-doctor-title'>Quản lý bác sĩ</div>
                    <div className='more_info'>
                        <div className='content-left form-group'>
                            <label>Thống tin bác sĩ</label>
                            <textarea
                                className='form-control'
                                value={this.state.description}
                                onChange={(e) => this.handleChangeDes(e)}
                            />
                        </div>
                        <div className='content-right form-group'>
                            <label>Chọn bác sĩ</label>
                            {/* <input className="form-control">
                            </input> */}
                            <Select
                                classNamePrefix="apple-select"
                                value={this.state.selectedDoctor}
                                onChange={this.handleChange}
                                options={this.state.listAllDoctors}
                            />
                        </div>
                    </div>
                </div>

                <div className="manage-doctor-editor">
                    <MdEditor
                        style={{ height: '500px' }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={this.state.contentMarkdown}
                    />
                </div>
                <div className="save-content">
                    <button type="button" className="btn btn-primary"
                        onClick={() => { this.handleSaveContent() }}
                    >
                        {this.state.hasOldData === true ? <span>Edit</span> : <span>Create</span>}

                    </button>
                </div>

            </React.Fragment>
        );
    }

}

const mapStateToProps = state => {
    return {
        // listUsers: state.admin.users,
        // editUser: state.admin.editUser
        allDoctors: state.admin.allDoctors,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        // fetchUserRedux: () => dispatch(action.fetchAllUserStart()),
        // deleteUserRedux: (id) => dispatch(action.deleteUser(id)),
        fetchAllDoctors: () => dispatch(action.fetchAllDoctors()),
        // editUserRedux: (user) => dispatch(action.editUser(user))
        saveDetailDoctor: (data) => dispatch(action.saveDetailDoctor(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
