import React, { Component } from 'react';
import { connect } from "react-redux";
import { getScheduleByDate } from '../../../services/userService'
import { LANGUAGES } from '../../../utils/constant'
import './ExtraInforDoctor.scss'
import { withRouter } from 'react-router'; // hoặc 'react-router-dom'
import { FormattedMessage } from 'react-intl';
class ExtraInforDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowDetailInfor: false
        }
    }


    async componentDidMount() {

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {

    }
    showHideDetailInfor = () => {
        this.stateState(
            {
                isShowDetailInfor: !isShowDetailInfor
            }
        )
    }
    render() {
        let { isShowDetailInfor } = this.state
        return (
            <React.Fragment>
                <div className="extra-infor-doctor">
                    <div className="content-up">
                        <div className="text-address">a</div>
                        <div className="name-clinic">a</div>
                        <div className="detail-address">a</div>

                    </div>
                    <div className="content-donw">

                        {isShowDetailInfor === false ? <div className="short-infor">


                            <span onClick={this.showHideDetailInfor(true)}>More</span>
                        </div> :
                            <>
                                <div className="title-price">Price</div>
                                <div className="detail-infor">b</div>
                                <div className="price">
                                    <span className="left">
                                        Price
                                    </span>
                                    <span className="right">
                                        150000
                                    </span>
                                </div>
                                <div className="note">
                                </div>
                                <div className="payment">
                                </div>
                                <div className="hide-price">
                                    <span onClick={this.showHideDetailInfor(false)}
                                    >Hide</span>

                                </div>
                            </>
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
        // ExtraInforDoctor: state.admin.ExtraInforDoctor

    };
};

const mapDispatchToProps = dispatch => {
    return {

        // getExtraInforDoctor: (id) => dispatch(action.getExtraInforDoctor(id))
    };
};

// import { withRouter } from 'react-router'; // hoặc 'react-router-dom'
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ExtraInforDoctor));
