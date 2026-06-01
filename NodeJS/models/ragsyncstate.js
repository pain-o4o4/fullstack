'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RagSyncState extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RagSyncState.init({
    entityType: DataTypes.STRING,
    entityId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'RagSyncState',
  });
  return RagSyncState;
};