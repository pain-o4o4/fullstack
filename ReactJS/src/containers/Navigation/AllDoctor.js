import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as action from '../../store/actions';
import HomeHeader from '../HomePage/HomeHeader';
import './AllDoctor.scss';

class AllDoctor extends Component {
    componentDidMount() {
        // Lấy danh sách bác sĩ nếu Redux chưa có
        if (!this.props.allDoctors || this.props.allDoctors.length === 0) {
            this.props.fetchAllDoctors();
        }
    }

    handleViewDetailDoctor = (doctor) => {
        this.props.history.push(`/detail-doctor/${doctor.id}`);
    }

    render() {
        let { allDoctors, language } = this.props;
        return (
            <div className="all-doctors-container">
                <HomeHeader />
                <div className="all-doctors-body">
                    <div className="title">Đội ngũ bác sĩ chuyên gia</div>
                    <div className="doctors-grid">
                        {allDoctors && allDoctors.length > 0 &&
                            allDoctors.map((item, index) => {
                                let nameVi = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName}`;
                                let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`;
                                return (
                                    <div key={index} className="doctor-card" onClick={() => this.handleViewDetailDoctor(item)}>
                                        <div className="avatar"
                                            style={{ backgroundImage: `url(${item.image})` }}>
                                        </div>
                                        <div className="info">
                                            <div className="name">
                                                {language === 'vi' ? nameVi : nameEn}
                                            </div>
                                            <div className="specialty">
                                                {item.Doctor_Infor && item.Doctor_Infor.specialtyData ? item.Doctor_Infor.specialtyData.name : ''}
                                            </div>
                                            <button className="btn-detail">Xem thông tin</button>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    allDoctors: state.admin.allDoctors,
    language: state.app.language
});

const mapDispatchToProps = dispatch => ({
    fetchAllDoctors: () => dispatch(action.fetchAllDoctors())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AllDoctor));