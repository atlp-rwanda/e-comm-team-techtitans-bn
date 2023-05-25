import JwtUtility from "../../utils/jwt.util";
import db from "../../database/models";
import models from "../../database/models";
const Cart = db.carts;

const viewCart = async (req, res) => {
  try {
    const tokenHeader = req.headers.authorization;

    const token = tokenHeader.split(" ")[1];

    const decodedToken = JwtUtility.verifyToken(token);

    const cart = await models.Cart.findAll({
      where: { userId: decodedToken.id }
    });

    if (!cart || cart.length == 0) {
      return res.status(404).json({ message: "Your cart is empty" });
    }

    res.status(200).json({
      message: "Your cart has been retrieved successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Sorry, we encountered an error while trying to view your cart.",
    });
  }
};

export default viewCart;
