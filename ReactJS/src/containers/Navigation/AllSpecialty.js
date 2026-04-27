import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from '../../components/Navigator';
import * as action from '../../store/actions';
import HomeHeader from '../HomePage/HomeHeader';
import HomeFooter from '../HomePage/HomeFooter';
import CustomBreadcrumb from '../../components/CustomBreadcrumb/CustomBreadcrumb';
import { FormattedMessage } from 'react-intl';
import './AllSpecialty.scss';

class AllSpecialty extends Component {
    componentDidMount() {
        if (!this.props.allSpecialties || this.props.allSpecialties.length === 0) {
            this.props.fecthAllSpecialties();
        }
    }

    handleViewDetail = (id) => {
        this.props.navigate(`/detail-specialty/${id}`);
    }

    render() {
        let { allSpecialties } = this.props;
        return (
            <div className="all-specialty-container">
                <HomeHeader isShowBanner={false} />
                <CustomBreadcrumb
                    items={[
                        { label: <FormattedMessage id="homeheader.booking" />, link: '/select-service' },
                        { label: <FormattedMessage id="homeheader.MedicalSpecialty" /> }
                    ]}
                />



                <div className="all-specialty-body">
                    <div className="specialty-grid">
                        {allSpecialties && allSpecialties.map((item, index) => (
                            <div key={index} className="specialty-card" onClick={() => this.handleViewDetail(item.id)}>
                                <div className="card-image-wrapper">
                                    <div className="bg-image" style={{ backgroundImage: `url(${item.image})` }}></div>
                                </div>
                                <div className="card-info">
                                    <div className="name">{item.name}</div>
                                    <div className="action">Khám phá <i className="fas fa-chevron-right"></i></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <HomeFooter />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    allSpecialties: state.admin.allSpecialties
});
const mapDispatchToProps = dispatch => ({
    fecthAllSpecialties: () => dispatch(action.fecthAllSpecialties())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AllSpecialty));