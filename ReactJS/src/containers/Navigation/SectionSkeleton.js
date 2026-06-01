import React from 'react';

export const SectionSkeleton = ({ items = 4 }) => {
    return (
        <div className="section-skeleton">
            <div className="skeleton-header">
                <div className="skeleton-title"></div>
                <div className="skeleton-actions">
                    <div className="skeleton-btn-nav"></div>
                    <div className="skeleton-btn-nav"></div>
                    <div className="skeleton-btn-more"></div>
                </div>
            </div>
            <div className="skeleton-body">
                {[...Array(items)].map((_, index) => (
                    <div className="skeleton-card" key={index}>
                        <div className="skeleton-card-img"></div>
                        <div className="skeleton-card-content">
                            <div className="skeleton-card-line short"></div>
                            <div className="skeleton-card-line"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SectionSkeleton;
