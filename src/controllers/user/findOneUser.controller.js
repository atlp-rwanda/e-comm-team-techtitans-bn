import db from '../../database/models';

const User = db.users;

const findUserById = async (req, res) => {
  try {
    const userId = req.params.id; 

    const user = await User.findByPk(userId, {
      attributes: {
        exclude: ['password'],
      },
    });

    if (!user) {
      res.status(404).json({
        status: 'fail',
        message: '🚫 User not found.',
      });
    } else {
      res.status(200).json({
        status: 'success',
        message: '🍀 User Fetched Successfully.',
        data: user,
      });
    }
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message });
  }
};

export default findUserById;