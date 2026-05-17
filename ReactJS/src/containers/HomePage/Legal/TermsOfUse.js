import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../HomeHeader';
import HomeFooter from '../HomeFooter';
import './LegalPage.scss';
import * as action from '../../../store/actions';
import _ from 'lodash';

class TermsOfUse extends Component {
    componentDidMount() {
        this.props.fetchAllHandbooks();
    }

    render() {
        let { allHandbooks } = this.props;

        // Tìm bài viết có tên "Điều khoản sử dụng"
        let termsOfUse = allHandbooks && allHandbooks.length > 0
            ? allHandbooks.find(item => item.name === 'Điều khoản sử dụng')
            : null;

        let htmlContent = termsOfUse ? termsOfUse.descriptionHTML : 'Đang tải nội dung...';

        return (
            <div className="legal-page-container">
                <HomeHeader isShowBanner={false} />
                <div className="legal-page-body">
                    <div className="legal-content-wrapper">
                        <div className="legal-header">
                            <h1>Điều khoản sử dụng (Chính sách Cookie)</h1>
                            <div className="legal-meta">
                                Cập nhật lần cuối: 17 tháng 5 năm 2026
                            </div>
                        </div>
                        <div className="legal-content markdown-body" dangerouslySetInnerHTML={{ __html: htmlContent }}>
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
        allHandbooks: state.admin.allHandbooks
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllHandbooks: () => dispatch(action.fetchAllHandbooks())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TermsOfUse);
