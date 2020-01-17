'use strict';
module.exports = (sequelize, DataTypes) => {
  const StgPlantMaterialSloc = sequelize.define('StgPlantMaterialSloc', {
    material: DataTypes.STRING,
    plant: DataTypes.STRING,
    storageLocation: DataTypes.STRING
  }, {});
  StgPlantMaterialSloc.associate = function(models) {
    // associations can be defined here
  };
  return StgPlantMaterialSloc;
};