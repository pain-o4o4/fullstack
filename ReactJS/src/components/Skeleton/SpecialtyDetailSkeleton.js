import React from 'react';
import './Skeleton.scss';

const SpecialtyDetailSkeleton = () => {
    return (
        <div className="specialty-detail-skeleton-container">
            <div className="specialty-banner-skeleton skeleton" style={{ height: '300px', width: '100%' }}></div>
            <div className="description-specialty-skeleton" style={{ padding: '20px' }}>
                <div className="skeleton skeleton-title" style={{ width: '40%' }}></div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text" style={{ width: '70%' }}></div>
            </div>
            <div className="doctor-list-skeleton" style={{ padding: '20px' }}>
                <div className="skeleton skeleton-title" style={{ width: '20%' }}></div>
                {[1, 2, 3].map((item) => (
                    <div key={item} className="each-doctor-skeleton" style={{ display: 'flex', gap: '20px', marginBottom: '20px', border: '1px solid #eee', padding: '15px' }}>
                        <div className="skeleton skeleton-avatar" style={{ width: '100px', height: '100px' }}></div>
                        <div style={{ flex: 1 }}>
                            <div className="skeleton skeleton-title" style={{ width: '50%' }}></div>
                            <div className="skeleton skeleton-text"></div>
                            <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SpecialtyDetailSkeleton;
