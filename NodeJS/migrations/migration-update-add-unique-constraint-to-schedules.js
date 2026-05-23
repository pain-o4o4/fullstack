'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addConstraint('schedules', {
            fields: ['doctorId', 'date', 'timeType'],
            type: 'unique',
            name: 'unique_doctor_date_time'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeConstraint('schedules', 'unique_doctor_date_time');
    }
};
