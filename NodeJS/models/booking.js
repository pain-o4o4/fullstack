'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class booking extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Sửa Alias để khớp với User.js (doctorBookingData)
            booking.belongsTo(models.User, { foreignKey: 'doctorId', targetKey: 'id', as: 'doctorBookingData' });

            // Bổ sung thêm quan hệ cho Patient để sau này làm MyBooking không bị lỗi
            booking.belongsTo(models.User, { foreignKey: 'patientId', targetKey: 'id', as: 'patientBookingData' });

            // Giữ nguyên các phần Allcode cũ của Duy
            booking.belongsTo(models.Allcode, { foreignKey: 'timeType', targetKey: 'keyMap', as: 'timeTypeDataPatient' });
            booking.belongsTo(models.Allcode, { foreignKey: 'statusId', targetKey: 'keyMap', as: 'statusData' });
        }
    }
    booking.init({
        statusId: DataTypes.STRING,
        doctorId: DataTypes.INTEGER,
        patientId: DataTypes.INTEGER,
        date: DataTypes.STRING,
        timeType: DataTypes.STRING,
        token: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Booking',
        tableName: 'bookings',
        freezeTableName: true
    });
    return booking;

};