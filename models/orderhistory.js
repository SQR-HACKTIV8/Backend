'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderHistory extends Model {
    static associate(models) {
      OrderHistory.belongsTo(models.OrderDetail, { foreignKey: "OrderDetailId" })
    }
  }
  OrderHistory.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Title is required!"
        },
        notNull: {
          msg: "Title is required!"
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Description is required!"
        },
        notNull: {
          msg: "Description is required!"
        }
      }
    },
    OrderDetailId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Order Detail ID is required!"
        },
        notNull: {
          msg: "Order Detail ID is required!"
        }
      }
    },
    imageUrl: DataTypes.TEXT,
    videoUrl: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'OrderHistory',
  });
  return OrderHistory;
};