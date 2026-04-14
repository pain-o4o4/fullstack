'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class doctor_clinic_specialty extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            doctor_clinic_specialty.belongsTo(models.Specialty, {
                foreignKey: 'specialtyId',
                targetKey: 'id',
                as: 'specialtyData'
            });
            // doctor_clinic_specialty.belongsTo(models.Clinic, {
            //     foreignKey: 'clinicId',
            //     targetKey: 'id',
            //     as: 'clinicData'
            // });
        }
    }
    doctor_clinic_specialty.init({
        doctorId: DataTypes.INTEGER,
        clinicId: DataTypes.INTEGER,
        specialtyId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'doctor_clinic_specialty',
    });
    return doctor_clinic_specialty;
}; 