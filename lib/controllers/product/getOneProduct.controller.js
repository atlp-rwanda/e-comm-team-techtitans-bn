"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _models = _interopRequireDefault(require("../../database/models"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const getOneProduct = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const fetchedProduct = await _models.default.Product.findOne({
      where: {
        id
      }
    });
    if (!fetchedProduct) {
      res.status(404).json({
        message: `🚫 Sorry, NO product with id (${id}) was found`
      });
    } else {
      res.status(200).json({
        message: `🍀 Products with id (${id}) Fetched Successfully.`,
        data: fetchedProduct
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
var _default = getOneProduct;
exports.default = _default;