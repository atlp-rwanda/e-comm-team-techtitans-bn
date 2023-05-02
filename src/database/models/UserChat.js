// USER_CHAT
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserChat extends Model {
    static associate(models) {
      // define association here
      UserChat.hasMany(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });
      UserChat.hasMany(models.Chat, {
        foreignKey: 'chatId',
        onDelete: 'CASCADE',
      });
    }
  }
  UserChat.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      chatId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    {
      sequelize,
      modelName: 'UserChat',
      tableName: 'UserChat',
    },
  );

  return UserChat;
};

// const { Model } = require('sequelize');

// module.exports = (sequelize, DataTypes) => {
//   class UserChat extends Model {
//     static associate(models) {
//       //   UserChat.belongsToMany(models.User, {
//       //     through: 'UserChat',
//       //     foreignKey: 'chatId',
//       //     as: 'users',
//       //   });
//       //   UserChat.hasMany(models.Message, {
//       //     onDelete: 'CASCADE',
//       //     as: 'messages',
//       //   });
//     }
//   }
//   UserChat.init(
//     {
//       id: {
//         type: DataTypes.UUID,
//         defaultValue: DataTypes.UUIDV4,
//         primaryKey: true,
//       },
//       chatId: {
//         type: DataTypes.UUID,
//         defaultValue: DataTypes.UUIDV4,
//         primaryKey: true,
//       },
//       userId: {
//         type: DataTypes.UUID,
//         defaultValue: DataTypes.UUIDV4,
//         primaryKey: true,
//       },
//     },
//     {
//       sequelize,
//       modelName: 'UserChat',
//     },
//   );
//   return UserChat;
// };
