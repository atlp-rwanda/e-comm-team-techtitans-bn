"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showReviews = exports.deleteReview = exports.default = exports.averageRating = exports.addReview = void 0;
var _models = _interopRequireDefault(require("../../database/models"));
var _jwt = _interopRequireDefault(require("../../utils/jwt.util"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Review = _models.default.Review;
const addReview = async (req, res) => {
  try {
    const {
      pid
    } = req.params;
    let {
      feedback,
      ratings
    } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = _jwt.default.verifyToken(token);
    const {
      id
    } = decodedToken;
    //check if  product id exist
    const productIdExist = await _models.default.Product.findOne({
      where: {
        id: pid
      }
    });
    if (!productIdExist) {
      return res.status(404).json({
        message: '🚫 You cannot create a review if  product does not exist'
      });
    }
    //check if  review exist
    const existReview = await Review.findOne({
      where: {
        buyer_id: id,
        product_id: pid
      }
    });
    if (existReview) {
      return res.status(403).json({
        message: '🚫 You have already reviewed this product'
      });
    }
    const newReview = await Review.create({
      ratings,
      feedback,
      buyer_id: id,
      product_id: pid
    });
    await newReview.save();
    res.status(201).json({
      message: '🍀Review  Added ',
      data: newReview
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message
    });
  }
};

// ...........show all reviews......
exports.addReview = addReview;
const showReviews = async (req, res) => {
  try {
    const pid = req.params.pid;
    const availableReviews = await Review.findAll({
      where: {
        product_id: pid
      }
    });
    if (availableReviews.length === 0) {
      res.status(404).json({
        status: 'fail',
        message: '🚫 Sorry, there are no  reviews at the moment'
      });
    } else {
      res.status(200).json({
        status: 'success',
        message: '🍀 Here are the AVAILABLE Reviews',
        data: availableReviews
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message
    });
  }
};

//remove review
exports.showReviews = showReviews;
const deleteReview = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = _jwt.default.verifyToken(token);
    const {
      id
    } = decodedToken;
    const reviewId = req.params.id;
    const availableReview = await Review.findOne({
      where: {
        buyer_id: id,
        id: reviewId
      }
    });
    if (availableReview === null) {
      res.status(404).json({
        status: 'fail',
        message: '🚫 Sorry, this Review was not found...'
      });
    } else {
      await availableReview.destroy();
      res.status(200).json({
        status: 'success',
        message: `🍀 Review Deleted Successfully.`
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message
    });
  }
};

//calculate average rating
exports.deleteReview = deleteReview;
const averageRating = async (req, res) => {
  try {
    const product_id = req.params.pid;
    const allReviews = await Review.findAll({
      where: {
        product_id
      }
    });
    if (allReviews.length === 0) {
      res.status(404).json({
        status: 'fail',
        message: '🚫 Sorry, this Review Rating was not found...'
      });
    } else {
      let totalRating = 0;
      for (let i = 0; i < allReviews.length; i += 1) {
        const rev = allReviews[i].ratings;
        totalRating = parseInt(rev, 10) + totalRating;
      }
      const averageRating = totalRating / allReviews.length;
      res.status(200).json({
        code: 200,
        message: 'Average Rating',
        data: averageRating
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message
    });
  }
};
exports.averageRating = averageRating;
var _default = {
  addReview,
  showReviews,
  deleteReview,
  averageRating
};
exports.default = _default;