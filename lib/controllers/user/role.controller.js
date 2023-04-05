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
    const {
      email,
      role
    } = req.body;
    const user = await Users.findOne({
      where: {
        email
      }
    });
    if (!user) {
      return res.status(404).send(`${email} is not found`);
    }
    user.roleId = role;
    await user.save();
    return res.status(200).send(user);
  }
}
var _default = roleToSet;
exports.default = _default;