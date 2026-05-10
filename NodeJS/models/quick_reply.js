'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QuickReply extends Model {
    static associate(models) {
      // define association here
    }
  }
  QuickReply.init({
    doctorId: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    isGlobal: DataTypes.BOOLEAN,
    title: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'QuickReply',
    tableName: 'QuickReplies'
  });
  return QuickReply;
};
