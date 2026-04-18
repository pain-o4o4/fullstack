'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('bookings', {
            //             statusId: DataTypes.STRING,
            // doctorId: DataTypes.STRING,
            // patientId: DataTypes.STRING,
            // date: DataTypes.DATE,
            // timeType: DataTypes.STRING
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            statusId: {
                type: Sequelize.STRING
            },
            doctorId: {
                type: Sequelize.INTEGER
            },
            paymentId: {
                type: Sequelize.STRING
            },
            patientId: {
                type: Sequelize.INTEGER
            },
            orderCode: {
                type: Sequelize.STRING
            },
            reason: {
                type: Sequelize.STRING
            },
            date: {
                type: Sequelize.STRING
            },
            timeType: {
                allowNull: false,
                type: Sequelize.STRING
            },
            token: {
                allowNull: false,
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('bookings');
    }
};