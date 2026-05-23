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
            isLoading: true
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

    render() {
        const { listPrices, listSpecialties, isLoading } = this.state;

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
                    <div className="ep-grid">
                        {listSpecialties.map((item, i) => {
                            const price = listPrices[i % listPrices.length]?.valueVi || '500.000';
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
                                        {/* <p className="ep-desc">Dịch vụ khám và tư vấn chuyên sâu tại các cơ sở y tế hàng đầu.</p> */}
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
                )}
            </div>
        );
    }
}

export default withRouter(ExaminationPackages);
