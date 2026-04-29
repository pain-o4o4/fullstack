import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader';
import _ from 'lodash';
import './DetailHandbook.scss';
import * as action from '../../../store/actions'
import { withRouter } from '../../../components/Navigator';
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/CustomBreadcrumb';
import { FormattedMessage } from 'react-intl';
import HomeFooter from '../../HomePage/HomeFooter';

class DetailHandbook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataDetailHandbook: this.props.detailHandbook || {}
        }
    }

    async componentDidMount() {
        if (this.props.params && this.props.params.id) {
            let id = this.props.params.id;
            this.props.getDetailHandbookById(id);
        }
        // Lấy danh sách tất cả cẩm nang để làm phần gợi ý
        this.props.fetchAllHandbooks();
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.detailHandbook !== prevProps.detailHandbook) {
            let data = this.props.detailHandbook;
            if (data && data.image) {
                if (typeof data.image === 'string' && !data.image.startsWith('data:')) {
                    data.image = `data:image/jpeg;base64,${data.image}`;
                }
            }
            this.setState({
                dataDetailHandbook: data
            })
        }

        // Khi bấm vào bài viết gợi ý (ID thay đổi) -> Cuộn lên đầu và fetch data mới
        if (this.props.params.id !== prevProps.params.id) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.props.getDetailHandbookById(this.props.params.id);
        }
    }

    render() {
        let { dataDetailHandbook } = this.state;
        let { language } = this.props;

        if (_.isEmpty(dataDetailHandbook)) {
            return (
                <div className="detail-handbook-container">
                    <HomeHeader />
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>{language === 'vi' ? 'Đang tải nội dung...' : 'Loading content...'}</p>
                    </div>
                </div>
            )
        }

        const breadcrumbItems = [
            { label: language === 'vi' ? 'Trang chủ' : 'Home', link: '/' },
            { label: language === 'vi' ? 'Cẩm nang' : 'Handbook', link: '/all-handbook' },
            { label: dataDetailHandbook.name }
        ];

        return (
            <div className="detail-handbook-container">
                <HomeHeader isShowBanner={false} />
                <CustomBreadcrumb items={breadcrumbItems} />

                <div className="detail-handbook-body">
                    <div className="handbook-hero" style={{ backgroundImage: `url(${dataDetailHandbook.image})` }}>
                        <div className="hero-overlay">
                            <div className="hero-content">
                                <h1 className="handbook-title">{dataDetailHandbook.name}</h1>
                                <div className="handbook-meta-hero">
                                    <span className="category-tag">{language === 'vi' ? 'Sức khỏe' : 'Health'}</span>
                                    <span className="read-time"><i className="far fa-clock"></i> 5 {language === 'vi' ? 'phút đọc' : 'min read'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="content-wrapper">
                        <article className="main-article">
                            <div className="article-header">
                                <div className="author-info">
                                    <div className="author-avatar">
                                        <i className="fas fa-user-md"></i>
                                    </div>
                                    <div className="author-details">
                                        <span className="author-name">BookingCare Editorial Team</span>
                                        <span className="publish-date">{language === 'vi' ? 'Cập nhật lần cuối: ' : 'Last updated: '} 21/04/2026</span>
                                    </div>
                                </div>
                                <div className="social-share">
                                    <button title="Share on Facebook"><i className="fab fa-facebook-f"></i></button>
                                    <button title="Share on Twitter"><i className="fab fa-twitter"></i></button>
                                    <button title="Copy Link"><i className="fas fa-link"></i></button>
                                </div>
                            </div>

                            <hr className="header-divider" />

                            <div className="article-content" dangerouslySetInnerHTML={{ __html: dataDetailHandbook.descriptionHTML }}>
                            </div>

                            <div className="article-footer">
                                <div className="tags-section">
                                    <span className="tag">#HealthCare</span>
                                    <span className="tag">#MedicalAdvice</span>
                                    <span className="tag">#BookingCare</span>
                                </div>
                            </div>
                        </article>

                        <aside className="article-sidebar">
                            <div className="sidebar-card">
                                <h3>{language === 'vi' ? 'Cẩm nang mới nhất' : 'Latest Handbooks'}</h3>
                                <div className="related-list">
                                    {this.props.allHandbooks && this.props.allHandbooks.length > 0 &&
                                        this.props.allHandbooks
                                            .filter(item => item.id !== dataDetailHandbook.id)
                                            .slice(0, 5)
                                            .map((item, index) => {
                                                return (
                                                    <div key={index} className="related-item" onClick={() => this.props.navigate(`/detail-handbook/${item.id}`)}>
                                                        <div className="related-img" style={{ backgroundImage: `url(${item.image})` }}></div>
                                                        <div className="related-info">
                                                            <h4>{item.name}</h4>
                                                            <span><i className="far fa-calendar-alt"></i> 21/04/2026</span>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                    }
                                </div>
                            </div>
                        </aside>
                    </div>

                    {/* SUGGESTED SECTION AT BOTTOM */}
                    <div className="suggested-handbooks">
                        <div className="suggested-header">
                            <h2>{language === 'vi' ? 'Có thể bạn quan tâm' : 'You might also like'}</h2>
                            <button className="view-all-btn" onClick={() => this.props.navigate('/all-handbook')}>
                                {language === 'vi' ? 'Xem tất cả' : 'View all'} <i className="fas fa-arrow-right"></i>
                            </button>
                        </div>
                        <div className="suggested-grid">
                            {this.props.allHandbooks && this.props.allHandbooks.length > 0 &&
                                this.props.allHandbooks
                                    .filter(item => item.id !== dataDetailHandbook.id)
                                    .sort(() => 0.5 - Math.random()) // Random bài viết
                                    .slice(0, 4)
                                    .map((item, index) => {
                                        return (
                                            <div key={index} className="suggested-card" onClick={() => this.props.navigate(`/detail-handbook/${item.id}`)}>
                                                <div className="card-image" style={{ backgroundImage: `url(${item.image})` }}>
                                                    <span className="card-tag">{language === 'vi' ? 'Sức khỏe' : 'Health'}</span>
                                                </div>
                                                <div className="card-body">
                                                    <h3>{item.name}</h3>
                                                    <p>{language === 'vi' ? 'Khám phá những kiến thức y khoa bổ ích giúp bạn bảo vệ sức khỏe mỗi ngày...' : 'Discover medical knowledge to protect your health every day...'}</p>
                                                    <div className="card-footer">
                                                        <span><i className="far fa-clock"></i> 5 min read</span>
                                                        <i className="fas fa-chevron-right arrow-icon"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                            }
                        </div>
                    </div>
                </div>
                <HomeFooter />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        detailHandbook: state.admin.detailHandbook,
        allHandbooks: state.admin.allHandbooks
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getDetailHandbookById: (id) => dispatch(action.fetchDetailHandbookById(id)),
        fetchAllHandbooks: () => dispatch(action.fetchAllHandbooks())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DetailHandbook));
