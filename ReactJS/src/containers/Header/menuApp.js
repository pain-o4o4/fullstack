export const adminMenu = [
    { // Quản lý người dùng
        name: 'menu.admin.user',
        menus: [
            { name: 'menu.admin.crud', link: '/system/user-manage' },
            { name: 'menu.admin.manage-doctor', link: '/system/manage-doctor' },
            { name: 'menu.doctor.manage-schedule', link: '/system/manage-schedule' },
        ]
    },
    { // Quản lý chuyên khoa
        name: 'menu.admin.specialty',
        menus: [
            { name: 'menu.admin.manage-specialty', link: '/system/manage-specialty' }
        ]
    },
    { // Quản lý phòng khám
        name: 'menu.admin.clinic',
        menus: [
            { name: 'menu.admin.manage-clinic', link: '/system/manage-clinic' }
        ]
    },
    { // Quản lý cẩm nang
        name: 'menu.admin.handbook',
        menus: [
            { name: 'menu.admin.manage-handbook', link: '/system/manage-handbook' }
        ]
    },
    { // Quản lý thong tin ca nhan
        name: 'menu.admin.security',
        menus: [
            { name: 'menu.admin.information', link: '/system/patient-profile' }
        ]
    },
];

export const doctorMenu = [
    {
        name: 'menu.admin.user',
        menus: [
            { // Cấp Menu
                name: 'menu.doctor.manage-schedule',
                link: '/doctor/manage-schedule'
            },
            {
                name: 'menu.admin.manage-doctor',
                link: '/doctor/manage-doctor'
            },
        ]
    },
    {
        name: 'menu.doctor.manage-booking',
        link: '/doctor/manage-booking'
    },
    { // Quản lý thong tin ca nhan
        name: 'menu.admin.security',
        menus: [
            { name: 'menu.admin.information', link: '/system/patient-profile' }
        ]
    },
];

export const patientMenu = [
    {
        name: 'menu.admin.user',
        menus: [
            {
                name: 'menu.patient.edit-profile',
                link: '/system/patient-profile'
            }
        ]
    }
];