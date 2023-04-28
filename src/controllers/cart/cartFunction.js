import db from "../../database/models";
import models from "../../database/models";
// const Cart = db.carts;

const findProductById = async (id) => Products.findByPk(id);
// get one cart
const getCart = async (userId) =>
  models.Cart.findOne({ where: { userId: userId } });
// find the products to add in the cart
const getCartProducts = async (products) =>
  Promise.all(products.map(async (product) => findProductById(product)));

const updateCart = async (fields, cartId) => {
  return models.Cart.update({ ...fields }, { where: { id: cartId } });
};

export { findProductById, getCart, getCartProducts, updateCart };
