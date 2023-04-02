"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _models = _interopRequireDefault(require("../../database/models"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const User = _models.default.users;

// update a profile
const updateProfile = async (req, res) => {
  const {
    uuid
  } = req.params;
  const {
    gender,
    birthdate,
    preferredLanguage,
    preferredCurrency,
    location,
    billingAddress
  } = req.body;
  try {
    const user = await User.findOne({
      where: {
        uuid
      }
    });
    user.gender = gender;
    user.birthdate = birthdate;
    user.preferredLanguage = preferredLanguage;
    user.preferredCurrency = preferredCurrency;
    user.location = location;
    user.billingAddress = billingAddress;
    await user.save();
    return res.status(201).json({
      user: {
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