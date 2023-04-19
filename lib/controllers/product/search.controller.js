"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchProducts = exports.default = void 0;
var _sequelize = require("sequelize");
var _models = _interopRequireDefault(require("../../database/models"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const searchProducts = async (req, res, next) => {
  try {
    const {
      name,
      category,
      price,
      page = 1,
      limit = 10
    } = req.query;
    let query = {};
    // check if name query param exists and add it to the query object
    if (name) {
      query.name = {
        [_sequelize.Op.iLike]: `%${name}%`
      };
    }
    // check if category query param exists and add it to the query object using the correct alias
    if (category) {
      query["$Category.name$"] = {
        [_sequelize.Op.eq]: category
      };
    }
    // check if price query param exists and add it to the query object
    if (price) {
      query.price = {
        [_sequelize.Op.eq]: price
      };
    }

    // calculate the offset based on page and limit
    const offset = (page - 1) * limit;

    // fetch products based on the query object and include the Category model using the correct alias
    const products = await _models.default.Product.findAndCountAll({
      where: query,
      include: [{
        model: _models.default.Category,
        as: "Category"
      }],
      limit,
      offset
    });

    // check if any products were found and send appropriate response
    if (products.count <= 0) {
      res.status(404).json({
        status: "fail",
        message: "🚫 Oops...no product found at the moment."
      });
    } else {
      res.status(200).json({
        status: "success",
        message: `🚀${products.count} Products Found Successfully.🚀`,
        data: products.rows,
        pagination: {
          page,
          totalPages: Math.ceil(products.count / limit)
        }
      });
    }
  } catch (error) {
    // handle any errors and send appropriate response
    res.status(500).json({
      status: "fail",
      message: error.message
    });
  }
};
exports.searchProducts = searchProducts;
var _default = searchProducts;
exports.default = _default;