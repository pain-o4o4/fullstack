import React, { Component } from 'react';
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
// import { LANGUAGES } from '../../../utils/constant'
import { withRouter } from 'react-router'; // hoặc 'react-router-dom'
import { FormattedMessage } from 'react-intl';
import './BookingModal.scss'
import ProfileDoctor from '../ProfileDoctor'
import _ from 'lodash';

class BookingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }


    async componentDidMount() {

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {

    }


    render() {
        let { language, isTheModalOpen, closeModal, dataTimeModal } = this.props
        let doctorId = dataTimeModal && !_.isEmpty(dataTimeModal)
            ? dataTimeModal.doctorId : '';
        console.log('dataTimeModal', dataTimeModal)
        return (
            <Modal
                isOpen={isTheModalOpen}
                className={'booking-modal'}
                size="lg"
                centered
            >
                <div className="booking-modal-content">
                    <div className="booking-modal-header">
                        <h5 className="modal-title"><FormattedMessage id="schedule-doctor.title" /></h5>
                        <button type="button" className="close">
                            <span
                                onClick={closeModal}
                                aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="booking-modal-body">
                        <ProfileDoctor
                            doctorId={doctorId}
                            isShowDescriptionDoctor={false}
                            dataTimeModal={dataTimeModal}
                        >

                        </ProfileDoctor>
                    </div>
                    <div className="booking-modal-footer">

                        <button
                            type="button"
                            className="btn btn-primary"
                            data-dismiss="modal"
                        >
                            <FormattedMessage id="schedule-doctor.cancel" />
                        </button>
                        <Button
                            type="button"
                            className="btn btn-primary"
                            data-dismiss="modal"
                        >
                            <FormattedMessage id="schedule-doctor.confirm" />
                        </Button>

                    </div>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        // // BookingModal: state.admin.BookingModal

    };
};

const mapDispatchToProps = dispatch => {
    return {

        // getBookingModal: (id) => dispatch(action.getBookingModal(id))
    };
};

// import { withRouter } from 'react-router'; // hoặc 'react-router-dom'
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BookingModal));
