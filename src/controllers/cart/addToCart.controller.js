import JwtUtility from "../../utils/jwt.util";

import { isBuyer } from "../../middleware/auth/auth.middleware";
import db from "../../database/models";
import models from "../../database/models";

const { getCart, updateCart } = require("./cartFunction");

const User = db.users;
const Cart = db.carts;

// add to cart function
const addItemToCart = async (req, res) => {
  try {
    const tokenHeader = req.headers.authorization;

    const token = tokenHeader.split(" ")[1];

    const decodedToken = JwtUtility.verifyToken(token);

    const user = await User.findOne({ where: { id: decodedToken.id } });
    const { productId, productQuantity } = req.body;

    if (!user || !decodedToken || decodedToken.roleId !== 3) {
      // If a user is not a buyer.
      return res.status(401).json({
        error: new Error("User is not a buyer").message,
        message: "Please create a buyer account",
      });
    }

    const product = await models.Product.findByPk(productId);
    if (!product) {
      // If a product is not in the database
      return res.status(400).json({ message: "Product does not exist" });
    }

    if (product.quantity < productQuantity) {
      // If a buyer chooses more than what exists.
      return res
        .status(400)
        .json({ message: "We do not have sufficient products" });
    }

    let cart = await getCart(decodedToken.id);
    const products = cart ? cart.products : [];

    const existingProduct = products.find((p) => p.id === productId);
    if (existingProduct) {
      existingProduct.quantity += productQuantity;
    } else {
      const newProduct = {
        id: productId,
        name: product.name,
        quantity: productQuantity,
        price: product.price,
        images: product.images,
        vendorId: product.vendorId,
        total: product.price * productQuantity,
      };
      products.push(newProduct);
    }

    const total = products.reduce((acc, curr) => acc + curr.total, 0);

    if (!cart) {
      // If the cart doesn't exist
      cart = await models.Cart.create({
        userId: decodedToken.id,
        products,
        total,
      });
    } else {
      // If the cart existed, it will be updated
      await updateCart({ products, total }, cart.id);
    }

    return res.status(201).json({
      message: `${product.name} has been added to your cart`,
      cart: { products, total },
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      error: error.message,
      message:
        "Sorry, we encountered an error while trying to add the product to your cart.",
    });
  }
};
export default addItemToCart;
