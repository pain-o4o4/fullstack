import React from 'react';
import './Skeleton.scss';

const ClinicDetailSkeleton = () => {
    return (
        <div className="clinic-detail-skeleton-container">
            <div className="skeleton banner-skeleton"></div>
            
            <div className="info-skeleton">
                <div className="skeleton skeleton-title" style={{ width: '50%' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '30%', height: '14px' }}></div>
                <div className="skeleton skeleton-text" style={{ marginTop: '20px' }}></div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
            </div>

            <div className="doctor-list-skeleton">
                <div className="skeleton skeleton-title" style={{ width: '220px', marginBottom: '25px' }}></div>
                {[1, 2].map((item) => (
                    <div key={item} className="each-doctor-skeleton">
                        <div className="skeleton doc-left"></div>
                        <div className="doc-right">
                            <div className="skeleton skeleton-title" style={{ width: '45%' }}></div>
                            <div className="skeleton skeleton-text"></div>
                            <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClinicDetailSkeleton;
