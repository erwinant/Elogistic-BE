'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('StgStockBalances', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      material: {
        type: Sequelize.STRING
      },
      materialDesc: {
        type: Sequelize.STRING
      },
      plant: {
        type: Sequelize.STRING
      },
      storageLocation: {
        type: Sequelize.STRING
      },
      unrestricted: {
        type: Sequelize.FLOAT
      },
      bum: {
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
    return queryInterface.dropTable('StgStockBalances');
  }
};