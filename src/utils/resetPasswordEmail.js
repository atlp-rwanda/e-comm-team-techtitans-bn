import nodemailer from "nodemailer";
import path from "path";

const sendFunc = async (options, token) => {
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
    html: `Dear Sir/Madam,<br/><br/>You can reset Your password by clicking on the above link<br/><br/> <a href="${token}">${token}</a>`,
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
export default sendFunc;
