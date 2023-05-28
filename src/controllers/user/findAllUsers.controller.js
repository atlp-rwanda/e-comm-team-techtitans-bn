import db from '../../database/models';

const User = db.users;

const findAllUsers = async (req, res) => {
  try {
    const users = await User.findAndCountAll({
      where: {},
      attributes: {
        exclude: ['password'],
      },
    });

    if (users.length <= 0) {
      res.status(404).json({
        status: 'fail',
        message: '🚫 Oops...no user found at the moment.',
      });
    } else {
      res.status(200).json({
        status: 'success',
        message: `🍀 ${users.length} Users Fetched Successfully.`,
        data: users,
      });
    }
  } catch (error) {
    console.log("error ******",error)
    res.status(500).json({ status: 'fail', message: error.message });
  }
};

export default findAllUsers;