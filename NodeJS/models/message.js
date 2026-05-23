'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Message.belongsTo(models.Message, { foreignKey: 'parentId', as: 'parentData' });
      Message.hasMany(models.Message, { foreignKey: 'parentId', as: 'replies' });
    }
  }
  Message.init({
    senderId: DataTypes.STRING,
    receiverId: DataTypes.STRING,
    image: DataTypes.BLOB('long'),
    text: DataTypes.TEXT,
    isRead: DataTypes.BOOLEAN,
    deletedBySender: DataTypes.BOOLEAN,
    deletedByReceiver: DataTypes.BOOLEAN,
    parentId: DataTypes.INTEGER,
    reactions: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};