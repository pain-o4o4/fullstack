// src/config/permissions.js

export const ROLES = {
    ADMIN: 'R1',
    DOCTOR: 'R2',
    PATIENT: 'R3'
};

// ==========================================
// DANH SÁCH API CÔNG KHAI (KHÔNG YÊU CẦU ĐĂNG NHẬP)
// ==========================================
export const PUBLIC_PATHS = [
    // Auth & Utilities
    '/api/login',
    '/api/register',
    '/api/allcode',
    
    // Xem thông tin (Trang chủ & Chi tiết)
    '/api/top-doctor-home',
    '/api/get-all-doctors',
    '/api/get-detail-doctor-by-id',
    '/api/get-schedule-doctor-by-date',
    '/api/get-extra-infor-doctor-by-id',
    '/api/get-profile-doctor-by-id',
    
    '/api/get-all-specialty',
    '/api/get-detail-specialty-by-id',
    
    '/api/get-all-clinic',
    '/api/get-detail-clinic-by-id',

    '/api/get-handbook',
    '/api/get-detail-handbook-by-id',
    
    // Luồng tương tác của khách vãng lai / webhook
    '/api/verify-book-appointment',
    '/api/payos-webhook',
    '/api/verify-payment-status'
];

// ==========================================
// DANH SÁCH PHÂN QUYỀN (CHỈ DÀNH CHO NHỮNG ROLE NÀY)
// ==========================================
export const PERMISSIONS = {
    [ROLES.ADMIN]: [
        // Quản lý Users
        '/api/get-all-users',
        '/api/edit-user',
        '/api/delete-user',
        '/api/create-new-user',
        '/api/update-patient',

        // Quản lý Bác sĩ (Admin có thể hỗ trợ)
        '/api/save-infor-doctor',
        '/api/bulk-create-schedule',

        // Quản lý Chuyên khoa
        '/api/create-new-specialty',
        '/api/delete-specialty',
        '/api/edit-specialty',

        // Quản lý Phòng khám
        '/api/create-new-clinic',
        '/api/delete-clinic',
        '/api/edit-clinic',

        // Quản lý Cẩm nang
        '/api/create-new-handbook',
        '/api/delete-handbook',
        '/api/edit-handbook'
    ],

    [ROLES.DOCTOR]: [
        '/api/save-infor-doctor',
        '/api/bulk-create-schedule',
        '/api/get-list-patient-for-doctor',
        '/api/update-booking-status'
    ],

    [ROLES.PATIENT]: [
        '/api/patient-book-appointment',
        '/api/get-all-appointments-by-id',
        '/api/get-detail-schedule-patient',
        '/api/update-patient'
    ]
};