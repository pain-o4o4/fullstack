import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from '../../components/Navigator';
import * as actions from '../../store/actions';
import HomeHeader from '../HomePage/HomeHeader';
import HomeFooter from '../HomePage/HomeFooter';
import CustomBreadcrumb from '../../components/CustomBreadcrumb/CustomBreadcrumb';
import { FormattedMessage } from 'react-intl';
import './AllHandbook.scss';

const PAGE_SIZE = 6; // Number of articles shown in grid per load

// Helper: format date from DB createdAt/updatedAt
const formatDate = (createdAt, updatedAt) => {
    const now = new Date();
    const created = createdAt ? new Date(createdAt) : null;
    const updated = updatedAt ? new Date(updatedAt) : null;
    const latest = updated || created;
    if (!latest) return 'Cẩm nang';

    const diffDays = Math.floor((now - latest) / (1000 * 60 * 60 * 24));
    const dateStr = latest.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    if (diffDays <= 7) return ` ${dateStr}`;
    if (diffDays <= 30) return ` ${dateStr}`;
    return dateStr;
};

class AllHandbook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataHandbook: [],
            visibleCount: PAGE_SIZE
        };
    }

    componentDidMount() {
        if (!this.props.allHandbooks || this.props.allHandbooks.length === 0) {
            this.props.fetchAllHandbooks();
        } else {
            this.processData(this.props.allHandbooks);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.allHandbooks !== this.props.allHandbooks) {
            this.processData(this.props.allHandbooks);
        }
    }

    processData = (apiData) => {
        if (!apiData) return;
        const formatted = apiData.map(item => ({
            ...item,
            date: formatDate(item.createdAt, item.updatedAt),
            description: item.descriptionMarkdown
                ? item.descriptionMarkdown.replace(/[#*`]/g, '').substring(0, 140) + '...'
                : 'Bài viết chuyên sâu từ BookingCare chia sẻ các kiến thức y khoa hữu ích.',
            category: item.category || 'Cẩm nang y tế'
        }));
        this.setState({ dataHandbook: formatted });
    }

    handleViewDetail = (id) => {
        if (!id) return;
        this.props.navigate(`/detail-handbook/${id}`);
    }

    handleLoadMore = () => {
        const { visibleCount } = this.state;
        const allGridArticles = this.state.dataHandbook.slice(4);
        if (visibleCount >= allGridArticles.length) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            this.setState({ visibleCount: visibleCount + PAGE_SIZE });
        }
    }

    render() {
        const { dataHandbook, visibleCount } = this.state;

        const hasEnoughDataForHero = dataHandbook.length >= 4;
        const featuredArticle = hasEnoughDataForHero ? dataHandbook[0] : null;
        const sideArticles = hasEnoughDataForHero ? dataHandbook.slice(1, 4) : [];
        const allGridArticles = hasEnoughDataForHero ? dataHandbook.slice(4) : dataHandbook;
        const gridArticles = allGridArticles.slice(0, visibleCount);
        const hasMore = visibleCount < allGridArticles.length;

        return (
            <div className="handbook-page-wrapper">
                <HomeHeader isShowBanner={false} />
                <CustomBreadcrumb
                    items={[
                        { label: <FormattedMessage id="homepage.home" />, link: '/home' },
                        { label: <FormattedMessage id="homeheader.Handbook" /> }
                    ]}
                />

                <div className="hb-main-content">
                    {/* Hero Section: 1 featured left + 3 side right */}
                    {hasEnoughDataForHero && (
                        <div className="hb-hero-section">
                            <div className="hb-featured-article" onClick={() => this.handleViewDetail(featuredArticle.id)}>
                                <div className="article-image-wrapper">
                                    <div className="article-image" style={{ backgroundImage: `url(${featuredArticle.image})` }}></div>
                                    <div className="article-category-tag">{featuredArticle.category}</div>
                                </div>
                                <div className="article-content">
                                    <div className="article-meta">{featuredArticle.date}</div>
                                    <div className="article-title large">{featuredArticle.name}</div>
                                    <div className="article-excerpt">{featuredArticle.description}</div>
                                    <div className="article-read-more">Đọc tiếp <i className="fas fa-arrow-right"></i></div>
                                </div>
                            </div>

                            <div className="hb-side-articles">
                                {sideArticles.map((article, index) => (
                                    <div key={index} className="hb-side-card" onClick={() => this.handleViewDetail(article.id)}>
                                        <div className="side-image" style={{ backgroundImage: `url(${article.image})` }}></div>
                                        <div className="side-content">
                                            <div className="article-category-tag small">{article.category}</div>
                                            <div className="article-title small">{article.name}</div>
                                            <div className="article-meta">{article.date}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}



                    {/* Grid Articles */}
                    <div className="hb-grid-section">
                        <div className="hb-section-title">Bài viết mới nhất</div>
                        <div className="hb-articles-grid">
                            {gridArticles.map((article, index) => (
                                <div key={index} className="hb-grid-card" onClick={() => this.handleViewDetail(article.id)}>
                                    <div className="grid-image-wrapper">
                                        <div className="grid-image" style={{ backgroundImage: `url(${article.image})` }}></div>
                                        <div className="article-category-tag">{article.category}</div>
                                    </div>
                                    <div className="grid-content">
                                        <div className="article-meta">{article.date}</div>
                                        <div className="article-title medium">{article.name}</div>
                                        <div className="article-excerpt">{article.description}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {allGridArticles.length > 0 && (
                            <div className="hb-load-more-wrapper">
                                <button className="hm-button outline" onClick={this.handleLoadMore}>
                                    {hasMore
                                        ? `Xem thêm ${Math.min(PAGE_SIZE, allGridArticles.length - visibleCount)} bài viết`
                                        : 'Lên đầu trang ↑'
                                    }
                                </button>
                                <div className="hb-count-label">
                                    Hiển thị {Math.min(visibleCount, allGridArticles.length)} / {allGridArticles.length} bài viết
                                </div>
                            </div>
                        )}
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
        allHandbooks: state.admin.allHandbooks
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllHandbooks: () => dispatch(actions.fetchAllHandbooks())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AllHandbook));
