"use strict";

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    static associate(models) {
      Chat.belongsToMany(models.User, {
        through: 'UserChat',
        foreignKey: 'chatId',
        as: 'theUsers'
      });
      Chat.hasMany(models.Message, {
        onDelete: 'CASCADE',
        as: 'messages'
      });
    }
  }
  Chat.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    chatName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    users: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: false,
      defaultValue: []
    },
    chatMessages: {
      type: DataTypes.ARRAY(DataTypes.JSONB),
      allowNull: true,
      defaultValue: []
    }
  }, {
    sequelize,
    modelName: 'Chat'
  });
  return Chat;
};