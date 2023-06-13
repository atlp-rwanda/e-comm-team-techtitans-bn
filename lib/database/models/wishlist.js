"use strict";

const {
  Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Wishlist.init({
    user_id: DataTypes.STRING,
    product_id: DataTypes.STRING,
    product_name: DataTypes.STRING,
    product_price: DataTypes.INTEGER,
    product_image: DataTypes.ARRAY(DataTypes.STRING)
  }, {
    sequelize,
    modelName: "Wishlist"
  });
  return Wishlist;
};