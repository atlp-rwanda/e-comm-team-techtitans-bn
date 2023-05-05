import models from "../../database/models";
import Category from "../../database/models/category";
import JwtUtility from "../../utils/jwt.util";
import {
  notifyVendorOnProductCreate,
  notifyVendorOnProductDeletion,
} from "../notification/notifications.controller";
import { SendNewProductUpdated } from "../subscriber/service.schedule.controller";

export const addCategory = async (req, res) => {
  try {
    let { name } = req.body;
    name = name.toLowerCase(); // convert name to lowerCase
    const existingCategory = await models.Category.findOne({
      where: { name },
    });
    if (existingCategory) {
      return res.status(409).json({
        message:
          "😬 Category already exists. You can Update that category instead.",
      });
    }
    const category = await models.Category.create({
      name,
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

export const findAllCategories = async (req, res) => {
  const limit = req.query.limit || 10; // default to 10 categories per page
  const page = req.query.page || 1; // default to the first page
  const offset = (page - 1) * limit; // calculate the offset based on the page number
  try {
    const categories = await models.Category.findAndCountAll({
      limit,
      offset,
    });
    const result = categories.rows;
    const totalCount = categories.count;
    if (result.length <= 0) {
      res.status(404).json({ status: "fail", message: "🚫 No category found" });
    } else {
      res
        .status(200)
        .json({
          status: "success",
          data: result,
          currentPage: offset / limit + 1,
          totalPages: Math.ceil(totalCount / limit),
        });
    }
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

export const addProduct = async (req, res) => {
  try {
    let { name, price, quantity, categoryId, description, expiryDate } =
      req.body;
    const images = req.body.images || [];
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = JwtUtility.verifyToken(token);
    const { id } = decodedToken;

    const vendorProduct = await models.Product.findOne({
      where: { name, vendorId: id },
    });
    if (vendorProduct) {
      return res.status(409).json({
        message:
          "🚫 You cannot create a product with the same name as an existing product. Please input a different name",
      });
    }

    const product = await models.Product.create({
      vendorId: id,
      name,
      price,
      quantity,
      categoryId,
      description,
      expiryDate,
      images,
    });
    await notifyVendorOnProductCreate(product);
    res.status(201).json({
      message: `🍀 Product (${product.name}) has been added successfully.`,
      data: product,
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

export const findAvailableProducts = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = JwtUtility.verifyToken(token);
    const { id } = decodedToken;
    const limit = req.query.limit || 10; // default to 10 products per page
    const page = req.query.page || 1; // default to the first page
    const offset = (page - 1) * limit;
    const availableProducts = await models.Product.findAndCountAll({
      where: {
        stock: "available",
        vendorId: id,
      },
      limit,
      offset,
    });
    const result = availableProducts.rows;
    const totalCount = availableProducts.count;
    if (result.length === 0) {
      res.status(404).json({
        status: "fail",
        message: "🚫 Sorry, there are no available products at the moment",
      });
    } else {
      res.status(200).json({
        status: "success",
        message: `🍀 Here are the ${result.length} Available Products`,
        data: result,
        currentPage: offset / limit + 1,
        totalPages: Math.ceil(totalCount / limit),
      });
    }
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

export const outOfStockStatusUpdate = async (req, res) => {
  try {
    const productId = req.params.id;
    const availableProduct = await models.Product.findOne({
      where: {
        id: productId,
      },
    });
    if (availableProduct === null) {
      res.status(404).json({
        status: "fail",
        message: "🚫 Sorry, this product was not found...",
      });
    } else {
      const updatedProduct = await availableProduct.update({
        stock: "out of stock",
      });
      res.status(200).json({
        status: "success",
        message: "🍀 Your Product stock status has been updated successfully.",
        data: updatedProduct,
      });
    }
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

export const expiredStatusUpdate = async (req, res) => {
  try {
    const productId = req.params.id;
    const availableProduct = await models.Product.findOne({
      where: {
        id: productId,
      },
    });
    if (availableProduct === null) {
      res.status(404).json({
        status: "fail",
        message: "🚫 Sorry, this product was not found...",
      });
    } else {
      const updatedProduct = await availableProduct.update({
        stock: "expired",
      });
      res.status(200).json({
        status: "success",
        message: "🍀 Your Product stock status has been updated successfully",
        data: updatedProduct,
      });
    }
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

export const availableStatusUpdate = async (req, res) => {
  try {
    const productId = req.params.id;
    const availableProduct = await models.Product.findOne({
      where: {
        id: productId,
      },
    });
    if (availableProduct === null) {
      res.status(404).json({
        status: "fail",
        message: "🚫 Sorry, this product was not found...",
      });
    } else {
      const updatedProduct = await availableProduct.update({
        stock: "available",
      });
      res.status(200).json({
        status: "success",
        message: "🍀 Your Product stock status has been updated successfully.",
        data: updatedProduct,
      });
    }
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};
// ...........end of PRODUCT-STATUS FUNCTIONALITY......
export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, price, quantity, categoryId, description, expiryDate } =
      req.body;
    const images = req.body.images || [];
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = JwtUtility.verifyToken(token);
    const { id } = decodedToken;

    const product = await models.Product.findOne({
      where: { id: productId, vendorId: id },
    });
    if (!product) {
      return res.status(404).json({
        message: "🚫 Product not found.",
      });
    }

    const updatedProduct = await product.update({
      name,
      price,
      quantity,
      categoryId,
      description,
      expiryDate,
      images,
    });
    await SendNewProductUpdated(updatedProduct);
    res.status(200).json({
      message: `🍀 Product (${updatedProduct.name}) has been updated successfully.`,
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// ...........end of UPDATE-PRODUCT FUNCTIONALITY......

export const deleteOneProduct = async (req, res) => {
  try {
    const { deletedProductMessage } = req.body;
    const productId = req.params.id;
    const availableProduct = await models.Product.findOne({
      where: {
        id: productId,
      },
    });
    if (availableProduct === null) {
      res.status(404).json({
        status: "fail",
        message: "🚫 Sorry, this product was not found...",
      });
    } else {
      await notifyVendorOnProductDeletion(availableProduct);
      await availableProduct.destroy();
      res.status(200).json({
        status: "success",
        message: `🍀 This Product status has been removed because of the following reason: ${deletedProductMessage}. Please contact the support team for more info.`,
      });
    }
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

export const getOneProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const fetchedProduct = await models.Product.findOne({
      where: { id: productId },
    });
    if (!fetchedProduct) {
      res.status(404).json({ message: "🚫 Sorry, the product was not found" });
    } else {
      res.status(200).json({
        message: "🍀 Product was fetched Successfully",
        data: fetchedProduct,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const buyerViewProduct = async (req, res) => {
  try {
    const limit = req.query.limit || 10; // default to 10 products per page
    const offset = req.query.offset || 0; // default to the first page

    const availableProducts = await models.Product.findAndCountAll({
      where: {
        stock: "available",
      },
      limit,
      offset,
    });
    if (availableProducts.rows.length === 0) {
      res.status(404).json({
        status: "fail",
        message: "🚫 Sorry, there are no available products at the moment",
      });
    } else {
      res.status(200).json({
        status: "success",
        message: `🍀 Here are the ${availableProducts.rows.length} Available Products`,
        data: availableProducts.rows,
        currentPage: offset / limit + 1,
        totalPages: Math.ceil(availableProducts.count / limit),
      });
    }
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

export default { findAllCategories };
