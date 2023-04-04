import db from '../../database/models';
import BcryptUtility from '../../utils/bcrypt.util';
import JwtUtility from '../../utils/jwt.util';

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
    const passwordMatch = await BcryptUtility.verifyPassword(
      password,
      user.password,
    );
    if (!passwordMatch) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    const token = JwtUtility.generateToken(
      {
        id: user.id,
        email: user.email,
      },
      '1d',
    );

    // Set cookie with the token as its value
    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // cynthia you must remember to set this to true in production(push) and false in dev
    });

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

export default login;
