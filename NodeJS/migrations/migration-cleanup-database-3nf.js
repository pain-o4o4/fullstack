'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Drop redundant columns in doctor_infor
    try {
      await queryInterface.removeColumn('doctor_infor', 'nameClinic');
      await queryInterface.removeColumn('doctor_infor', 'addressClinic');
    } catch (e) {
      console.log('Columns already dropped or not found in doctor_infor');
    }

    // 2. Drop unused tables if they exist
    await queryInterface.dropTable('doctor_clinic_specialty').catch(() => {});
    await queryInterface.dropTable('history').catch(() => {});
  },

  async down(queryInterface, Sequelize) {
    // Rollback: Re-add columns to doctor_infor
    await queryInterface.addColumn('doctor_infor', 'nameClinic', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('doctor_infor', 'addressClinic', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
};
