// Source - https://stackoverflow.com/a/62669213
// Posted by Arpit Vyas
// Retrieved 2026-03-31, License - CC BY-SA 4.0

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('User', 'image', {
                type: Sequelize.BLOB,
                allowNull: true,
            },)
        ])
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('User', 'image', {
                type: Sequelize.STRING,
                allowNull: true,
            },)
        ])
    }
};
// Source - https://stackoverflow.com/a/46357631
// Posted by Maria Ines Parnisari, modified by community. See post 'Timeline' for change history
// Retrieved 2026-03-31, License - CC BY-SA 4.0

