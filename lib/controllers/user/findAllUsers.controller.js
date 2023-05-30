"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _models = _interopRequireDefault(require("../../database/models"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const User = _models.default.users;
const findAllUsers = async (req, res) => {
  try {
    const users = await User.findAndCountAll({
      where: {},
      attributes: {
        exclude: ['password']
      }
    });
    if (users.length <= 0) {
      res.status(404).json({
        status: 'fail',
        message: '🚫 Oops...no user found at the moment.'
      });
    } else {
      res.status(200).json({
        status: 'success',
        message: `🍀 ${users.length} Users Fetched Successfully.`,
        data: users
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message
    });
  }
};
var _default = findAllUsers;
exports.default = _default;