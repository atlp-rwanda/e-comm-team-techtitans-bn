import express from "express";
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
  findAllproducts,
} from "../controllers/product/product.controller";

const productRouter = express.Router();

// Create a new Tutorial

productRouter.post("/category/create", addCategory);
productRouter.get("/category", findAllCategories);
productRouter.post(
  "/product/create",
  isSeller,
  validateProductInput,
  addProduct
);
productRouter.get("/product", findAllproducts);

export default productRouter;
