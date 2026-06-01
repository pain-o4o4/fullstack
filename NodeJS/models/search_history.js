'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class SearchHistory extends Model {
        static associate(models) {
            SearchHistory.belongsTo(models.User, { foreignKey: 'userId', as: 'userData' });
        }
    };
    SearchHistory.init({
        userId: DataTypes.INTEGER,
        keyword: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'SearchHistory',
        tableName: 'SearchHistories',
        freezeTableName: true,
        paranoid: true,
    });
    return SearchHistory;
};
