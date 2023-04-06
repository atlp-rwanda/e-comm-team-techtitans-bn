'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'userId' });
      // this.hasMany(models.Product, { foreignKey: 'id'});
    }
  }

  Cart.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      products: DataTypes.ARRAY(DataTypes.JSONB),
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        references: { model: 'Users', key: 'id' },
      },
      total: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Cart',
    }
  );

  return Cart;
};
