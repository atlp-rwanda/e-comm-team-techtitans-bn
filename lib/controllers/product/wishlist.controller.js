"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wishlist = exports.getAllWishes = void 0;
var _models = _interopRequireDefault(require("../../database/models"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _jwt = _interopRequireDefault(require("../../utils/jwt.util"));
var _bcrypt = _interopRequireDefault(require("bcrypt"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// import Wishlist from "../../database/models/wishlist";
// import Product from "../../database/models/product";

// import User from "../../database/models/user";

const Users = _models.default.users;
const Products = _models.default.Product;
const Wishlists = _models.default.Wishlist;
const secretToken = process.env.SECRET_TOKEN;
const wishlist = async (req, res) => {
  const tokenHeader = req.headers.authorization;
  if (!tokenHeader) {
    return res.status(401).json({
      message: "Token not provided"
    }); // assuming the token is sent in the Authorization header
  }

  const token = tokenHeader.split(" ")[1];
  try {
    const decodedToken = _jwt.default.verifyToken(token);
    // const user = await User.findOne({ where: { id: decodedToken.id } });
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
        message: `Product not exist`
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
          message: `product already exist in your wish list`
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
        message: "product successfully added to a wishlist",
        data: wishList
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

//
exports.wishlist = wishlist;
const getAllWishes = async (req, res) => {
  const {
    token
  } = req.params;
  const limit = req.query.limit || 10; // default to 10 wishlists per page
  const offset = req.query.offset || 0; // default to the first page

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
        message: "🚫 Oops...no wishlist found at the moment."
      });
    } else {
      res.status(200).json({
        status: "success",
        message: `🍀 ${result.length} Wishlists Fetched Successfully.`,
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