'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
<<<<<<< HEAD
    fullname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    gender: DataTypes.STRING,
    birthdate: DataTypes.DATE,
    preferredLanguage: DataTypes.STRING,
    preferredCurrency: DataTypes.STRING,
    location: DataTypes.STRING,
    billingAddress: DataTypes.STRING,
    roleId: {
=======
    fullname: {
      type: DataTypes.STRING,
      set(val) {
        this.setDataValue("fullname", val.toLowerCase());
      }
    },
    email: {
      type: DataTypes.STRING,
      set(val) {
        this.setDataValue("email", val.toLowerCase());
      }
    },
    gender: {
      type: DataTypes.STRING,
      set(val) {
        this.setDataValue("gender", val.toLowerCase());
      }
    },
    preferredLanguage: {
      type: DataTypes.STRING,
      set(val) {
        this.setDataValue("preferredLanguage", val.toLowerCase());
      }
    },
    preferredCurrency: {
      type: DataTypes.STRING,
      set(val) {
        this.setDataValue("preferredCurrency", val.toLowerCase());
      }
    },
    location: {
      type: DataTypes.STRING,
      set(val) {
        this.setDataValue("location", val.toLowerCase());
      }
    },
    billingAddress: {
      type: DataTypes.STRING,
      set(val) {
        this.setDataValue("billingAddress", val.toLowerCase());
      }
    },
    role: {
>>>>>>> 70d671f (Fix #184752248)
      type: DataTypes.INTEGER,
      defaultValue: 3
      // Admin(1), Seller(2), Buyer(3)
    }
  }, {
    sequelize,
    modelName: 'User'
  });
  return User;
};