"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _authMiddleware = require("../middleware/auth/auth.middleware.js");
var _provideReviewController = require("../controllers/user/provideReview.controller.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const reviewRouter = _express.default.Router();
reviewRouter.post('/assign-review/:pid', _authMiddleware.isBuyer, _provideReviewController.addReview);
reviewRouter.get('/getReview/:pid', _provideReviewController.showReviews);
reviewRouter.delete('/:id', _authMiddleware.isBuyer, _provideReviewController.deleteReview);
reviewRouter.get('/rating/:pid', _provideReviewController.averageRating);
var _default = reviewRouter;
exports.default = _default;