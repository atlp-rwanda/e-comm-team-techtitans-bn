"use strict";

const {
  Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("Product", {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    available: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    bonus: DataTypes.INTEGER,
    images: DataTypes.ARRAY(DataTypes.STRING),
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {});
  Product.associate = models => {
    Product.belongsTo(models.User, {
      foreignKey: "userId"
    });
    Product.belongsTo(models.Category, {
      foreignKey: "categoryId"
    });
  };
  return Product;
};