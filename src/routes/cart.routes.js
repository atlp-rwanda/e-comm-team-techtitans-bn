import express from 'express';


import addItemToCart from '../controllers/cart/addToCart.controller';


const cartRouter = express.Router();

cartRouter.post('/add-to-cart',addItemToCart);

export default cartRouter;