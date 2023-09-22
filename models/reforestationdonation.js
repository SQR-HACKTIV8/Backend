'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReforestationDonation extends Model {
    static associate(models) {
      
    }
  }
  ReforestationDonation.init({
    OrderDetailId: DataTypes.INTEGER,
    treeType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Tree type is required!"
        },
        notNull: {
          msg: "Tree type is required!"
        }
      }
    },
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ReforestationDonation',
  });
  return ReforestationDonation;
};