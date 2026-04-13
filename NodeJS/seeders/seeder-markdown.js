'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Xóa dữ liệu cũ để tránh trùng lặp
        await queryInterface.bulkDelete('Markdown', null, {});

        return queryInterface.bulkInsert('Markdown', [
            {
                statusId: 'S1',
                doctorId: 2,
                patientId: 3,
                date: '1713024000000',
                timeType: 'T1',
                token: 'random-token-123',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Markdown', null, {});
    }
};