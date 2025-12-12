'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('refresh_tokens', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.STRING,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      token: {
        type: Sequelize.TEXT
      },
      user_agent: {
        type: Sequelize.STRING
      },
      ip_address: {
        type: Sequelize.STRING
      },
      expires_at: {
        type: Sequelize.DATE
      },
      revoked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        type: Sequelize.DATE
      },
      updated_at: {
        type: Sequelize.DATE
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('refresh_tokens');
  }
};
