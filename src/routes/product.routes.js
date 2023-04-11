import express from 'express';
import validateProductInput from '../middleware/validation/product.schema.middleware.js';
import {
  isAdmin,
  isSeller,
  isBuyer,
  checkPermission,
} from '../middleware/auth/auth.middleware.js';
import {
  addCategory,
  addProduct,
  findAllCategories,
  findAllproducts,
  findAvailableProducts,
  outOfStockStatusUpdate,
  expiredStatusUpdate,
  availableStatusUpdate,
  deleteOneProduct,
} from '../controllers/product/product.controller';

const productRouter = express.Router();

// Create a new Product
productRouter.post('/category/create',addCategory);
productRouter.get('/category',findAllCategories);
productRouter.post(
  '/product/create',
  isSeller,
  validateProductInput,
  addProduct,
);
productRouter.get('/product', findAllproducts);

// Get available products
productRouter.get('/product/available', findAvailableProducts);

// According to the ENUMs: Available(1), Out_of_Stock(2), Expired(3)
// 1. Make a product Out_of_Stock
productRouter.get(
  '/product/update/stockStatus/2/:id',
  isSeller,checkPermission('manage products'),
  outOfStockStatusUpdate,
);
// 2. Make a product Expired
productRouter.get(
  '/product/update/stockStatus/3/:id',
  isSeller,checkPermission('manage products'),
  expiredStatusUpdate,
);
// 3. Make a product Available
productRouter.get(
  '/product/update/stockStatus/1/:id',
  isSeller,checkPermission('manage products'),
  availableStatusUpdate,
);

// Delete a Product
productRouter.delete('/product/delete/:id', isSeller,checkPermission('manage products'), deleteOneProduct);

export default productRouter;
