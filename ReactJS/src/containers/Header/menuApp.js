export const adminMenu = [
    { // Quản lý người dùng
        name: 'menu.admin.user',
        menus: [
            { name: 'menu.admin.crud', link: '/system/user-manage' },
            { name: 'menu.admin.crud-redux', link: '/system/crud-redux' },
            { name: 'menu.admin.manage-doctor', link: '/system/manage-doctor' },
            // Admin cũng có thể quản lý kế hoạch khám bệnh
            { name: 'menu.doctor.manage-schedule', link: '/doctor/manage-schedule' },
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
];

export const doctorMenu = [
    { // Cấp Group
        name: 'menu.admin.user',
        menus: [
            { // Cấp Menu
                name: 'menu.doctor.manage-schedule',
                link: '/doctor/manage-schedule'
            },
        ]
    },
];