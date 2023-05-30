"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _models = _interopRequireDefault(require("../../database/models"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Users = _models.default.users;
class roleToSet {
  static async setRole(req, res) {
    try {
      const userId = req.params.id;
      const {
        email,
        roleId
      } = req.body;
      const user = await Users.findOne({
        where: {
          id: userId
        }
      });
      if (!user) {
        res.status(404).json({
          message: '🚫 User not found'
        });
      } else {
        const updateRole = await user.update({
          email,
          roleId
        });
        res.status(200).json({
          status: 'status',
          message: 'Role updated successfully',
          data: updateRole
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 'fail',
        message: error.message
      });
    }
  }
}
var _default = roleToSet;
exports.default = _default;