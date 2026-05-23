import React, { Component } from 'react';
import { withRouter } from '../Navigator';
import './CustomBreadcrumb.scss';

class CustomBreadcrumb extends Component {
    handleNavigate = (link) => {
        if (link && this.props.navigate) {
            this.props.navigate(link);
        }
    }

    render() {
        let { items } = this.props;
        return (
            <div className="breadcrumb-container">
                <div className="breadcrumb">
                    {items && items.length > 0 && items.map((item, index) => {
                        let isLast = index === items.length - 1;
                        return (
                            <React.Fragment key={index}>
                                <span 
                                    className={`${isLast ? "current-page" : "home-link"} ${item.link ? "clickable" : ""}`}
                                    onClick={() => this.handleNavigate(item.link)}
                                >
                                    {item.label}
                                </span>
                                {!isLast && <span className="separator"><i className="fas fa-chevron-right"></i></span>}
                            </React.Fragment>
                        )
                    })}
                </div>
            </div>
        );
    }
}

export default withRouter(CustomBreadcrumb);
