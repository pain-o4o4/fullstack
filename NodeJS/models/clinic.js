'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class clinic extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            clinic.hasMany(models.Doctor_infor, { foreignKey: 'clinicId', as: 'doctorClinic' });
            clinic.hasMany(models.doctor_clinic_specialty, { foreignKey: 'clinicId', as: 'doctorClinicSpecialtyData' });
        }
    }
    clinic.init({
        name: DataTypes.STRING,
        address: DataTypes.STRING,
        image: DataTypes.TEXT,
        descriptionHTML: DataTypes.TEXT,
        descriptionMarkdown: DataTypes.TEXT
    }, {
        sequelize,
        tableName: 'Clinic',
        modelName: 'Clinic',
    });
    return clinic;
};