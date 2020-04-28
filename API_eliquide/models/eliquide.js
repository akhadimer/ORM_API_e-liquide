'use strict';
module.exports = (sequelize, DataTypes) => {
  const Eliquide = sequelize.define('Eliquide', {
    nom: DataTypes.STRING,
    description: DataTypes.STRING,
    pg: DataTypes.INTEGER,
    vg: DataTypes.INTEGER,
    nicotine: DataTypes.INTEGER,
    origine: DataTypes.STRING,
    contenance: DataTypes.INTEGER,
    type_saveur: DataTypes.STRING
  }, {});
  return Eliquide;
};