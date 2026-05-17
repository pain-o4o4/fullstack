'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('QuickReplies', 'type', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'MANUAL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('QuickReplies', 'type');
  }
};
