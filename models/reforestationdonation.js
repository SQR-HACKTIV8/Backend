'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReforestationDonation extends Model {
    static associate(models) {
      ReforestationDonation.belongsTo(models.OrderDetail, { foreignKey: "OrderDetailId" })
    }
  }
  ReforestationDonation.init({
    OrderDetailId: DataTypes.INTEGER,
    treeType: DataTypes.STRING,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ReforestationDonation',
  });
  return ReforestationDonation;
};