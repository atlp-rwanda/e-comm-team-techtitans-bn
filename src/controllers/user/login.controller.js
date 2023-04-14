import db from "../../database/models";
import BcryptUtility from "../../utils/bcrypt.util";
import JwtUtility from "../../utils/jwt.util";
import sendEmail from '../../utils/send.email';
import speakeasy from 'speakeasy';

const User = db.users;

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: 'Please provide both email and password',
      });
    }
    // Find the email of the user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }
    // Check if the user password matches
    const passwordMatch = await BcryptUtility.verifyPassword(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }
    const secret = speakeasy.generateSecret();


    if (user.roleId == 3) {

      const token = JwtUtility.generateToken(
        {
          id: user.id,
          email: user.email,
        },
        '1d'
      );
      res.cookie("token", token, {
        httpOnly: true,
        secure: true, // cynthia you must remember to set this to true in production(push) and false in dev
      });

      // Return a response indicating that the login was successful
      return res.status(200).json({
        message: 'Login successful',
        token,
      });

    } else {
      console.log(user)
      user.mfa_secret = secret.base32;
      await user.save();

      const otp = speakeasy.totp({
        secret: secret.base32,
        encoding: 'base32',
      });
      const to = email;
      const subject = 'Your OTP';
    
      const context = {
        otp
      };
      sendEmail.sendEmail(to, subject, context)
      console.log(`Your one-time code is: ${otp}`);

      // Return a response indicating that the user needs to enter their one-time code
      return res.status(202).json({
        message: 'Please enter your OTP',
        user: {
          id: user.id,
          email: user.email,
          secondFactorEnabled: user.mfa_secret ? true : false,
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }

};

export default login;
