import React, { Component } from 'react';
import { connect } from "react-redux";
import * as action from '../../../store/actions'
import { LANGUAGES } from '../../../utils/constant'
import { withRouter } from '../../../components/Navigator';
import { FormattedMessage } from 'react-intl';
import './DetailSpecialty.scss'
import HomeHeader from '../../HomePage/HomeHeader';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import ScheduleDoctor from '../Doctor/ScheduleDoctor';
import ExtraInforDoctor from '../Doctor/ExtraInforDoctor';
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/CustomBreadcrumb';
import HomeFooter from '../../HomePage/HomeFooter';
import { getAllSpecialtyService } from '../../../services/userService';
import _ from 'lodash';

class DetailSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataDetailSpecialty: {},
            arrDoctorId: [],
            listOtherSpecialties: [],
            currentPage: 1,
            itemsPerPage: 6
        }
    }

    async componentDidMount() {
        if (this.props.params && this.props.params.id) {
            let id = this.props.params.id;
            await this.props.getDetailSpecialtyById(id);
            await this.fetchAllSpecialties();
        }
    }

    fetchAllSpecialties = async () => {
        let res = await getAllSpecialtyService();
        if (res && res.errCode === 0) {
            this.setState({
                listOtherSpecialties: res.data || []
            });
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.detailSpecialty !== prevProps.detailSpecialty) {
            let data = this.props.detailSpecialty;
            if (data && !_.isEmpty(data)) {
                this.setState({
                    dataDetailSpecialty: data,
                    arrDoctorId: data.doctorSpecialty ? data.doctorSpecialty : []
                });
            }
        }
        if (this.props.params && this.props.params.id && this.props.params.id !== prevProps.params.id) {
            let id = this.props.params.id;
            await this.props.getDetailSpecialtyById(id);
            this.setState({ currentPage: 1 });
            window.scrollTo(0, 0);
        }
    }

    handleViewOtherSpecialty = (specialtyId) => {
        if (this.props.navigate) {
            this.props.navigate(`/detail-specialty/${specialtyId}`);
        }
    }

    handleViewDetailDoctor = (doctorId) => {
        if (this.props.navigate) {
            this.props.navigate(`/detail-doctor/${doctorId}`)
        }
    }

    handlePageChange = (page) => {
        this.setState({ currentPage: page });
        const section = document.querySelector('.other-specialties-section');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    renderPagination = (totalItems) => {
        const { currentPage, itemsPerPage } = this.state;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        if (totalPages <= 1) return null;

        let pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return (
            <div className="pagination-container">
                <button
                    className="btn-pagination"
                    disabled={currentPage === 1}
                    onClick={() => this.handlePageChange(currentPage - 1)}
                >
                    <i className="fas fa-chevron-left"></i>
                </button>

                {startPage > 1 && <span className="pagination-ellipsis">...</span>}

                {pages.map(page => (
                    <button
                        key={page}
                        className={`btn-pagination ${currentPage === page ? 'active' : ''}`}
                        onClick={() => this.handlePageChange(page)}
                    >
                        {page}
                    </button>
                ))}

                {endPage < totalPages && <span className="pagination-ellipsis">...</span>}

                <button
                    className="btn-pagination"
                    disabled={currentPage === totalPages}
                    onClick={() => this.handlePageChange(currentPage + 1)}
                >
                    <i className="fas fa-chevron-right"></i>
                </button>
            </div>
        );
    }

    render() {
        let { dataDetailSpecialty, arrDoctorId, listOtherSpecialties, currentPage, itemsPerPage } = this.state;
        
        const filteredSpecialties = listOtherSpecialties.filter(item => item.id !== +this.props.params.id);
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = filteredSpecialties.slice(indexOfFirstItem, indexOfLastItem);

        return (
            <React.Fragment>
                <div className="detail-specialty-container">
                    <HomeHeader />
                    <CustomBreadcrumb 
                        items={[
                            { label: <FormattedMessage id="homeheader.booking" />, link: '/select-service' },
                            { label: <FormattedMessage id="homeheader.MedicalSpecialty" />, link: '/all-specialty' },
                            { label: dataDetailSpecialty?.name || 'Chi tiết chuyên khoa' }
                        ]} 
                    />
                    <div className="detail-specialty-body">
                        {dataDetailSpecialty && dataDetailSpecialty.image && (
                            <div
                                className="specialty-banner"
                                style={{ backgroundImage: `url(${dataDetailSpecialty.image})` }}
                            >
                                <div className="banner-overlay">
                                    <div className="specialty-name">{dataDetailSpecialty.name}</div>
                                </div>
                            </div>
                        )}

                        <div className="description-specialty">
                            {dataDetailSpecialty && !_.isEmpty(dataDetailSpecialty) && (
                                <div dangerouslySetInnerHTML={{ __html: dataDetailSpecialty.descriptionHTML }}></div>
                            )}
                        </div>

                        <div className="specialty-doctor-list">
                            <div className="list-title">
                                <FormattedMessage id="specialty-detail.title" />
                            </div>
                            {arrDoctorId && arrDoctorId.length > 0 ?
                                arrDoctorId.map((item, index) => {
                                    return (
                                        <div className="each-doctor" key={index}>
                                            <div
                                                className="dt-content-left"
                                                onClick={() => {
                                                    this.handleViewDetailDoctor(item.doctorId)
                                                }}
                                            >
                                                <ProfileDoctor
                                                    doctorId={item.doctorId}
                                                    isShowDescription={true}
                                                    isShowLinkDetail={true}
                                                    isShowPrice={false}
                                                />
                                            </div>
                                            <div className="dt-content-right">
                                                <div className="doctor-extra-info">
                                                    <ExtraInforDoctor doctorIdFromParent={item.doctorId} />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                                : <div className="no-data">
                                    <FormattedMessage id="specialty-detail.no-doctor" />
                                </div>
                            }
                        </div>

                        {filteredSpecialties && filteredSpecialties.length > 0 && (
                            <div className="other-specialties-section">
                                <div className="other-title">
                                    <FormattedMessage id="homepage.specialty-popular" defaultMessage="Chuyên khoa khác" />
                                </div>
                                <div className="other-list">
                                    {currentItems.map((item, index) => (
                                        <div 
                                            className="other-item" 
                                            key={index}
                                            onClick={() => this.handleViewOtherSpecialty(item.id)}
                                        >
                                            <div 
                                                className="specialty-img"
                                                style={{ backgroundImage: `url(${item.image})` }}
                                            ></div>
                                            <div className="specialty-info">
                                                <div className="specialty-name">{item.name}</div>
                                                <div className="specialty-desc-small">Chuyên khoa uy tín</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {this.renderPagination(filteredSpecialties.length)}
                            </div>
                        )}
                    </div>
                </div>
                <HomeFooter />
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        detailSpecialty: state.admin.detailSpecialty
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getDetailSpecialtyById: (id) => dispatch(action.getDetailSpecialtyById(id))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty));
