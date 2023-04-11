"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _models = _interopRequireDefault(require("../../database/models"));
const _excluded = ["password"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
const User = _models.default.users;

// Find all Users
const findAllUsers = (req, res) => {
  User.findAll({
    where: {}
  }).then(usersList => {
    const users = [];
    for (let i = 0; i < usersList.length; i++) {
      let _usersList$i$dataValu = usersList[i].dataValues,
        {
          password
        } = _usersList$i$dataValu,
        rest = _objectWithoutProperties(_usersList$i$dataValu, _excluded);
      users.push(rest);
    }
    res.status(201).json({
      message: `${usersList.length} Users were all fetched successfully!`,
      data: users
    });
  }).catch(err => {
    res.status(500).send({
      message: err.message || 'Some error occurred while removing all users.'
    });
  });
};
var _default = findAllUsers;
exports.default = _default;