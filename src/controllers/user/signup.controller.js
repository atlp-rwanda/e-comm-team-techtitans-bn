import jwt from 'jsonwebtoken';
import db from '../../database/models';
import BcryptUtility from '../../utils/bcrypt.util';
import JwtUtility from '../../utils/jwt.util';
import response from '../../utils/response.util';
import sendEmail from '../../utils/send.email';

const User = db.users;
// Create and Save a new User
const verifyUser = async (req, res) => {
  try {
    const user = {
      ...req.body,
    };
    const emailAlreadyExists = await User.findOne({
      where: { email: user.email },
    });
    if (emailAlreadyExists !== null) {
      res.status(401).json({
        message: 'Email already exists',
      });
    } else {
      switch (true) {
        case user.fullname.trim() === '':
          res.status(401).json({
            message: 'Please enter your name',
          });
          break;
        case user.email.trim() === '':
          res.status(401).json({
            message: 'Email can not be empty',
          });
          break;
        case !/\S+@\S+\.\S+/.test(user.email):
          res.status(401).json({
            message: 'Please enter a valid email address.',
          });
          break;
        case user.password.trim() === '':
          res.status(401).json({
            message: 'Please enter a password.',
          });
          break;
        case user.password.trim().length < 8:
          res.status(401).json({
            message: 'Your password must be at least 8 characters long.',
          });
          break;
        //   case !user.password.match(/^[a-z0-9]+$/i):
        case !user.password.match(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/i,
        ):
          res.status(401).json({
            message:
              'Your password must contain at least 1 uppercase, 1 lowercase, 1 digit, and one case character.',
          });
          break;
        case user.confirmPassword.trim() === '':
          res.status(401).json({
            message: 'Please input your password again.',
          });
          break;
        case user.password !== user.confirmPassword:
          res.status(401).json({
            message: 'Both passwords must match.',
          });
          break;
        default:
          // Encrypt the Password
          user.password = await BcryptUtility.hashPassword(req.body.password);
          const to = user.email;
          const userToken = JwtUtility.generateToken(user, '1h');
          const context = {
            verifyUrl: `${process.env.VERIFICATION_URL}/api/v1/user/signup/${userToken}`,
            content: 'VERIFY YOUR EMAIL',
          };
          sendEmail.sendVerification(to, 'verification email', context);
          response.success(
            res,
            200,
            'Check your email and proceed with verification',
            {
              email: user.email,
              userToken,
            },
          );
          break;
      }
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Create a new user
const createUser = async (req, res) => {
  const { token } = req.params;
  const check = jwt.verify(token, process.env.SECRET_TOKEN);
  const existUser = await User.findOne({ where: { email: check.email } });
  if (existUser) {
    res.status(400).send({
      message: 'User already VERIFIED',
    });
  }
  if (!existUser) {
    User.create(check)
      .then((data) => {
        const { password, ...rest } = data.dataValues;
        res.status(201).send({
          message: 'check a welcoming message we sent you...',
          data: rest,
        });
      })
      .catch((err) => {
        res.status(500).send({
          message: 'Internal Server Error',
        });
      });
  }
  const context = {
    verifyUrl: `${process.env.WELCOME_URL}`,
    content: 'GET STARTED',
  };
  sendEmail.sendWelcome(check.email, 'verification email', context);
};

export { verifyUser, createUser };
