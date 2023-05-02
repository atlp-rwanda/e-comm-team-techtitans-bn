import { Op } from 'sequelize';
import db from '../../database/models';
import models from '../../database/models';

const User = db.users;

// eslint-disable-next-line import/prefer-default-export
export const searchForUsers = async (req, res) => {
  try {
    const { fullname } = req.query;

    const query = {};
    // check if name query param exists and add it to the query object
    if (fullname) {
      query.fullname = { [Op.iLike]: `%${fullname}%` };
    }

    const users = await User.findAndCountAll({
      where: query,
    });

    // check if any products were found and send appropriate response
    if (users.count <= 0) {
      res.status(404).json({
        message: '🚫 Oops...this user was not found',
      });
    } else {
      res.status(200).json({
        message: `🍀 ${users.count} users Found Successfully.`,
        data: users.rows,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
