"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _models = _interopRequireDefault(require("../../database/models"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const User = _models.default.users;
const findUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId, {
      attributes: {
        exclude: ['password']
      }
    });
    if (!user) {
      res.status(404).json({
        status: 'fail',
        message: '🚫 User not found.'
      });
    } else {
      res.status(200).json({
        status: 'success',
        message: '🍀 User Fetched Successfully.',
        data: user
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message
    });
  }
};
var _default = findUserById;
exports.default = _default;