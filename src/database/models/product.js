'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // define association here
      Product.belongsTo(models.User, {
        foreignKey: 'vendorId',
      });
      Product.belongsTo(models.Category, {
        foreignKey: 'categoryId',
      });
    }
  }
  Product.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      stock: {
        type: DataTypes.ENUM('Available', 'Out of Stock', 'Expired'),
        defaultValue: 'Available',
      },
      price: DataTypes.FLOAT,
      quantity: DataTypes.INTEGER,
      description: DataTypes.STRING,
      images: DataTypes.ARRAY(DataTypes.STRING),
      bonus: DataTypes.INTEGER,
      expiryDate: DataTypes.DATE,
      ec: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Product',
    },
  );

  return Product;
};
