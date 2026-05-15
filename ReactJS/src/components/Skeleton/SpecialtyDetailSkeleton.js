import React from 'react';
import './Skeleton.scss';

const SpecialtyDetailSkeleton = () => {
    return (
        <div className="specialty-detail-skeleton-container">
            <div className="skeleton banner-skeleton"></div>
            
            <div className="info-skeleton">
                <div className="skeleton skeleton-title"></div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text" style={{ width: '90%' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
            </div>

            <div className="doctor-list-skeleton">
                <div className="skeleton skeleton-title" style={{ width: '250px', marginBottom: '30px' }}></div>
                {[1, 2, 3].map((item) => (
                    <div key={item} className="each-doctor-skeleton">
                        <div className="skeleton doc-left"></div>
                        <div className="doc-right">
                            <div className="skeleton skeleton-title" style={{ width: '40%' }}></div>
                            <div className="skeleton skeleton-text"></div>
                            <div className="skeleton skeleton-text" style={{ width: '70%' }}></div>
                            <div className="skeleton skeleton-btn" style={{ marginTop: '10px' }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SpecialtyDetailSkeleton;
