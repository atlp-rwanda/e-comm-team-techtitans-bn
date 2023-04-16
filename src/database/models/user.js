"use strict";
const { Model } = require("sequelize");
const {speakeasy} = require('speakeasy');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Product, {
        foreignKey: 'vendorId',
        as: 'user',
      });
    }
  }
  User.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      fullname: {
        type: DataTypes.STRING,
        set(val) {
          this.setDataValue("fullname", val.toLowerCase());
        },
      },
      email: {
        type: DataTypes.STRING,
        set(val) {
          this.setDataValue("email", val.toLowerCase());
        },
      },
      password: {
        type: DataTypes.STRING,
      },
      mfa_secret: {
       type: DataTypes.STRING,
      },
      gender: {
        type: DataTypes.STRING,
        set(val) {
          this.setDataValue("gender", val.toLowerCase());
        },
      },
      preferredLanguage: {
        type: DataTypes.STRING,
        set(val) {
          this.setDataValue("preferredLanguage", val.toLowerCase());
        },
      },
      preferredCurrency: {
        type: DataTypes.STRING,
        set(val) {
          this.setDataValue("preferredCurrency", val.toLowerCase());
        },
      },
      location: {
        type: DataTypes.STRING,
        set(val) {
          this.setDataValue("location", val.toLowerCase());
        },
      },
      billingAddress: {
        type: DataTypes.STRING,
        set(val) {
          this.setDataValue("billingAddress", val.toLowerCase());
        },
      },
      roleId: {
        type: DataTypes.INTEGER,
        defaultValue: 3,
        // Admin(1), Seller(2), Buyer(3)
      },
      lastPasswordUpdate: {
        type: DataTypes.DATE,
          allowNull: true,
    },
    },
    {
      sequelize,
      modelName: 'User',
      getterMethods: {
        mfa_token() {
            if (this.mfa_secret) {
                return speakeasy.totp({
                    secret: this.mfa_secret,
                    encoding: 'base32',
                });
            }
            return null;
        },
    },
    },
  );
  return User;
};
