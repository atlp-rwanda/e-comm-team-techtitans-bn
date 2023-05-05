import asyncHandler from "express-async-handler";
import models from "../../database/models";
import JwtUtility from "../../utils/jwt.util";
import db from "../../database/models";
const Order = db.orders;
const Cart = db.carts;

export const createOrder = async (req, res) => {
  try {
    let { cartId } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = JwtUtility.verifyToken(token);
    const { id } = decodedToken;
    const cartOrder = await models.Order.findOne({
      where: { cartId, userId: id },
    });
    if (cartOrder) {
      return res.status(403).json({
        message:
          "🚫 You have already ordered this product. please update your order instead.",
      });
    }
    const cart = await models.Cart.findOne({
      where: { id: cartId },
    });
    // Calculate the expected delivery date with 10 days from now
    const expectedDeliveryDate = new Date();
    expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 10);
    const order = await models.Order.create({
      userId: id,
      cartId,
      expected_delivery_date: expectedDeliveryDate,
    });

    const restoken = JwtUtility.generateToken(
      {
        total: cart.total,
      },
      "1y"
    );
    res.status(201).json({
      message: `🍀 Your order has been added successfully.`,
      token: restoken,
      data: {
        order: order.id,
        cartId: order.cartId,
        total: cart.total,
        quantity: cart.quantity,
        expected_delivery_date: order.expected_delivery_date,
      },
    });
  } catch (error) {
    console.log("**** Error ****", error);
    res.status(500).json({ status: "fail", message: error.message });
  }
};
export const buyNowOrder = async (req, res) => {
  try {
    let { productId, quantity } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = JwtUtility.verifyToken(token);
    const { id } = decodedToken;
    // Check if the product exists and is available
    const checkProduct = await models.Product.findOne({
      where: { id: productId, stock: "available" },
    });

    if (!checkProduct) {
      return res.status(404).json({
        ok: false,
        message: "🚫 Product not found!",
      });
    }
    // Check if the product is already order and not paid
    const checkOrder = await models.Order.findOne({
      where: { productId, userId: id, status: "pending" },
    });

    if (checkOrder) {
      return res.status(404).json({
        ok: false,
        message:
          "🚫 Your already order this product you need paid inorder to order it Again!",
      });
    }
    const product = await models.Product.findOne({ where: { id: productId } });
    console.log("product", product.quantity);
    if (quantity > product.quantity) {
      return res.status(404).json({
        ok: false,
        message: "🚫 You can't order more than the available quantity!",
      });
    }
    // Calculate the expected delivery date with 10 days from now
    const expectedDeliveryDate = new Date();
    expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 10);
    const neworder = await models.Order.create({
      userId: id,
      quantity,
      productId,
      total_price: product.price * quantity,
      expected_delivery_date: expectedDeliveryDate,
    });

    const restoken = JwtUtility.generateToken(
      {
        total: neworder.total_price,
      },
      "1d"
    );
    res.status(201).json({
      message: `🍀 Your order has been added successfully.`,
      token: restoken,
      data: neworder,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ status: "fail", message: error.message });
  }
};

export const listOrders = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = JwtUtility.verifyToken(token);
    const { id } = decodedToken;

    const orders = await models.Order.findAll({
      where: { userId: id },
      include: [
        {
          model: models.Product,
          as: "product",
          attributes: [
            "id",
            "name",
            "description",
            "price",
            "images",
            "stock",
            "quantity",
          ],
        },
      ],
    });

    if (orders.length === 0) {
      res.status(404).json({
        message: "🚫 You have no orders",
      });
      return;
    }

    const formattedOrders = [];

    for (const order of orders) {
      let cart = null;

      if (order.cartId) {
        cart = await models.Cart.findOne({ where: { id: order.cartId } });
      }

      const formattedOrder = {
        orderId: order.id,
        orderStatus: order.status,
        orderTotal: order.total_price,
        orderQuantity: order.quantity,
        orderExpectedDeliveryDate: order.expected_delivery_date,
        userId: order.userId,
        product: order.product,
        cartId: cart,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      };

      formattedOrders.push(formattedOrder);
    }

    res.status(200).json({
      message: "📝 Orders retrieved successfully",
      data: formattedOrders,
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = JwtUtility.verifyToken(token);
    const { id } = decodedToken;

    const order = await models.Order.findOne({
      where: { id: req.params.id, userId: id },
      include: [
        {
          model: models.Product,
          as: "product",
          attributes: ["id", "name", "description", "price", "images", "stock"],
        },
        {
          model: models.Cart,
          as: "cart", // specify the alias for this association
        },
      ],
    });

    if (!order) {
      return res.status(404).json({
        status: "fail",
        message: "🚫 Order not found",
      });
    }
    // Retrieve the cart object from the Cart model using the cartId
    const cart = await models.Cart.findOne({ where: { id: order.cartId } });
    res.status(200).json({
      status: "success",
      message: "📝 Order retrieved successfully",
      data: {
        id: order.id,
        status: order.status,
        total_price: order.total_price,
        quantity: order.quantity,
        expected_delivery_date: order.expected_delivery_date,
        user_id: order.userId,
        cart: cart,
        product: order.product,
        created_at: order.createdAt,
        updated_at: order.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = JwtUtility.verifyToken(token);
    const { id } = decodedToken;

    const order = await models.Order.findOne({
      where: { id: req.params.id, userId: id },
    });

    if (!order) {
      return res.status(404).json({
        status: "fail",
        message: "🚫 Order not found or does not belong to you",
      });
    }

    await order.destroy();

    res.status(200).json({
      status: "success",
      message: "🍀 Order deleted successfully",
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
export const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { quantity } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = JwtUtility.verifyToken(token);
    const { id } = decodedToken;

    // Find the order by ID and user ID
    const order = await models.Order.findOne({
      where: { id: orderId, userId: id },
      include: [
        {
          model: models.Product,
          as: "product",
          attributes: ["id", "name", "price", "quantity"],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({
        status: "fail",
        message: "Order not found or does not belong to this user",
      });
    }

    // Check if the new quantity is available in stock
    const product = order.product;
    if (quantity > product.quantity) {
      return res.status(400).json({
        status: "fail",
        message: "🚫 You cannot order more than the available quantity",
      });
    }
    // Update the order with the new quantity
    order.quantity = quantity;
    order.total_price = product.price * quantity;
    await order.save();

    res.status(200).json({
      status: "success",
      message: "Order updated successfully",
      data: {
        orderId: order.id,
        orderStatus: order.status,
        orderTotal: order.total_price,
        orderQuantity: order.quantity,
        orderExpectedDeliveryDate: order.expected_delivery_date,
        userId: order.userId,
        product: {
          productId: product.id,
          productName: product.name,
          productPrice: product.price,
        },
        cart: order.cartId ? { id: order.cartId } : null,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};
