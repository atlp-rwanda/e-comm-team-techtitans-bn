"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findAllproducts = exports.findAllCategories = exports.default = exports.addProduct = exports.addCategory = void 0;
var _models = _interopRequireWildcard(require("../database/models"));
var _category = _interopRequireDefault(require("../database/models/category"));
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
        message: "Category already exists you can update that category instead"
      });
    }
    const category = await _models.default.Category.create({
      name
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({
      status: "fail",
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
        status: "fail",
        message: "No category found"
      });
    } else {
      res.status(200).json({
        status: "success",
        data: categories
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "fail",
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
        status: "fail",
        message: "No product found"
      });
    } else {
      res.status(200).json({
        status: "success",
        message: `Products ${products.length} Fetched Successful`,
        data: products
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "fail",
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
      vendorId,
      categoryId,
      description
    } = req.body;
    const images = req.body.images || [];
    const existingProduct = await _models.default.Product.findOne({
      where: {
        name
      }
    });
    if (existingProduct) {
      return res.status(409).json({
        message: "Product already exists you can update that product instead"
      });
    }
    const product = await _models.default.Product.create({
      vendorId,
      name,
      price,
      quantity,
      stock,
      categoryId,
      description,
      images
    });
    res.status(201).json({
      message: "prdoduct create successful",
      data: product
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message
    });
  }
};
exports.addProduct = addProduct;
var _default = {
  findAllCategories
};
exports.default = _default;