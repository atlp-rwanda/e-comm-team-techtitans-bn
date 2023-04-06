import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import db from '../../database/models';
import sendFunc from '../../utils/resetPasswordEmail';

const User = db.users;
const resetSecret = process.env.RESET_SECRET;

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    // look for email in database
    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(404).json({ error: 'Invalid Email' });
    } else {
      // res.status(200).json({message:'User exist'})

      const token = jwt.sign({ user: user.email }, resetSecret, {
        expiresIn: '10m',
      });
      const link = `https://ecommerce-tech-titans.herokuapp.com/api/v1/user/reset-password/${user.id}/${token}`;
      sendFunc(user, link);
      res.status(201).json({
        message: 'Password reset Link has been send to your email ....',
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getResetPassword = async (req, res) => {
  const { id, token } = req.params;
  // check if id exist
  const user = await User.findOne({ where: { id } });
  if (!user) {
    res.status(404).json({ error: 'user not exist' });
  } else {
    try {
      const payload = jwt.verify(token, resetSecret);
      return res.send({ email: user.email });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password, confirmPassword } = req.body;
  // check if id exist
  const user = await User.findOne({ where: { id } });
  if (!user) {
    res.status(404).json({ error: 'user not exist' });
  } else {
    try {
      const payload = jwt.verify(token, resetSecret);
      switch (true) {
        case password.trim() === '':
          res.status(401).json({
            message: 'Please enter a password.',
          });
          break;
        case password.trim().length < 8:
          res.status(401).json({
            message: 'Your password must be at least 8 characters long.',
          });
          break;
        //   case !user.password.match(/^[a-z0-9]+$/i):
        case !password.match(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/i,
        ):
          res.status(401).json({
            message:
              'Your password must contain at least 1 uppercase, 1 lowercase, 1 digit, and one case character.',
          });
          break;
        case confirmPassword.trim() === '':
          res.status(401).json({
            message: 'Please input your password again.',
          });
          break;
        case password !== confirmPassword:
          res.status(401).json({
            message: 'Both passwords must match.',
          });
          break;
        default:
          try {
            const payload = jwt.verify(token, resetSecret);
            // user.password = password;
            User.findOne({ where: { id } })
              .then((user) => {
                user.password = bcrypt.hashSync(password, 10);
                return user.save();
              })
              .then((theData) => {
                res.status(200).json({
                  message: 'Password successfuly reset',
                  data: theData,
                });
              });
          } catch (error) {
            res.status(500).json({ message: error.message });
          }
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
};
export { forgotPassword, getResetPassword, resetPassword };
