"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _joi = _interopRequireDefault(require("joi"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const validateProductInput = (req, res, next) => {
  try {
    const schema = _joi.default.object({
      name: _joi.default.string().trim().required(),
      price: _joi.default.number().min(1).required(),
      quantity: _joi.default.number().integer().min(1).required(),
      categoryId: _joi.default.string().trim().required(),
      description: _joi.default.string().trim().required(),
      bonus: _joi.default.number().integer().min(0),
      images: _joi.default.array().items(_joi.default.string().uri({
        scheme: ['http', 'https']
      }).trim().required()).min(4).max(8).unique(),
      expiryDate: _joi.default.date().iso(),
      ec: _joi.default.number().integer().min(0).allow(null)
    });
    const {
      error
    } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};
var _default = validateProductInput;
exports.default = _default;