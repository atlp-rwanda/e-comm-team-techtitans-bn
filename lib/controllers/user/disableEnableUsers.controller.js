"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _models = _interopRequireDefault(require("../../database/models"));
var _send = _interopRequireDefault(require("../../utils/send.email"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const User = _models.default.users;
const disableEnableUsers = async (req, res) => {
  const {
    uuid
  } = req.params;
  const {
    accountStatus,
    reason
  } = req.body;
  try {
    const user = await User.findOne({
      where: {
        uuid
      }
    });
    if (!user) {
      return res.status(404).json({
        message: `user with id : ${uuid} does not exit `
      });
    } else {
      user.accountStatus = accountStatus;
      await user.save();
      if (user) {
        const status = user.accountStatus === "active" ? "activated" : "deactivated";
        const to = user.email;
        const text = `Dear User, Your account has been ${status}  bacause of ${reason}.Please contact us if
         you have any questions.Best regards,The Admin Team`;
        _send.default.sendEmailDisableEnable(to, "account status", text);
        return res.status(200).json({
          message: "User Status account changed successfully"
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};
var _default = disableEnableUsers;
exports.default = _default;