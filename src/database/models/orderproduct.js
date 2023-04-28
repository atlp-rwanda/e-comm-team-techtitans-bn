"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class orderProduct extends Model {
    static associate(models) {
      // define association here
    }
  }
  orderProduct.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      quantity: DataTypes.INTEGER,
      unitprice: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "orderProduct",
    }
  );
  return orderProduct;
};
