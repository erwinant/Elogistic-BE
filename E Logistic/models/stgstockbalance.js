'use strict';
module.exports = (sequelize, DataTypes) => {
  const StgStockBalance = sequelize.define('StgStockBalance', {
    material: DataTypes.STRING,
    materialDesc: DataTypes.STRING,
    plant: DataTypes.STRING,
    storageLocation: DataTypes.STRING,
    unrestricted: DataTypes.FLOAT,
    bum: DataTypes.STRING
  }, {});
  StgStockBalance.associate = function(models) {
    // associations can be defined here
  };
  return StgStockBalance;
};