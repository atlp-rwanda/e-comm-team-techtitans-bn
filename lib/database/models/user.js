"use strict";

const {
  Model
} = require('sequelize');
const speakeasy = require('speakeasy');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }
  }
  User.init({
    fullname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    mfa_secret: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    getterMethods: {
      mfa_token() {
        if (this.mfa_secret) {
          return speakeasy.totp({
            secret: this.mfa_secret,
            encoding: 'base32'
          });
        }
        return null;
      }
    }
  });
  return User;
};