"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.Customer, { foreignKey: "CustomerId" });
    }
  }
  Order.init(
    {
      CustomerId: DataTypes.INTEGER,
      statusPayment: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      totalPrice: DataTypes.INTEGER,
      totalQuantity: DataTypes.INTEGER,
      OrderId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
