// src/config/permissions.js
const ROLES = {
    ADMIN: 'R1',
    DOCTOR: 'R2',
    PATIENT: 'R3'
};

const PERMISSIONS = {
    [ROLES.ADMIN]: [
        '/api/get-all-users',
        '/api/edit-user',
        '/api/delete-user',
        '/api/create-new-user',
        '/api/allcode',
        '/api/save-infor-doctor' // Admin cũng có thể sửa thông tin bác sĩ
    ],
    [ROLES.DOCTOR]: [
        '/api/save-infor-doctor',
        '/api/bulk-create-schedule',
        '/api/get-schedule-doctor-by-date'
    ],
    [ROLES.PATIENT]: [
        '/api/patient-book-appointment'
    ]
};

// Những API mà ai cũng được vào (không cần check role)
const PUBLIC_PATHS = [
    '/api/login',
    '/api/top-doctor-home',
    '/api/get-all-doctors',
    '/api/get-detail-doctor-by-id',
    '/api/get-extra-infor-doctor-by-id',
    '/api/get-profile-doctor-by-id',
    '/api/verify-book-appointment'
];

module.exports = { PERMISSIONS, PUBLIC_PATHS, ROLES };