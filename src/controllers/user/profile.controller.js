import db from '../../database/models';

const User = db.users;

// update a profile
const updateProfile = async (req, res) => {
  const { uuid } = req.params;
  const {
    gender,
    birthdate,
    preferredLanguage,
    preferredCurrency,
    location,
    billingAddress,
  } = req.body;

  try {
    const user = await User.findOne({ where: { uuid } });
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
        billingAddress: user.billingAddress,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Server error',
    });
  }
};

export default updateProfile;
