import express from "express";
import productSearch from "../controllers/product/search.controller";
import validateProductInput from "../middleware/validation/product.schema.middleware.js";
import {
  isAdmin,
  isSeller,
  isBuyer,
  checkPermission,
} from "../middleware/auth/auth.middleware.js";
import {
  addCategory,
  addProduct,
  findAllCategories,
  findAllProductsByCategory,
  findAllproducts,
  findAvailableProducts,
  outOfStockStatusUpdate,
  expiredStatusUpdate,
  availableStatusUpdate,
  deleteOneProduct,
  getOneProduct,
  updateProduct,
  buyerViewProduct,
} from "../controllers/product/product.controller";
import {
  wishlist,
  getAllWishes,
  removeWishlistItem,
} from "../controllers/product/wishlist.controller";

const productRouter = express.Router();

// Create a new Product
productRouter.post("/category/create", addCategory);
productRouter.get("/category", findAllCategories);
productRouter.get("/category/:name", findAllProductsByCategory);
// productRouter.get("/category/:id", findAllProductsByCategory);
productRouter.post(
  "/product/create",
  isSeller,
  validateProductInput,
  addProduct
);
productRouter.get("/product", findAllproducts);

// Get available products
productRouter.get(
  "/product/available",
  isSeller,
  checkPermission("manage products"),
  findAvailableProducts
);

// Get a specific product
productRouter.get("/product/:id", getOneProduct);

// According to the ENUMs: Available(1), Out_of_Stock(2), Expired(3)
// 1. Make a product Out_of_Stock
productRouter.get(
  "/product/update/stockStatus/2/:id",
  isSeller,
  checkPermission("manage products"),
  outOfStockStatusUpdate
);
// 2. Make a product Expired
productRouter.get(
  "/product/update/stockStatus/3/:id",
  isSeller,
  checkPermission("manage products"),
  expiredStatusUpdate
);
// 3. Make a product Available
productRouter.get(
  "/product/update/stockStatus/1/:id",
  isSeller,
  checkPermission("manage products"),
  availableStatusUpdate
);
// update a Product
productRouter.put(
  "/product/update/:id",
  isSeller,
  validateProductInput,
  updateProduct
);
// Delete a Product
productRouter.delete(
  "/product/delete/:id",
  isSeller,
  checkPermission("manage products"),
  deleteOneProduct
);
//product search
productRouter.get("/product/list/search", productSearch);
productRouter.post("/wishlist", isBuyer, wishlist);
productRouter.get("/wishlist/:token", getAllWishes);
productRouter.delete("/wishlist/", isBuyer, removeWishlistItem);
// buyer view all products
productRouter.get("/product/all/viewAvailable", buyerViewProduct);
export default productRouter;
