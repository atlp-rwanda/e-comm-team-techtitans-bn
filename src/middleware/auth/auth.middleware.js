// This middleware will help in checking a User's role such as 'Admin', 'Seller', 'Buyer'
import db from '../../database/models';
import JwtUtility from '../../utils/jwt.util';

const User = db.users;

const isAdmin = async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]; // assuming the token is sent in the Authorization header
  const { uuid } = req.params;
  try {
    const decodedToken = JwtUtility.verifyToken(token);
    const user = await User.findOne({ where: { uuid: decodedToken.uuid } });
    if (user && decodedToken && decodedToken.role === 1) {
      next();
    } else {
      res
        .status(403)
        .json({ message: 'Your are Unauthorized to perform this action' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const isSeller = async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]; // assuming the token is sent in the Authorization header
  const { uuid } = req.params;
  try {
    const decodedToken = JwtUtility.verifyToken(token);
    if (decodedToken.role === 2) {
      next();
    } else {
      res
        .status(403)
        .json({ message: 'Your are Unauthorized to perform this action' });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: 'Your are Unauthorized to perform this action' });
  }
};

const isBuyer = async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]; // assuming the token is sent in the Authorization header
  const { uuid } = req.params;
  try {
    const decodedToken = JwtUtility.verifyToken(token);
    const user = await User.findOne({ where: { uuid: decodedToken.uuid } });
    if (user && decodedToken && decodedToken.role === 3) {
      next();
    } else {
      res
        .status(403)
        .json({ message: 'Your are Unauthorized to perform this action' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const checkPermission = (permission) => async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]; // assuming the token is sent in the Authorization header
  // const { uuid } = req.params;
  const permissions = {
    1: ['manage users', 'manage products'],
    2: ['manage products'],
    3: ['view products'],
  };

  try {
    const decodedToken = JwtUtility.verifyToken(token);
    const user = await User.findOne({ where: { uuid: decodedToken.uuid } });
    const role = decodedToken?.role;
    if (user && permissions[role]?.includes(permission)) {
      next();
    } else {
      // next();
      res
        .status(403)
        .json({ message: 'Your are Unauthorized to perform this action' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { isAdmin, isSeller, isBuyer, checkPermission };
