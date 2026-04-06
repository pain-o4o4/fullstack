'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Allcode extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Allcode.hasMany(models.User, { foreignKey: 'positionId' })
            Allcode.hasMany(models.User, { foreignKey: 'gender' })
            // Một khung giờ có thể áp dụng cho nhiều lịch trình
            Allcode.hasMany(models.Schedule, {
                foreignKey: 'timeType',
                as: 'scheduleData'
            });
        }
    }
    Allcode.init({
        type: DataTypes.STRING,
        keyMap: DataTypes.STRING,
        valueEn: DataTypes.STRING,
        valueVi: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Allcode',
        tableName: 'allcode',
    });
    return Allcode;
};