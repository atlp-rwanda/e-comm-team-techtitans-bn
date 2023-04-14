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

// Create a new Product
productRouter.post('/category/create', _product.addCategory);
productRouter.get('/category', (0, _authMiddleware.checkPermission)('manage product'), _product.findAllCategories);
productRouter.post('/product/create', _authMiddleware.isSeller, _productSchemaMiddleware.default, _product.addProduct);
productRouter.get('/product', _product.findAllproducts);

// Get available products
productRouter.get('/product/available', _product.findAvailableProducts);

// According to the ENUMs: Available(1), Out_of_Stock(2), Expired(3)
// 1. Make a product Out_of_Stock
productRouter.get('/product/update/stockStatus/2/:id', _authMiddleware.isSeller, (0, _authMiddleware.checkPermission)('manage products'), _product.outOfStockStatusUpdate);
// 2. Make a product Expired
productRouter.get('/product/update/stockStatus/3/:id', _authMiddleware.isSeller, (0, _authMiddleware.checkPermission)('manage products'), _product.expiredStatusUpdate);
// 3. Make a product Available
productRouter.get('/product/update/stockStatus/1/:id', _authMiddleware.isSeller, (0, _authMiddleware.checkPermission)('manage products'), _product.availableStatusUpdate);

// Delete a Product
productRouter.delete('/product/delete/:id', _authMiddleware.isSeller, (0, _authMiddleware.checkPermission)('manage products'), _product.deleteOneProduct);
var _default = productRouter;
exports.default = _default;