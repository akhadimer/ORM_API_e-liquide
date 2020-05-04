'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Eliquides', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      nom: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING
      },
      pg: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      vg: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      nicotine: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      origine: {
        allowNull: true,
        type: Sequelize.STRING
      },
      contenance: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      type_saveur: {
        allowNull: true,
        type: Sequelize.STRING
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Eliquides');
  }
};