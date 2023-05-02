import { Op } from 'sequelize';
import db from '../../database/models';
import models from "../../database/models";
import JwtUtility from '../../utils/jwt.util';

const User = db.users;
const Order = db.orders;

const checkStats = async (req, res) => {
  try {
    const tokenHeader = req.headers.authorization;
    const token = tokenHeader.split(' ')[1];
    const decodedToken = JwtUtility.verifyToken(token);
    const user = await User.findOne({ where: { id: decodedToken.id } });

    if (!user || !decodedToken || decodedToken.roleId !== 2) {
      return res.status(401).send({ message: 'Unauthorized User' });
    }

    const startTime = new Date('2023-04-27T13:00:00Z');
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const stats = {
      pending: { orders: 0, revenue: 0, orderList: [] },
      processing: { orders: 0, revenue: 0, orderList: [] },
      shipped: { orders: 0, revenue: 0, orderList: [] },
      delivered: { orders: 0, revenue: 0, orderList: [] }
    };

    const clearOrderList = status => status.orderList = [];
    Object.values(stats).forEach(clearOrderList);

    const addOrder = (order, status) => {
      stats[status].orders++;
      stats[status].revenue += order.total_price;
      stats[status].orderList.push({ orderId: order.id, totalPrice: order.total_price });
    };

    const sortByTotalPriceDesc = (a, b) => b.totalPrice - a.totalPrice;

    for (let year = startTime.getFullYear(), month = startTime.getMonth() + 1; 
      year < currentYear || (year === currentYear && month <= currentMonth); 
      month === 12 ? (year++, month = 1) : month++) 
    {
      const nextMonth = month === 12 ? new Date(year + 1, 1, 1) : new Date(year, month, 1);

      const where = { createdAt: { [Op.between]: [new Date(year, month - 1, 1), nextMonth] } };
      const orders = await models.Order.findAll({ where });

      for (const order of orders) {
        addOrder(order, order.status);
      }
    }

    Object.values(stats).forEach(status => status.orderList.sort(sortByTotalPriceDesc));

    return res.status(200).json({ message: "📈 Here is your statistics for the last month!", stats });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'internal server error' });
  }
};

export default checkStats;
