import models from "../../database/models";
import JwtUtility from "../../utils/jwt.util";
import db from "../../database/models";
const User = db.users;

export const sellerOrders = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = JwtUtility.verifyToken(token);
    const { id } = decodedToken;

    const orders = await models.Order.findAll({
      where: {},
      include: [
        {
          model: models.Product,
          as: "productOrder",
          where: { vendorId: id },
          attributes: [
            "id",
            "name",
            "description",
            "price",
            "images",
            "stock",
            "quantity",
          ],
          include: {
            model: User,
            as: "productVendor",
            attributes: ["id", "fullname", "email"],
          },
        },
        {
          model: models.Cart,
          as: "cart",
          attributes: [
            "id",
            "quantity",
            "userId",
            "total",
            "createdAt",
            "updatedAt",
            "products",
          ],
        },
        {
          model: User,
          as: "customer",
          attributes: ["id", "fullname", "email"],
        },
      ],
    });

    if (orders.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "🚫 You have no orders",
      });
    }

    const formattedOrders = [];

    for (const order of orders) {
      const formattedOrder = {
        orderId: order.id,
        orderStatus: order.status,
        orderTotal: order.total_price || order.cart.total,
        orderQuantity: order.quantity || order.cart.quantity,
        orderExpectedDeliveryDate: order.expected_delivery_date,
        customer: {
          name: order.customer.fullname,
          email: order.customer.email,
        },
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
            email: order.productOrder.productVendor.email,
          },
        },
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      };

      formattedOrders.push(formattedOrder);
    }

    res.status(200).json({
      status: "success",
      message: "📝 Orders retrieved successfully",
      data: formattedOrders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
