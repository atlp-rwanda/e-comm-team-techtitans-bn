import express from 'express';


import addToCart from '../controllers/cart/addToCart.controller';


const cartRouter = express.Router();

cartRouter.post('/add-to-cart',addToCart);

export default cartRouter;
