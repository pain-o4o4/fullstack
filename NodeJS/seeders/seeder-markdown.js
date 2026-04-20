'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Get Doctor ID
        const doctors = await queryInterface.sequelize.query(
            "SELECT id FROM User WHERE email = 'doctor@gmail.com' LIMIT 1;"
        );
        if (doctors[0].length === 0) return;
        const doctorId = doctors[0][0].id;

        // Check if exists
        const exists = await queryInterface.sequelize.query(
            `SELECT id FROM markdowns WHERE doctorId = ${doctorId} LIMIT 1;`
        );

        if (exists[0].length === 0) {
            return queryInterface.bulkInsert('markdowns', [
                {
                    doctorId: doctorId,
                    description: 'Bác sĩ chuyên khoa Cơ Xương Khớp cấp cao.',
                    contentHTML: '<p>Đây là thông tin giới thiệu chi tiết về bác sĩ chuyên khoa cơ xương khớp...</p>',
                    contentMarkdown: 'Đây là thông tin giới thiệu chi tiết về bác sĩ chuyên khoa cơ xương khớp...',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ]);
        }
    },

    down: async (queryInterface, Sequelize) => {
        // Skip deletion in down
    }
};