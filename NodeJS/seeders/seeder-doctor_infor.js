'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const doctors = await queryInterface.sequelize.query(
            `SELECT id FROM User WHERE roleId = 'R2';`
        );
        const specialties = await queryInterface.sequelize.query(
            `SELECT id FROM Specialties;`
        );
        const clinics = await queryInterface.sequelize.query(
            `SELECT id FROM Clinic;`
        );

        if (doctors[0].length > 0 && specialties[0].length > 0 && clinics[0].length > 0) {
            let infoToInsert = [];
            for (let i = 0; i < doctors[0].length; i++) {
                const doctorId = doctors[0][i].id;
                
                // Check if already exists
                const exists = await queryInterface.sequelize.query(
                    `SELECT id FROM doctor_infor WHERE doctorId = ${doctorId} LIMIT 1;`
                );

                if (exists[0].length === 0) {
                    infoToInsert.push({
                        doctorId: doctorId,
                        specialtyId: specialties[0][i % specialties[0].length].id,
                        clinicId: clinics[0][i % clinics[0].length].id,
                        priceId: 'PRI' + ((i % 7) + 1),
                        provinceId: 'PRO' + ((i % 10) + 1),
                        paymentId: 'PAY' + ((i % 3) + 1),
                        addressClinic: 'Địa chỉ phòng khám ' + (i + 1),
                        nameClinic: 'PK ' + (i + 1),
                        note: 'Ghi chú cho bác sĩ ' + (i + 1),
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });
                }
            }

            if (infoToInsert.length > 0) {
                return queryInterface.bulkInsert('doctor_infor', infoToInsert);
            }
        }
    },

    down: async (queryInterface, Sequelize) => {
    }
};
