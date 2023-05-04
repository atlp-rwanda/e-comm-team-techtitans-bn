import nodemailer from "nodemailer";
import path from "path";

const sendEmailSubscriber = async (options, token) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.RESET_USER_EMAIL,
      pass: process.env.RESET_USER_PASSWORD,
    },
  });
  let mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: options?.email,
    subject: `Teck-Titan reset Password`,
    html: `Dear message <a href="">f</a>`,
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
export default sendEmailSubscriber;
