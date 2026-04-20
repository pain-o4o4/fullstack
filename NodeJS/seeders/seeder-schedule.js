'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Xóa dữ liệu cũ để tránh trùng lặp
        await queryInterface.bulkDelete('schedules', null, {});

        return queryInterface.bulkInsert('schedules', [
            {
                currentNumber: 0,
                maxNumber: 10,
                date: '1713024000000',
                timeType: 'T1',
                doctorId: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('schedules', null, {});
    }
};