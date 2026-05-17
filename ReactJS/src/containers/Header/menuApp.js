export const adminMenu = [
    { // Quản lý thong tin ca nhan
        name: 'menu.admin.security',
        menus: [
            { name: 'menu.admin.information', link: '/system/patient-profile' }
        ]
    },
    { // Quản lý người dùng
        name: 'menu.admin.manage',
        menus: [
            { name: 'menu.admin.crud', link: '/system/user-manage' },
            { name: 'menu.admin.manage-doctor', link: '/system/manage-doctor' },
            { name: 'menu.doctor.manage-schedule', link: '/system/manage-schedule' },
            { name: 'menu.admin.manage-specialty', link: '/system/manage-specialty' },
            { name: 'menu.admin.manage-clinic', link: '/system/manage-clinic' },

            { name: 'menu.admin.manage-handbook', link: '/system/manage-handbook' },
            { name: 'menu.doctor.manage-booking', link: '/system/manage-booking' }, // Global management for Admin
        ]
    },
    { // Quản lý Giao tiếp
        name: 'menu.admin.template',
        menus: [
            { name: 'menu.admin.manage-quick-reply', link: '/system/manage-quick-reply' },
            { name: 'menu.admin.manage-email-template', link: '/system/manage-email-template' },
        ]
    },
];

export const doctorMenu = [
    { // Quản lý thong tin ca nhan
        name: 'menu.admin.security',
        menus: [
            { name: 'menu.admin.information', link: '/system/patient-profile' }
        ]
    },
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
            {
                name: 'menu.doctor.manage-booking',
                link: '/doctor/manage-booking'
            },
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