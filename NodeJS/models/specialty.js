'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class specialty extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            specialty.hasMany(models.doctor_clinic_specialty, {
                foreignKey: 'specialtyId',
                as: 'doctorClinicSpecialtyData'
            });
            specialty.hasMany(models.Doctor_infor, {
                foreignKey: 'specialtyId',
                as: 'doctorSpecialty'
            });
        }
    }
    specialty.init({
        name: DataTypes.STRING,
        descriptionHTML: DataTypes.TEXT,
        descriptionMarkdown: DataTypes.TEXT,
        image: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'Specialty',
        tableName: 'Specialties'
    });
    return specialty;
};