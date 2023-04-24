import express from 'express';


import addItemToCart from '../controllers/cart/addToCart.controller';
import { isBuyer } from '../middleware/auth/auth.middleware.js';
import viewCart from '../controllers/cart/viewCart';
import deleteCart from '../controllers/cart/clearcart.controller'


const cartRouter = express.Router();

cartRouter.post('/add-to-cart',addItemToCart);
cartRouter.delete('/clear-cart/:id', deleteCart);
cartRouter.get('/view-cart',isBuyer,viewCart);

export default cartRouter;
