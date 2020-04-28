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
        type: Sequelize.STRING
      },
      contenance: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      type_saveur: {
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