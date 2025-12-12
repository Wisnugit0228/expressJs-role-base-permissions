'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('permissions', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      module: {
        type: Sequelize.STRING,
        allowNull: false
      },
      action: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      created_at: {
        type: Sequelize.DATE,
      },
      updated_at: {
        type: Sequelize.DATE,
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('permissions');
  }
};
