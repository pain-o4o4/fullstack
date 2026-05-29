import React, { Component } from 'react';
import { withRouter } from '../../../components/Navigator';
import { getAllCodeService, getAllSpecialtyService } from '../../../services/userService';
import './ExaminationPackages.scss';

class ExaminationPackages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listPrices: [],
            listSpecialties: [],
            isLoading: true,
            currentPage: 1,
            itemsPerPage: 6
        };
    }

    async componentDidMount() {
        try {
            let [resPrice, resSpecialty] = await Promise.all([
                getAllCodeService('PRICE'),
                getAllSpecialtyService()
            ]);

            if (resPrice && resPrice.errCode === 0 && resSpecialty && resSpecialty.errCode === 0) {
                this.setState({
                    listPrices: resPrice.data,
                    listSpecialties: resSpecialty.data,
                    isLoading: false
                });
            }
        } catch (e) {
            console.error(e);
            this.setState({ isLoading: false });
        }
    }

    handleBooking = (item) => {
        // Chuyển hướng đến trang đặt lịch với ID tương ứng
        this.props.navigate(`/detail-specialty/${item.id}`);
    };

    handlePageChange = (pageNumber) => {
        this.setState({ currentPage: pageNumber });
    };

    render() {
        const { listPrices, listSpecialties, isLoading, currentPage, itemsPerPage } = this.state;

        // Pagination logic
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = listSpecialties.slice(indexOfFirstItem, indexOfLastItem);
        const totalPages = Math.ceil(listSpecialties.length / itemsPerPage);

        return (
            <div className="examination-packages">
                <div className="ep-header">
                    <button className="ep-back" onClick={this.props.onBack}>
                        <i className="fas fa-chevron-left"></i>
                        Quay lại
                    </button>
                    <h2>Danh sách <span>Gói khám & Chuyên khoa</span></h2>
                </div>

                {isLoading ? (
                    <div className="ep-loading">Đang tải dữ liệu...</div>
                ) : (
                    <>
                        <div className="ep-grid">
                            {currentItems.map((item, i) => {
                                const originalIndex = indexOfFirstItem + i;
                                const price = listPrices[originalIndex % listPrices.length]?.valueVi || '500.000';
                                return (
                                    <div key={item.id} className="ep-card">
                                        <div className="ep-image-wrapper">
                                            <div
                                                className="ep-bg-img"
                                                style={{ backgroundImage: `url(${item.image})` }}
                                            ></div>
                                            <div className="ep-icon-overlay">
                                                <i className="fas fa-stethoscope"></i>
                                            </div>
                                        </div>
                                        <div className="ep-info">
                                            <h3 className="ep-name">{item.name}</h3>
                                            
                                            <div className="ep-price">
                                                <span className="price-label">Giá khám:</span>
                                                <span className="price-value">{price} VNĐ</span>
                                            </div>
                                        </div>
                                        <button
                                            className="ep-book-btn"
                                            onClick={() => this.handleBooking(item)}
                                        >
                                            Đặt lịch ngay
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                        {totalPages > 1 && (
                            <div className="pagination-container">
                                <button 
                                    className="btn-pagination prev-btn" 
                                    onClick={() => this.handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <i className="fas fa-chevron-left"></i>
                                </button>
                                <div className="page-numbers" style={{display: 'flex', gap: '8px'}}>
                                    {[...Array(totalPages)].map((_, index) => (
                                        <button 
                                            key={index + 1}
                                            className={`btn-pagination ${currentPage === index + 1 ? 'active' : ''}`}
                                            onClick={() => this.handlePageChange(index + 1)}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                </div>
                                <button 
                                    className="btn-pagination next-btn" 
                                    onClick={() => this.handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    <i className="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    }
}

export default withRouter(ExaminationPackages);
