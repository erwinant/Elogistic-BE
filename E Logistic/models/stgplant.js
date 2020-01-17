'use strict';
module.exports = (sequelize, DataTypes) => {
  const StgPlant = sequelize.define('StgPlant', {
    plantCode: DataTypes.STRING,
    plantDesc: DataTypes.STRING,
    storageLocation: DataTypes.STRING,
    storageLocationDesc: DataTypes.STRING
  }, {});
  StgPlant.associate = function(models) {
    // associations can be defined here
  };
  return StgPlant;
};