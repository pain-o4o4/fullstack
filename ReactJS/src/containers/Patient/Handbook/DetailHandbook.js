import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader';
import _ from 'lodash';
import './DetailHandbook.scss';
import * as action from '../../../store/actions'
import { withRouter } from '../../../components/Navigator';
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/CustomBreadcrumb';
import { FormattedMessage } from 'react-intl';

class DetailHandbook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataDetailHandbook: this.props.detailHandbook || {}
        }
    }

    async componentDidMount() {
        console.log('>>> check props DetailHandbook:', this.props)
        if (this.props.params && this.props.params.id) {
            let id = this.props.params.id;
            this.props.getDetailHandbookById(id);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
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
                                <h3>{language === 'vi' ? 'Cẩm nang liên quan' : 'Related Handbooks'}</h3>
                                <div className="related-placeholder">
                                    {/* Related items would go here */}
                                    <p>{language === 'vi' ? 'Các bài viết tương tự sẽ hiển thị tại đây.' : 'Similar articles will appear here.'}</p>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        detailHandbook: state.admin.detailHandbook
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getDetailHandbookById: (id) => dispatch(action.fetchDetailHandbookById(id))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DetailHandbook));
