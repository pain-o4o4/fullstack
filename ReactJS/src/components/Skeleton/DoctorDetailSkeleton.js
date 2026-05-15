import React from 'react';
import './Skeleton.scss';

const DoctorDetailSkeleton = () => {
    return (
        <div className="doctor-detail-skeleton-container">
            <div className="intro-doctor-skeleton">
                <div className="content-left skeleton skeleton-avatar"></div>
                <div className="content-right">
                    <div className="skeleton skeleton-title"></div>
                    <div className="skeleton skeleton-text"></div>
                    <div className="skeleton skeleton-text"></div>
                    <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
                </div>
            </div>
            <div className="schedule-doctor-skeleton" style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                <div className="content-left skeleton" style={{ flex: 1, height: '200px' }}></div>
                <div className="content-right skeleton" style={{ flex: 1, height: '200px' }}></div>
            </div>
            <div className="detail-info-doctor-skeleton" style={{ marginTop: '20px' }}>
                <div className="skeleton skeleton-title" style={{ width: '30%' }}></div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text" style={{ width: '90%' }}></div>
            </div>
        </div>
    );
};

export default DoctorDetailSkeleton;
