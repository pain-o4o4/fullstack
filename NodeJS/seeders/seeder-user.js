'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Xóa dữ liệu cũ để tránh trùng lặp khi seed lại
    await queryInterface.bulkDelete('User', null, {});

    return queryInterface.bulkInsert('User', [
      {
        email: 'admin@gmail.com',
        password: '123456', // Sau này nên dùng bcrypt để hash nếu làm tính năng login
        firstName: 'Anh',
        lastName: 'Vuong',
        address: 'ThangLong',
        gender: 'M',        // Khớp với keyMap 'M' trong Allcode bạn vừa làm
        roleId: 'R1',       // Phải là roleId (viết hoa ID) theo đúng Migration của bạn
        positionId: 'P0',   // Thêm cho đủ cột trong Migration
        phonenumber: '0123456789',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'bacsi1@gmail.com',
        password: '123456',
        firstName: 'Vương',
        lastName: 'Anh',
        address: 'Hồ Chí Minh',
        gender: 'M',
        roleId: 'R2', // Mã Doctor
        positionId: 'P1', // Thạc sĩ
        phonenumber: '0123456789',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('User', null, {});
  }
};
