'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Xóa dữ liệu cũ để tránh trùng lặp
        await queryInterface.bulkDelete('doctor_clinic_specialty', null, {});

        return queryInterface.bulkInsert('doctor_clinic_specialty', [
            {
                doctorId: 2,
                clinicId: 1,
                specialtyId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('doctor_clinic_specialty', null, {});
    }
};