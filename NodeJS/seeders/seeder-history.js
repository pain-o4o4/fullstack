'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Xóa dữ liệu cũ để tránh trùng lặp
        await queryInterface.bulkDelete('Histories', null, {});

        return queryInterface.bulkInsert('Histories', [
            {
                patientId: 3,
                doctorId: 2,
                description: 'Khám sức khỏe tổng quát định kỳ',
                file: '',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Histories', null, {});
    }
};