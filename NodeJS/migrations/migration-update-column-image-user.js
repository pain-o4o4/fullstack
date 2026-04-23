module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('User', 'image', {
      type: Sequelize.BLOB('long'), // Nâng cấp lên LONGBLOB tại đây
      allowNull: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    // Nếu muốn quay lại (Undo) thì nó sẽ về STRING
    return queryInterface.changeColumn('User', 'image', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};