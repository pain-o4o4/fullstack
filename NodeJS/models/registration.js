'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Registration extends Model {
        static associate(models) {
            // No direct relation needed; link by email.
        }
    }

    Registration.init({
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        attempts: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        resendCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        payload: {
            type: DataTypes.TEXT('long'),
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Registration',
        tableName: 'registration',
        freezeTableName: true
    });

    return Registration;
};
