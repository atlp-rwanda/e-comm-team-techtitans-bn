"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _nodemailer = _interopRequireDefault(require("nodemailer"));
var _nodemailerExpressHandlebars = _interopRequireDefault(require("nodemailer-express-handlebars"));
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class sendEmail {
  static sendVerification(to, subject, context) {
    const {
      USER_EMAIL,
      USER_PASS
    } = process.env;
    const transporter = _nodemailer.default.createTransport({
      service: 'gmail',
      auth: {
        user: USER_EMAIL,
        pass: USER_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    const handlebarOptions = {
      viewEngine: {
        parttialsDir: _path.default.resolve('./views/'),
        defaultLayout: false
      },
      viewPath: _path.default.resolve('./views/')
    };
    transporter.use('compile', (0, _nodemailerExpressHandlebars.default)(handlebarOptions));
    const mailOptions = {
      from: USER_EMAIL,
      to,
      subject,
      template: 'email',
      context
    };
    transporter.sendMail(mailOptions, (err, success) => {
      if (err) return 'email not sent:', err;
      return console.log('email sent', success);
    });
  }
  static sendWelcome(to, subject, context) {
    const {
      USER_EMAIL,
      USER_PASS
    } = process.env;
    const transporter = _nodemailer.default.createTransport({
      service: 'gmail',
      auth: {
        user: USER_EMAIL,
        pass: USER_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    const handlebarOptions = {
      viewEngine: {
        parttialsDir: _path.default.resolve('./views/'),
        defaultLayout: false
      },
      viewPath: _path.default.resolve('./views/')
    };
    transporter.use('compile', (0, _nodemailerExpressHandlebars.default)(handlebarOptions));
    const mailOptions = {
      from: USER_EMAIL,
      to,
      subject,
      template: 'welcome.email',
      context
    };
    transporter.sendMail(mailOptions, (err, success) => {
      if (err) return err;
      return success;
    });
  }
  static sendEmail(to, subject, text) {
    const {
      USER_EMAIL,
      USER_PASS
    } = process.env;
    const transporter = _nodemailer.default.createTransport({
      service: 'gmail',
      auth: {
        user: USER_EMAIL,
        pass: USER_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    const mailOptions = {
      from: USER_EMAIL,
      to,
      subject,
      text
    };
    transporter.sendMail(mailOptions, (err, success) => {
      if (err) return 'email not sent:', err;
      return console.log('email sent', success);
    });
  }
}
var _default = sendEmail;
exports.default = _default;