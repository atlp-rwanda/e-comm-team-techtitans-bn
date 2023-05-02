'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Notification.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: DataTypes.STRING,
    subject: DataTypes.STRING,
    body: DataTypes.TEXT,
    notificationStatus: {
      type: DataTypes.STRING,
      defaultValue: 'unread',
    },
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};