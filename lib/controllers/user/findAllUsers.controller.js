"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _sequelize = require("sequelize");
var _models = _interopRequireDefault(require("../../database/models"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const User = _models.default.users;
const findAllUsers = async (req, res) => {
  const limit = req.query.limit || 10; // default to 10 users per page
  const offset = req.query.offset || 0; // default to the first page
  // calculate the offset based on the page number

  try {
    const users = await User.findAndCountAll({
      where: {},
      limit,
      offset,
      attributes: {
        exclude: ['password']
      }
    });
    const result = users.rows;
    const totalCount = users.count;
    if (result.length <= 0) {
      res.status(404).json({
        status: 'fail',
        message: '🚫 Oops...no user found at the moment.'
      });
    } else {
      res.status(200).json({
        status: 'success',
        message: `🍀 ${result.length} Users Fetched Successfully.`,
        data: result,
        currentPage: offset / limit + 1,
        totalPages: Math.ceil(totalCount / limit)
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