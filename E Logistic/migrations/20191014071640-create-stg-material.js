'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('StgMaterials', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      material: {
        type: Sequelize.STRING
      },
      plant: {
        type: Sequelize.STRING
      },
      materialDesc: {
        type: Sequelize.STRING
      },
      materialType: {
        type: Sequelize.STRING
      },
      materialGroup: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('StgMaterials');
  }
};