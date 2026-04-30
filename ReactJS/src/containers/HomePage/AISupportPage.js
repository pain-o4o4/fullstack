import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import HomeHeader from './HomeHeader';
import HomeFooter from './HomeFooter';
import CustomBreadcrumb from '../../components/CustomBreadcrumb/CustomBreadcrumb';
import './AISupportPage.scss';

class AISupportPage extends Component {
    render() {
        const { language } = this.props;
        const breadcrumbItems = [
            { label: language === 'vi' ? 'Trang chủ' : 'Home', link: '/' },
            { label: language === 'vi' ? 'Hỗ trợ AI' : 'AI Support' }
        ];

        return (
            <div className="ai-support-page">
                <HomeHeader isShowBanner={false} />
                <CustomBreadcrumb items={breadcrumbItems} />

                <HomeFooter />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

export default injectIntl(connect(mapStateToProps)(AISupportPage));
