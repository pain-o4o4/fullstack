export const adminMenu = [
    { //user
        name: 'menu.admin.user', menus: [
            {
                name: 'menu.admin.crud', link: '/system/crud',

            }, {
                name: 'menu.admin.crud-redux', link: '/system/crud-redux',

            },
            {
                name: 'menu.admin.manage-doctor', link: '/system/manage-doctor',
                // subMenus: [
                //     { name: 'menu.system.system-administrator.user-manage', link: '/system/user-manage' },
                //     { name: 'menu.system.system-administrator.user-redux', link: '/system/user-redux' },
                //     // { name: 'menu.system.system-administrator.register-package-group-or-account', link: '/system/register-package-group-or-account' },
                // ]
            },

            {
                name: 'menu.admin.manage-admin', link: '/admin/manage-admin',

            },
        ]
    },
    { //specialty
        name: 'menu.admin.specialty', menus: [
            {
                name: 'menu.admin.manage-specialty', link: '/admin/manage-specialty',

            }
        ]
    },
    { //clinic
        name: 'menu.admin.clinic', menus: [
            {
                name: 'menu.admin.manage-clinic', link: '/admin/manage-clinic',

            }
        ]
    }, { //handbook
        name: 'menu.admin.handbook', menus: [
            {
                name: 'menu.admin.manage-handbook', link: '/admin/manage-handbook',

            }
        ]
    },
];