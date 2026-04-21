import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './DetailHandbook.scss';
import HomeHeader from '../../HomePage/HomeHeader';
import { getDetailHandbookByIdService } from '../../../services/userService';
import _ from 'lodash';

class DetailHandbook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataDetailHandbook: {}
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let res = await getDetailHandbookByIdService(id);
            if (res && res.errCode === 0) {
                this.setState({
                    dataDetailHandbook: res.data
                })
            }
        }
    }

    render() {
        let { dataDetailHandbook } = this.state;
        return (
            <div className="detail-handbook-container">
                <HomeHeader />
                <div className="detail-handbook-body">
                    {dataDetailHandbook && !_.isEmpty(dataDetailHandbook) &&
                        <>
                            <div className="description-handbook">
                                {dataDetailHandbook.name}
                            </div>
                            <div dangerouslySetInnerHTML={{ __html: dataDetailHandbook.descriptionHTML }}>
                            </div>
                        </>
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailHandbook);
