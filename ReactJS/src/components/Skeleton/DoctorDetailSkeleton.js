import React from 'react';
import './Skeleton.scss';

const DoctorDetailSkeleton = () => {
    return (
        <div className="doctor-detail-skeleton-container">
            <div className="intro-doctor-skeleton">
                <div className="skeleton skeleton-avatar"></div>
                <div className="content-right">
                    <div className="skeleton skeleton-title"></div>
                    <div className="skeleton skeleton-text" style={{ width: '90%' }}></div>
                    <div className="skeleton skeleton-text" style={{ width: '85%' }}></div>
                    <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
                </div>
            </div>
            
            <div className="schedule-doctor-skeleton">
                <div className="skeleton skeleton-box"></div>
                <div className="skeleton skeleton-box"></div>
            </div>

            <div className="detail-info-doctor-skeleton">
                <div className="skeleton skeleton-title" style={{ width: '200px' }}></div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text" style={{ width: '95%' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '90%' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '30%' }}></div>
            </div>
        </div>
    );
};

export default DoctorDetailSkeleton;
