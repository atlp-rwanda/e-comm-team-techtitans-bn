import db from '../../database/models';
// import { Cart } from '../../database/models';

const Cart = db.carts;

const findProductById = async (id) => Products.findByPk(id);
// get one cart
const getCart = async (userId) => Cart.findOne({ where: { userId: userId } });
// find the products to add in the cart
const getCartProducts = async (products) =>
  Promise.all(products.map(async (product) => findProductById(product)));
export { findProductById, getCart, getCartProducts };
