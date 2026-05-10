'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      senderId: {
        type: Sequelize.STRING
      },
      receiverId: {
        type: Sequelize.STRING
      },
      text: {
        type: Sequelize.TEXT
      },
      reactions: {
        type: Sequelize.TEXT,
        defaultValue: true
      },
      image: {
        type: Sequelize.BLOB('long')
      },
      isRead: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      deletedBySender: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      deletedByReceiver: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      parentId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Messages');
  }
};