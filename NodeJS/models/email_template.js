'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EmailTemplate extends Model {
    static associate(models) {
      // define association here
    }
  }
  EmailTemplate.init({
    type: DataTypes.STRING,
    language: DataTypes.STRING,
    subject: DataTypes.STRING,
    content: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'EmailTemplate',
    tableName: 'EmailTemplates'
  });
  return EmailTemplate;
};
