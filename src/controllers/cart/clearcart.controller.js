import db from "../../database/models";

const Cart = db.carts;
const User = db.users;
const Product = db.products;

// clear cart function
const clearCart = async (req, res) => {

  try {
    const productId = req.body.productId;
    const availableCart = await models.Cart.findOne({
      where: {
        id: productId,
      },
    });

    if (availableCart == null) {
      res.status(400).json({
        status: "fail",
        message: "🚫 Sorry, cart was not found...",
      });
    } else {
      await availableCart.deleteAll();
      res.status(200).json({
        status: "success",
        message: `🍀 Your cart is cleared successfully`,
      });
             }
        
          } catch (error) {
        res.status(500).json({ status: "fail", message: error.message });
    }
  }   


export default clearCart;