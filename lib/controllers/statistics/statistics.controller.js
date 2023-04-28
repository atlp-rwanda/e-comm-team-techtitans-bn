"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _sequelize = require("sequelize");
var _models = _interopRequireDefault(require("../../database/models"));
var _jwt = _interopRequireDefault(require("../../utils/jwt.util"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const User = _models.default.users;
const Order = _models.default.orders;
const checkStats = async (req, res) => {
  try {
    const tokenHeader = req.headers.authorization;
    const token = tokenHeader.split(' ')[1];
    const decodedToken = _jwt.default.verifyToken(token);
    const user = await User.findOne({
      where: {
        id: decodedToken.id
      }
    });
    if (!user || !decodedToken || decodedToken.roleId !== 2) {
      return res.status(401).send({
        message: 'Unauthorized User'
      });
    }
    const startTime = new Date('2023-04-27T13:00:00Z');
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const stats = {
      pending: {
        orders: 0,
        revenue: 0,
        orderList: []
      },
      processing: {
        orders: 0,
        revenue: 0,
        orderList: []
      },
      shipped: {
        orders: 0,
        revenue: 0,
        orderList: []
      },
      delivered: {
        orders: 0,
        revenue: 0,
        orderList: []
      }
    };
    const clearOrderList = status => status.orderList = [];
    Object.values(stats).forEach(clearOrderList);
    const addOrder = (order, status) => {
      stats[status].orders++;
      stats[status].revenue += order.total_price;
      stats[status].orderList.push({
        orderId: order.id,
        totalPrice: order.total_price
      });
    };
    const sortByTotalPriceDesc = (a, b) => b.totalPrice - a.totalPrice;
    for (let year = startTime.getFullYear(), month = startTime.getMonth() + 1; year < currentYear || year === currentYear && month <= currentMonth; month === 12 ? (year++, month = 1) : month++) {
      const nextMonth = month === 12 ? new Date(year + 1, 1, 1) : new Date(year, month, 1);
      const where = {
        createdAt: {
          [_sequelize.Op.between]: [new Date(year, month - 1, 1), nextMonth]
        }
      };
      const orders = await _models.default.Order.findAll({
        where
      });
      for (const order of orders) {
        addOrder(order, order.status);
      }
    }
    Object.values(stats).forEach(status => status.orderList.sort(sortByTotalPriceDesc));
    return res.status(200).json({
      message: "📈 Here is your statistics for the last month!",
      stats
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: 'internal server error'
    });
  }
};
var _default = checkStats;
exports.default = _default;