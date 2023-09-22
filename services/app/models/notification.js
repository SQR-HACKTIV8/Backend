'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {

    static associate(models) {
      // define association here
    }
  }
  Notification.init({
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
    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Image url is required!"
        },
        notNull: {
          msg: "Image url is required!"
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
    }
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};