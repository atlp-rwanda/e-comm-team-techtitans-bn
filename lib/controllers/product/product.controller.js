"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.outOfStockStatusUpdate = exports.findAvailableProducts = exports.findAllproducts = exports.findAllCategories = exports.expiredStatusUpdate = exports.deleteOneProduct = exports.default = exports.availableStatusUpdate = exports.addProduct = exports.addCategory = void 0;
var _models = _interopRequireWildcard(require("../../database/models"));
var _category = _interopRequireDefault(require("../../database/models/category"));
var _jwt = _interopRequireDefault(require("../../utils/jwt.util"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const addCategory = async (req, res) => {
  try {
    const {
      name
    } = req.body;
    const existingCategory = await _models.default.Category.findOne({
      where: {
        name
      }
    });
    if (existingCategory) {
      return res.status(409).json({
        message: '😬 Category already exists. You can Update that category instead.'
      });
    }
    const category = await _models.default.Category.create({
      name
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message
    });
  }
};
exports.addCategory = addCategory;
const findAllCategories = async (req, res) => {
  try {
    const categories = await _models.default.Category.findAll();
    if (categories.length <= 0) {
      res.status(404).json({
        status: 'fail',
        message: '🚫 No category found'
      });
    } else {
      res.status(200).json({
        status: 'success',
        data: categories
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message
    });
  }
};
exports.findAllCategories = findAllCategories;
const findAllproducts = async (req, res) => {
  try {
    const products = await _models.default.Product.findAll();
    if (products.length <= 0) {
      res.status(404).json({
        status: 'fail',
        message: '🚫 Oops...no product found at the moment.'
      });
    } else {
      res.status(200).json({
        status: 'success',
        message: `🍀 ${products.length} Products Fetched Successfully.`,
        data: products
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message
    });
  }
};
exports.findAllproducts = findAllproducts;
const addProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      quantity,
      stock,
      categoryId,
      description,
      expiryDate
    } = req.body;
    const images = req.body.images || [];
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = _jwt.default.verifyToken(token);
    const {
      id
    } = decodedToken;
    const vendorProduct = await _models.default.Product.findOne({
      where: {
        name,
        vendorId: id
      }
    });
    if (vendorProduct) {
      return res.status(403).json({
        message: '🚫 You cannot create a product with the same name as an existing product. Please input a different name'
      });
    }
    const product = await _models.default.Product.create({
      vendorId: id,
      name,
      price,
      quantity,
      stock,
      categoryId,
      description,
      expiryDate,
      images
    });
    res.status(201).json({
      message: `🍀 Product (${product.name}) has been added successfully.`,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message
    });
  }
};

// ...........start of PRODUCT-STATUS FUNCTIONALITY......
exports.addProduct = addProduct;
const findAvailableProducts = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = _jwt.default.verifyToken(token);
    const {
      id
    } = decodedToken;
    const availableProducts = await _models.default.Product.findAll({
      where: {
        stock: 'Available',
        vendorId: id
      }
    });
    if (availableProducts.length === 0) {
      res.status(404).json({
        status: 'fail',
        message: '🚫 Sorry, there are no available products at the moment'
      });
    } else {
      res.status(200).json({
        status: 'success',
        message: `🍀 Here are the ${availableProducts.length} Available Products`,
        data: availableProducts
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message
    });
  }
};
exports.findAvailableProducts = findAvailableProducts;
const outOfStockStatusUpdate = async (req, res) => {
  try {
    const productId = req.params.id;
    const availableProduct = await _models.default.Product.findOne({
      where: {
        id: productId
      }
    });
    if (availableProduct === null) {
      res.status(404).json({
        status: 'fail',
        message: '🚫 Sorry, this product was not found...'
      });
    } else {
      const updatedProduct = await availableProduct.update({
        stock: 'Out of Stock'
      });
      res.status(200).json({
        status: 'success',
        message: '🍀 Your Product stock status has been updated successfully.',
        data: updatedProduct
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'failss',
      message: error.message
    });
  }
};
exports.outOfStockStatusUpdate = outOfStockStatusUpdate;
const expiredStatusUpdate = async (req, res) => {
  try {
    const productId = req.params.id;
    const availableProduct = await _models.default.Product.findOne({
      where: {
        id: productId
      }
    });
    if (availableProduct === null) {
      res.status(404).json({
        status: 'fail',
        message: '🚫 Sorry, this product was not found...'
      });
    } else {
      const updatedProduct = await availableProduct.update({
        stock: 'Expired'
      });
      res.status(200).json({
        status: 'success',
        message: '🍀 Your Product stock status has been updated successfully',
        data: updatedProduct
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'failss',
      message: error.message
    });
  }
};
exports.expiredStatusUpdate = expiredStatusUpdate;
const availableStatusUpdate = async (req, res) => {
  try {
    const productId = req.params.id;
    const availableProduct = await _models.default.Product.findOne({
      where: {
        id: productId
      }
    });
    if (availableProduct === null) {
      res.status(404).json({
        status: 'fail',
        message: '🚫 Sorry, this product was not found...'
      });
    } else {
      const updatedProduct = await availableProduct.update({
        stock: 'Available'
      });
      res.status(200).json({
        status: 'success',
        message: '🍀 Your Product stock status has been updated successfully.',
        data: updatedProduct
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'failss',
      message: error.message
    });
  }
};
// ...........end of PRODUCT-STATUS FUNCTIONALITY......
exports.availableStatusUpdate = availableStatusUpdate;
const deleteOneProduct = async (req, res) => {
  try {
    const {
      deletedProductMessage
    } = req.body;
    const productId = req.params.id;
    const availableProduct = await _models.default.Product.findOne({
      where: {
        id: productId
      }
    });
    if (availableProduct === null) {
      res.status(404).json({
        status: 'fail',
        message: '🚫 Sorry, this product was not found...'
      });
    } else {
      await availableProduct.destroy();
      res.status(200).json({
        status: 'success',
        message: `🍀 This Product status has been removed because of the following reason: ${deletedProductMessage}. Please contact the support team for more info.`
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message
    });
  }
};
exports.deleteOneProduct = deleteOneProduct;
var _default = {
  findAllCategories
};
exports.default = _default;