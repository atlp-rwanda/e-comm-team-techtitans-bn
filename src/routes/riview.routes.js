import express from 'express';
import { isBuyer } from '../middleware/auth/auth.middleware.js';
import {addReview,showReviews,deleteReview,averageRating} from '../controllers/user/provideReview.controller.js';

const reviewRouter = express.Router();

reviewRouter.post('/assign-review/:pid',isBuyer,addReview);
reviewRouter.get('/getReview/:pid',showReviews);
reviewRouter.delete('/:id',isBuyer,deleteReview);
reviewRouter.get('/rating/:pid', averageRating);

export default reviewRouter;