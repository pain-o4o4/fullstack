'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex('User', ['firstName'], { name: 'idx_users_firstname' });
    await queryInterface.addIndex('User', ['lastName'], { name: 'idx_users_lastname' });
    await queryInterface.addIndex('Clinic', ['name'], { name: 'idx_clinics_name' });
    await queryInterface.addIndex('Specialties', ['name'], { name: 'idx_specialties_name' });
    await queryInterface.addIndex('handbooks', ['name'], { name: 'idx_handbooks_name' });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('User', 'idx_users_firstname');
    await queryInterface.removeIndex('User', 'idx_users_lastname');
    await queryInterface.removeIndex('Clinic', 'idx_clinics_name');
    await queryInterface.removeIndex('Specialties', 'idx_specialties_name');
    await queryInterface.removeIndex('handbooks', 'idx_handbooks_name');
  }
};
