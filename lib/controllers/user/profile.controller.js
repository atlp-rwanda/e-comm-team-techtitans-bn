"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _models = _interopRequireDefault(require("../../database/models"));
var _jwt = _interopRequireDefault(require("../../utils/jwt.util"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const User = _models.default.users;

// update a profile
const updateProfile = async (req, res) => {
  const {
    gender,
    birthdate,
    preferredLanguage,
    preferredCurrency,
    location,
    billingAddress
  } = req.body;
  try {
    const tokenHeader = req.headers.authorization;

    // Check if tokenHeader exists
    if (!tokenHeader) {
      return res.status(401).json({
        error: 'Missing authorization header'
      });
    }
    const token = tokenHeader.split(' ')[1];

    // Verify the token
    const decodedToken = _jwt.default.verifyToken(token);

    // Find the user by ID
    const user = await User.findByPk(decodedToken.id);
    // Check if user exists
    if (!user) {
      return res.status(401).json({
        error: 'Invalid user'
      });
    }

    // Update the user's profile
    user.gender = gender;
    user.birthdate = birthdate;
    user.preferredLanguage = preferredLanguage;
    user.preferredCurrency = preferredCurrency;
    user.location = location;
    user.billingAddress = billingAddress;
    await user.save();
    // Get the user's name and email from the database
    const {
      fullname,
      email
    } = await User.findOne({
      where: {
        id: decodedToken.id
      },
      attributes: ['fullname', 'email']
    });

    // Return the updated user's profile
    return res.status(201).json({
      user: {
        fullname,
        email,
        gender: user.gender,
        birthdate: user.birthdate,
        preferredLanguage: user.preferredLanguage,
        preferredCurrency: user.preferredCurrency,
        location: user.location,
        billingAddress: user.billingAddress
      }
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Server error'
    });
  }
};
var _default = updateProfile;
exports.default = _default;