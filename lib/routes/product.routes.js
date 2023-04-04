"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _productSchemaMiddleware = _interopRequireDefault(require("../middleware/validation/product.schema.middleware.js"));
var _authMiddleware = require("../middleware/auth/auth.middleware.js");
var _product = require("../controllers/product/product.controller");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const productRouter = _express.default.Router();

// Create a new Tutorial

productRouter.post("/category/create", _product.addCategory);
productRouter.get("/category", _product.findAllCategories);
productRouter.post("/product/create", _authMiddleware.isSeller, _productSchemaMiddleware.default, _product.addProduct);
productRouter.get("/product", _product.findAllproducts);
var _default = productRouter;
exports.default = _default;