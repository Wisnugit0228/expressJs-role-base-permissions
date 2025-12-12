'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'otp_activation', {
      type: Sequelize.STRING
    });

    await queryInterface.addColumn('users', 'expires_otp', {
      type: Sequelize.DATE
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'otp_activation');
    await queryInterface.removeColumn('users', 'expires_otp');
  }
};
