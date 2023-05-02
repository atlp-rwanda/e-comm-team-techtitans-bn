import { Op } from 'sequelize';
import db from '../../database/models';
import models from '../../database/models';
import JwtUtility from '../../utils/jwt.util';

const User = db.users;

const checkStats = async (req, res) => {
  try {
    const tokenHeader = req.headers.authorization;
    const token = tokenHeader.split(' ')[1];
    const decodedToken = JwtUtility.verifyToken(token);
    const user = await User.findOne({ where: { id: decodedToken.id } });

    if (!user || !decodedToken || decodedToken.roleId !== 2) {
      return res.status(401).send({ message: "Please login with your seller's account"});
    }

    // Check if startDate and endDate are provided
    const { startDate } = req.query;
    const { endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).send({ message: 'Please provide both startDate and endDate' });
    }

    // Check if startDate and endDate are valid dates
    const startDateTime = new Date(startDate).getTime();
    const endDateTime = new Date(endDate).getTime();
    if (!startDateTime || !endDateTime) {
      return res.status(400).send({ message: 'Please provide valid startDate and endDate' });
    }

    const stats = {
      pending: { orders: 0, revenue: 0, orderList: [] },
      processing: { orders: 0, revenue: 0, orderList: [] },
      shipped: { orders: 0, revenue: 0, orderList: [] },
      delivered: { orders: 0, revenue: 0, orderList: [] }
    };

    const clearOrderList = (status) => status.orderList = [];
    Object.values(stats).forEach(clearOrderList);

    const addOrder = (order, status) => {
      stats[status].orders++;
      stats[status].revenue += order.total_price;
      stats[status].orderList.push({ orderId: order.id, totalPrice: order.total_price });
    };

    const sortByTotalPriceDesc = (a, b) => b.totalPrice - a.totalPrice;

    const orders = await models.Order.findAll({
      where: {
        createdAt: {
          [Op.between]: [new Date(startDateTime), new Date(endDateTime)]
        }
      }
    });

    for (const order of orders) {
      addOrder(order, order.status);
    }

    Object.values(stats).forEach((status) => status.orderList.sort(sortByTotalPriceDesc));

    return res.status(200).json({ message: "📈 Here is your statistics for the specified time frame!", stats });
  } catch (error) {
    return res.status(500).json({ error: 'internal server error' });
  }
};

export default checkStats;
