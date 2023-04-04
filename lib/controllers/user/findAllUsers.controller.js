"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _models = _interopRequireDefault(require("../../database/models"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const User = _models.default.users;

// Find all Users
const findAllUsers = (req, res) => {
  User.findAll({
    where: {}
  }).then(usersList => {
    res.status(201).json({
      message: `${usersList.length} Users were all fetched successfully!`,
      data: usersList
    });
  }).catch(err => {
    res.status(500).send({
      message: err.message || 'Some error occurred while removing all users.'
    });
  });
};
var _default = findAllUsers;
exports.default = _default;