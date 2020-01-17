'use strict';
module.exports = (sequelize, DataTypes) => {
  const StgPlantSloc = sequelize.define('StgPlantSloc', {
    plantCode: DataTypes.STRING,
    plantDesc: DataTypes.STRING,
    storageLocation: DataTypes.STRING,
    storageLocationDesc: DataTypes.STRING
  }, {});
  StgPlantSloc.associate = function(models) {
    // associations can be defined here
  };
  return StgPlantSloc;
};