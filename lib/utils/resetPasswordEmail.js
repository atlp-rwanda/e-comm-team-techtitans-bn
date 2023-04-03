"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _nodemailer = _interopRequireDefault(require("nodemailer"));
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const sendFunc = async (options, token) => {
  let transporter = _nodemailer.default.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.RESET_USER_EMAIL,
      pass: process.env.RESET_USER_PASSWORD
    }
  });
  let mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: options?.email,
    subject: `Teck-Titan reset Password`,
    html: `Dear Sir/Madam,<br/><br/>You can reset Your password by clicking on the above link<br/><br/> <a href="${token}">${token}</a>`
    // attachments: [
    //   {
    //     filename: "challenge.pdf",
    //     path: path.join(__dirname, `../output/challenge.pdf`),
    //     contentType: "application/pdf",
    //   },
    // ],
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.error(err);
    } else {
      console.log(info);
    }
  });
};
var _default = sendFunc;
exports.default = _default;