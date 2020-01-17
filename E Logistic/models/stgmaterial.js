'use strict';
module.exports = (sequelize, DataTypes) => {
  const StgMaterial = sequelize.define('StgMaterial', {
    material: DataTypes.STRING,
    plant: DataTypes.STRING,
    materialDesc: DataTypes.STRING,
    materialType: DataTypes.STRING,
    materialGroup: DataTypes.STRING,
    bum: DataTypes.STRING
  }, {});
  StgMaterial.associate = function(models) {
    // associations can be defined here
  };
  return StgMaterial;
};