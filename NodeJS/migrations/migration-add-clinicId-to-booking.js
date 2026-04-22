'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('bookings', 'clinicId', {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('bookings', 'clinicId');
    }
};
