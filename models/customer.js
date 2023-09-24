"use strict";
const { Model } = require("sequelize");
const { hashPassword } = require("../helpers/bcryptjs");

module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    static associate(models) {
      Customer.hasMany(models.Order, { foreignKey: "CustomerId" });
    }
  }
  Customer.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Username is required!",
          },
          notNull: {
            msg: "Username is required!",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: {
          msg: "Email must be unique!",
        },
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Email is required!",
          },
          notNull: {
            msg: "Email is required!",
          },
          isEmail: {
            msg: "Must be email format!",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Password is required!",
          },
          notEmpty: {
            msg: "Password is required!",
          },
          isMinCharcter(password) {
            if (password.length < 5 && password.length > 0) {
              throw new Error("Minimal 5 character for your password");
            }
          },
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Phone number is required!",
          },
          notNull: {
            msg: "Phone number is required!",
          },
        },
      },
      imageUrl: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Image url is required!",
          },
          notNull: {
            msg: "Image url is required!",
          },
        },
      },
    },
    {
      hooks: {
        beforeCreate: (customer) => {
          customer.password = hashPassword(customer.password);
        },
      },
      sequelize,
      modelName: "Customer",
    }
  );
  return Customer;
};
