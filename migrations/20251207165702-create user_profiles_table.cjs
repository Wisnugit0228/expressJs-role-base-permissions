'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_profiles', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: "CASCADE",
        onUpdate: 'CASCADE'
      },
      phone: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING
      },
      avatar: {
        type: Sequelize.TEXT,
      },
      gender: {
        type: Sequelize.ENUM('male', 'female', 'other'),
        defaultValue: 'other'
      },
      address: {
        type: Sequelize.TEXT
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_profiles');
  }
};
