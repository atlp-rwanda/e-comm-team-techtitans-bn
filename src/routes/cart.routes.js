import express from 'express';


import addItemToCart from '../controllers/cart/addToCart.controller';
import { isBuyer } from '../middleware/auth/auth.middleware.js';
import viewCart from '../controllers/cart/viewCart';

const cartRouter = express.Router();

cartRouter.post('/add-to-cart',addItemToCart);
cartRouter.get('/view-cart',isBuyer,viewCart);

export default cartRouter;
