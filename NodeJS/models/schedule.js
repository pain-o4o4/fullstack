
'use strict';
const { Model } = require('sequelize'); //

module.exports = (sequelize, DataTypes) => {
    // 1. Đổi tên class thành Schedule (viết hoa chữ cái đầu)
    class Schedule extends Model {
        static associate(models) {
            // 2. Dùng đúng tên class Schedule ở đây
            Schedule.belongsTo(models.Allcode, {
                foreignKey: 'timeType',
                targetKey: 'keyMap',
                as: 'timeTypeData'
            });
            Schedule.belongsTo(models.User, {
                foreignKey: 'doctorId',
                targetKey: 'id',
                as: 'doctorData'
            })
        }
    }

    Schedule.init({
        currentNumber: DataTypes.INTEGER,
        maxNumber: DataTypes.INTEGER,
        date: DataTypes.STRING,
        timeType: DataTypes.STRING,
        doctorId: DataTypes.INTEGER,
        roleId: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Schedule', // modelName là 'Schedule' (S hoa)
        tableName: 'schedules'
    });

    // 3. Return đúng class Schedule
    return Schedule;
};