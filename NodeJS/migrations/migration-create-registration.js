'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('registration', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            code: {
                type: Sequelize.STRING,
                allowNull: false
            },
            expiresAt: {
                type: Sequelize.DATE,
                allowNull: false
            },
            attempts: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            resendCount: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            payload: {
                type: Sequelize.TEXT('long'),
                allowNull: false
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
        await queryInterface.dropTable('registration');
    }
};
