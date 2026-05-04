'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Chatbot extends Model {
        static associate(models) {
            Chatbot.belongsTo(models.User, { foreignKey: 'userId', as: 'userData' });
        }
    };
    Chatbot.init({
        userId: DataTypes.INTEGER,
        sessionId: DataTypes.STRING,
        role: DataTypes.STRING,
        content: DataTypes.TEXT,
    }, {
        sequelize,
        modelName: 'Chatbot',
        freezeTableName: true
    });
    return Chatbot;
};
