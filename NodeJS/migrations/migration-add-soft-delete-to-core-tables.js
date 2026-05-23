'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableNames = ['User', 'Specialties', 'Clinic', 'handbooks', 'bookings'];

        for (const tableName of tableNames) {
            const tableDefinition = await queryInterface.describeTable(tableName);
            if (!tableDefinition.deletedAt) {
                await queryInterface.addColumn(tableName, 'deletedAt', {
                    type: Sequelize.DATE,
                    allowNull: true,
                });
            }
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableNames = ['User', 'Specialties', 'Clinic', 'handbooks', 'bookings'];

        for (const tableName of tableNames) {
            const tableDefinition = await queryInterface.describeTable(tableName);
            if (tableDefinition.deletedAt) {
                await queryInterface.removeColumn(tableName, 'deletedAt');
            }
        }
    }
};
