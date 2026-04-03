import React, { Component } from 'react';
import { connect } from "react-redux";
import { useHistory } from 'react-router-dom'
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../../utils/constant'
import './DetailDoctor.scss'
import HomeHeader from '../../HomePage/HomeHeader';
import * as action from '../../../store/actions'
class DetailDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailDoctor: {}
        }
    }
    componentDidMount() {
        if (this.props.match && this.props.match.params.id) {
            let id = this.props.match.params.id;
            console.log(id);
        }
        if (this.props.match && this.props.match.params.id) {
            let id = this.props.match.params.id;
            this.props.getDetailDoctor(id);
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.detailDoctor !== this.props.detailDoctor) {
            this.setState({
                detailDoctor: this.props.detailDoctor
            })
        }
    }
    render() {
        let { detailDoctor } = this.state;
        let { language } = this.props;
        let nameVi = '', nameEn = '';

        if (detailDoctor && detailDoctor.positionData) {
            nameVi = `${detailDoctor.positionData.valueVi}, ${detailDoctor.lastName} ${detailDoctor.firstName}`;
            nameEn = `${detailDoctor.positionData.valueEn}, ${detailDoctor.firstName} ${detailDoctor.lastName}`;
        }

        console.log(this.props.match.params.id)
        return (
            <React.Fragment>
                <HomeHeader isShowBanner={true} />
                <div className='doctor-detail-container'>
                    <div className='intro-doctor'>
                        <div className='content-left'
                            style={{ backgroundImage: `url(${detailDoctor && detailDoctor.image ? detailDoctor.image : ''})` }}>
                        </div>
                        <div className='content-right'>
                            <div className='up'>
                                {language === LANGUAGES.VI ? nameVi : nameEn}
                            </div>
                            <div className='down'>
                                {detailDoctor && detailDoctor.markdownData && detailDoctor.markdownData.description
                                    && <span>{detailDoctor.markdownData.description}</span>
                                }
                            </div>
                        </div>
                    </div>

                    {/* Hiển thị nội dung Markdown bằng dangerouslySetInnerHTML */}
                    <div className='detail-info-doctor'>
                        {detailDoctor && detailDoctor.markdownData && detailDoctor.markdownData.contentHTML
                            && <div dangerouslySetInnerHTML={{ __html: detailDoctor.markdownData.contentHTML }}></div>
                        }
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        detailDoctor: state.admin.detailDoctor

    };
};

const mapDispatchToProps = dispatch => {
    return {

        getDetailDoctor: (id) => dispatch(action.getDetailDoctor(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
