"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _models = _interopRequireDefault(require("../../database/models"));
var _send = _interopRequireDefault(require("../../utils/send.email"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const cron = require('node-cron');
const User = _models.default.users;

// in days, it should be stored in environment variable
const EXPIRATION_TIME = process.env.PASSWORD_EXPIRATION_TIME;
// cron schedule run every minute:(* * * * *)
// cron schedule run every 30 days:(0 0 0 */30 * *)
// cron schedule run every 30 days at 9:00 am:(0 9 0 */30 * *)
// cron schedule run every every five minutes:(*/5 * * * *)
const PasswordReminder = cron.schedule('* * * * *', async () => {
  // every minute
  // console.log ('Please update your password');
  try {
    const users = await User.findAll();
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() - EXPIRATION_TIME);
    for (const user of users) {
      const lastPasswordUpdated = user.lastPasswordUpdate || user.createdAt;
      if (lastPasswordUpdated < expirationDate) {
        // Send notification to user to update password via email using nodemailer:
        const to = user.email;
        const subject = 'Update Password Reminder';
        // const text=`http://localhost:3070/api/v1/user/editpassword${user.uuid}`;
        const text = `Dear,<br/><br/><strong>${user.fullname}</strong><br/><br/>You are required to update your password within 7 working days.<br/><br/> <a href="https://ecommerce-tech-titans.herokuapp.com/api/v1/user/login">Click here to Update your password</a>`;
        // const text=html
        _send.default.sendUpdatePassword(to, subject, text);
        console.log('Please update your password');
      }
      // eslint-disable-next-line indent
    }
  } catch (err) {
    console.error(err);
  }
});
var _default = PasswordReminder;
exports.default = _default;