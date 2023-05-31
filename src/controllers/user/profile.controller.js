import db from '../../database/models';
import JwtUtility from '../../utils/jwt.util';

const User = db.users;

// update a profile
const updateProfile = async (req, res) => {
  const {
    image,
    gender,
    birthdate,
    preferredLanguage,
    preferredCurrency,
    location,
    billingAddress,
  } = req.body;

  try {
    const tokenHeader = req.headers.authorization;

    // Check if tokenHeader exists
    if (!tokenHeader) {
      return res.status(401).json({ error: 'Missing authorization header' });
    }

    const token = tokenHeader.split(' ')[1];

    // Verify the token
    const decodedToken = JwtUtility.verifyToken(token);

    // Find the user by ID
    const user = await User.findByPk(decodedToken.id);
    // Check if user exists
    if (!user) {
      return res.status(401).json({ error: 'Invalid user' });
    }

    // Update the user's profile
    user.image = image;
    user.gender = gender;
    user.birthdate = birthdate;
    user.preferredLanguage = preferredLanguage;
    user.preferredCurrency = preferredCurrency;
    user.location = location;
    user.billingAddress = billingAddress;

    await user.save();
    // Get the user's name and email from the database
    const { fullname, email } = await User.findOne({ where: { id: decodedToken.id }, attributes: ['fullname', 'email'] });

    // Return the updated user's profile
    return res.status(201).json({
      user: {
        fullname,
        email,
        image: user.image,
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

const getProfile = async (req,res) => {
  try {
    const tokenHeader = req.headers.authorization;
    // Check if tokenHeader exists
    if (!tokenHeader) {
      return res.status(401).json({ error: 'Missing authorization header' });
    }
    const token = tokenHeader.split(' ')[1];
    // Verify the token
    const decodedToken = JwtUtility.verifyToken(token);
    // Find the user by ID
    const user = await User.findByPk(decodedToken.id);
    // Check if user exists
    if (!user) {
      return res.status(401).json({ error: 'Invalid user' });
    }
    // Get the user's name and email from the database
    const { fullname, email } = await User.findOne({ where: { id: decodedToken.id }, attributes: ['fullname', 'email'] });
    // Return the updated user's profile
    return res.status(200).json({
      message:'success',
      user: {
        id: user.id,
        fullname,
        email,
        image: user.image,
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






export {updateProfile, getProfile};

