"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wishlist = exports.removeWishlistItem = exports.getAllWishes = void 0;
var _models = _interopRequireDefault(require("../../database/models"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _jwt = _interopRequireDefault(require("../../utils/jwt.util"));
var _bcrypt = _interopRequireDefault(require("bcrypt"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Users = _models.default.users;
const Products = _models.default.Product;
const Wishlists = _models.default.Wishlist;
const secretToken = process.env.SECRET_TOKEN;
const wishlist = async (req, res) => {
  const tokenHeader = req.headers.authorization;
  if (!tokenHeader) {
    return res.status(401).json({
      message: "Token not provided"
    });
  }
  const token = tokenHeader.split(" ")[1];
  try {
    const decodedToken = _jwt.default.verifyToken(token);
    const {
      product_id
    } = req.body;
    const user = await Users.findOne({
      where: {
        email: decodedToken.email
      }
    });
    const product = await Products.findOne({
      where: {
        id: product_id
      }
    });
    if (!product) {
      return res.status(500).json({
        message: `Product does not exist`
      });
    } else {
      const user_id = user.id;
      const _product_id = product.id;
      const product_name = product.name;
      const product_price = product.price;
      const product_image = product.images;
      console.log(product_name);
      const productExist = await Wishlists.findOne({
        where: {
          product_id: _product_id,
          user_id
        }
      });
      if (productExist) {
        return res.status(500).json({
          message: `Product already exists in your wishlist`
        });
      }
      const wishList = await Wishlists.create({
        user_id,
        product_id: _product_id,
        product_name,
        product_price,
        product_image
      });
      return res.status(201).json({
        message: "Product successfully added to the wishlist",
        data: wishList
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
exports.wishlist = wishlist;
const getAllWishes = async (req, res) => {
  const {
    token
  } = req.params;
  const limit = req.query.limit || 10;
  const offset = req.query.offset || 0;
  try {
    const payload = _jsonwebtoken.default.verify(token, secretToken);
    const {
      email
    } = payload;
    const userId = await Users.findOne({
      where: {
        email
      }
    });
    const user_id = userId.id;
    const allWishList = await Wishlists.findAndCountAll({
      where: {
        user_id
      },
      limit,
      offset
    });
    const result = allWishList.rows;
    const totalCount = allWishList.count;
    if (result.length <= 0) {
      res.status(404).json({
        status: "fail",
        message: "No wishlist found at the moment."
      });
    } else {
      res.status(200).json({
        status: "success",
        message: `${result.length} wishlists fetched successfully.`,
        data: result,
        currentPage: offset / limit + 1,
        totalPages: Math.ceil(totalCount / limit)
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
exports.getAllWishes = getAllWishes;
const removeWishlistItem = async (req, res) => {
  const tokenHeader = req.headers.authorization;
  if (!tokenHeader) {
    return res.status(401).json({
      message: "Token not provided"
    });
  }
  const token = tokenHeader.split(" ")[1];
  try {
    const decodedToken = _jwt.default.verifyToken(token);
    const {
      product_id
    } = req.body;
    const user = await Users.findOne({
      where: {
        email: decodedToken.email
      }
    });
    const user_id = user.id;
    const deletedCount = await Wishlists.destroy({
      where: {
        product_id,
        user_id
      }
    });
    if (deletedCount === 0) {
      return res.status(404).json({
        message: "Product not found in the wishlist"
      });
    }
    return res.status(200).json({
      message: "Product successfully removed from the wishlist"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
exports.removeWishlistItem = removeWishlistItem;