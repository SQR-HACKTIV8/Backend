"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Qurban extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Qurban.belongsTo(models.Category, { foreignKey: "CategoryId" });
      Qurban.hasMany(models.OrderDetail, { foreignKey: "QurbanId" });
    }
  }
  Qurban.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Qurban name is required",
          },
          notEmpty: {
            msg: "Qurban name cannot be empty",
          },
        },
      },
      CategoryId: DataTypes.INTEGER,
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Price is required",
          },
          notEmpty: {
            msg: "Price cannot be empty",
          },
          min: {
            args: [1000000],
            msg: "Minimum price is Rp. 1,000,000.00",
          },
        },
      },
      quality: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Quality is required",
          },
          notEmpty: {
            msg: "Quality cannot be empty",
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Description is required",
          },
          notEmpty: {
            msg: "Description cannot be empty",
          },
        },
      },
      imageUrl1: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Image URL 1 is required",
          },
          notEmpty: {
            msg: "Image URL 1 cannot be empty",
          },
        },
      },
      imageUrl2: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Image URL 2 is required",
          },
          notEmpty: {
            msg: "Image URL 2 cannot be empty",
          },
        },
      },
      imageUrl3: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Image URL 3 is required",
          },
          notEmpty: {
            msg: "Image URL 3 cannot be empty",
          },
        },
      },
      videoUrl: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Video URL is required",
          },
          notEmpty: {
            msg: "Video URL cannot be empty",
          },
        },
      },
      weight: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Weight is required",
          },
          notEmpty: {
            msg: "Weight cannot be empty",
          },
        },
      },
      isBooked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Qurban",
    }
  );
  return Qurban;
};
