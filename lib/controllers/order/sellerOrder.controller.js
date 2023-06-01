"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sellerOrders = void 0;
var _models = _interopRequireDefault(require("../../database/models"));
var _jwt = _interopRequireDefault(require("../../utils/jwt.util"));
var _sequelize = require("sequelize");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const User = _models.default.users;
const sellerOrders = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = _jwt.default.verifyToken(token);
    const {
      id
    } = decodedToken;
    const orders = await _models.default.Order.findAll({
      where: {},
      include: [{
        model: _models.default.Product,
        as: "productOrder",
        where: {
          vendorId: id
        },
        attributes: ["id", "name", "description", "price", "images", "stock", "quantity"],
        include: {
          model: User,
          as: "productVendor",
          attributes: ["id", "fullname", "email"]
        }
      }, {
        model: _models.default.Cart,
        as: "cart",
        attributes: ["id", "quantity", "userId", "total", "createdAt", "updatedAt", "products"]
      }, {
        model: User,
        as: "customer",
        attributes: ["id", "fullname", "email"]
      }]
    });
    if (orders.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "🚫 You have no orders"
      });
    }
    const formattedOrders = [];
    for (const order of orders) {
      const formattedOrder = {
        orderId: order.id,
        orderStatus: order.status,
        orderTotal: order.total_price,
        orderQuantity: order.quantity,
        orderExpectedDeliveryDate: order.expected_delivery_date,
        userId: order.customer.id,
        product: {
          id: order.productOrder.id,
          name: order.productOrder.name,
          description: order.productOrder.description,
          price: order.productOrder.price,
          images: order.productOrder.images,
          stock: order.productOrder.stock,
          quantity: order.productOrder.quantity,
          vendor: {
            id: order.productOrder.productVendor.id,
            fullname: order.productOrder.productVendor.fullname,
            email: order.productOrder.productVendor.email
          }
        },
        cartId: order.cart ? {
          id: order.cart.id,
          products: order.cart.products,
          quantity: order.cart.quantity,
          userId: order.cart.userId,
          total: order.cart.total,
          createdAt: order.cart.createdAt,
          updatedAt: order.cart.updatedAt
        } : null,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      };
      formattedOrders.push(formattedOrder);
    }
    res.status(200).json({
      status: "success",
      message: "📝 Orders retrieved successfully",
      data: formattedOrders
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "fail",
      message: error.message
    });
  }
};
exports.sellerOrders = sellerOrders;