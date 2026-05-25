import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import search from '../../assets/images/search.svg';
import close_icon from '../../assets/images/close_icon.svg';


class ModalSearchHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    toggle = () => {
        this.props.toggleFromParent();
    }
    render() {
        return (
            <div className="modal-search-wrapper">
                <div className="search-input-container">
                    
                    <img src={search} className="icon-search" alt="icon-search" />

                    <input
                        type="text"
                        placeholder="Tìm kiếm theo từ khóa hoặc cụm từ"
                        autoFocus
                    />
                </div>
                
                <img
                    src={close_icon} // Dùng biến closeIcon đã import ở trên
                    className="icon-close-custom" // Đặt className mới để dễ viết CSS
                    alt="Close Search"
                    onClick={() => this.toggle()}
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalSearchHeader);


