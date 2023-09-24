'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderDetail extends Model {
    static associate(models) {
      OrderDetail.belongsTo(models.Order, { foreignKey: "OrderId" });
      OrderDetail.belongsTo(models.Qurban, { foreignKey: "QurbanId" });
      OrderDetail.hasMany(models.OrderHistory, { foreignKey: "OrderDetailId" });
      OrderDetail.hasMany(models.ReforestationDonation, { foreignKey: "OrderDetailId" });
    }
  }
  OrderDetail.init({
    OrderId: DataTypes.STRING,
    QurbanId: DataTypes.INTEGER,
    onBehalfOf: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Sender's name is required",
        },
        notNull: {
          msg: "Sender's name is required",
        },
      },
    }
  }, {
    sequelize,
    modelName: 'OrderDetail',
  });
  return OrderDetail;
};