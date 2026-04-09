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
            Allcode.hasMany(models.Schedule, { foreignKey: 'timeType', as: 'scheduleData' });

            Allcode.hasMany(models.Doctor_infor, { foreignKey: 'priceId', as: 'priceTypeData' });
            Allcode.hasMany(models.Doctor_infor, { foreignKey: 'provinceId', as: 'provinceTypeData' });
            Allcode.hasMany(models.Doctor_infor, { foreignKey: 'paymentId', as: 'paymentTypeData' });
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