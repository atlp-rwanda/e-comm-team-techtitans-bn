import db from '../../database/models';
import speakeasy from 'speakeasy';
import JwtUtility from '../../utils/jwt.util';

const User = db.users;

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        message: 'Please provide valid OTP/email',
      });
    }
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or OTP',
      });
    }

    // Verify the one-time code
    const secret = user.mfa_secret;
    const isValid = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: otp,
      window: 1,
    });
    console.log('isValid', isValid);
    if (!isValid) {
      return res.status(401).json({
        message: 'Invalid one-time code',
      });
    }

    // Generate a new JWT token and set it as a cookie
    const token = JwtUtility.generateToken(
      {
        id: user.id,
        email: user.email,
        roleId: user.roleId,
      },
      '1y',
    );
    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // cynthia you must remember to set this to true in production(push) and false in dev
    });

    // Return a response indicating that the login was successful
    res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export default verifyOtp;
