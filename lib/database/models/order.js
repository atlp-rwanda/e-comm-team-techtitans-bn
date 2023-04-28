"use strict";

const {
  Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      // define association here
      Order.belongsTo(models.User, {
        foreignKey: "userId",
        as: "customer",
        onDelete: "CASCADE"
      });
      Order.hasOne(models.Cart, {
        foreignKey: "cartId",
        as: "cart",
        onDelete: "CASCADE"
      });
      Order.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product",
        onDelete: "CASCADE"
      });
    }
  }
  Order.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    status: {
      type: DataTypes.ENUM("pending", "processing", "shipped", "delivered"),
      defaultValue: "pending"
    },
    expected_delivery_date: {
      type: DataTypes.DATE
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    total_price: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: "Order"
  });
  return Order;
};