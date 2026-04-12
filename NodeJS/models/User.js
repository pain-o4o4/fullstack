'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Allcode, { foreignKey: 'positionId', targetKey: 'keyMap', as: 'positionData' })
      User.belongsTo(models.Allcode, { foreignKey: 'gender', targetKey: 'keyMap', as: 'genderData' })
      // User.hasOne(models.Doctor_infor,{foreignKey: "doctorId", as:"doctorinforData"})
      User.hasOne(models.Markdown, { foreignKey: 'doctorId', as: 'markdownData' });
      User.hasOne(models.Doctor_infor, { foreignKey: 'doctorId', as: 'doctorinforData' });


      User.hasMany(models.Schedule, { foreignKey: 'doctorId', as: 'doctorData' });


    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,       // <--- THÊM DÒNG NÀY
      autoIncrement: true     // Thường đi kèm để tự động tăng số id
    },
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    address: DataTypes.STRING,
    phonenumber: DataTypes.STRING,
    gender: DataTypes.STRING,
    image: DataTypes.BLOB('long'),
    roleID: DataTypes.STRING,
    positionId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
    // tableName: 'users',
    freezeTableName: true, // Thêm dòng này để giữ nguyên tên bảng là 'User'  
  });
  return User;
};