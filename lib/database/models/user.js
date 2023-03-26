"use strict";

// module.exports = (sequelize, Sequelize) => {
//   const User = sequelize.define('user', {
//     fullname: {
//       type: Sequelize.STRING,
//     },
//     email: {
//       type: Sequelize.STRING,
//     },
//     password: {
//       type: Sequelize.STRING,
//     },
//     role: {
//       type: Sequelize.STRING,
//     },
//   });

//   return User;
// };

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
    fullname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User'
  });
  return User;
};