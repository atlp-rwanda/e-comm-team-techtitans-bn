import models from '../../database/models';
import Category from '../../database/models/category';
import { Product } from '../../database/models';
import JwtUtility from '../../utils/jwt.util';

export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const existingCategory = await models.Category.findOne({
      where: { name },
    });
    if (existingCategory) {
      return res.status(409).json({
        message: 'Category already exists you can update that category instead',
      });
    }
    const category = await models.Category.create({
      name,
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message });
  }
};

export const findAllCategories = async (req, res) => {
  try {
    const categories = await models.Category.findAll();
    if (categories.length <= 0) {
      res.status(404).json({ status: 'fail', message: 'No category found' });
    } else {
      res.status(200).json({ status: 'success', data: categories });
    }
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message });
  }
};

export const findAllproducts = async (req, res) => {
  try {
    const products = await models.Product.findAll();
    if (products.length <= 0) {
      res.status(404).json({ status: 'fail', message: 'No product found' });
    } else {
      res.status(200).json({
        status: 'success',
        message: `Products ${products.length} Fetched Successful`,
        data: products,
      });
    }
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message });
  }
};

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      quantity,
      stock,
      categoryId,
      description,
      expiryDate,
    } = req.body;
    const images = req.body.images || [];
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = JwtUtility.verifyToken(token);
    const { id } = decodedToken;

    const vendorProduct = await models.Product.findOne({
      where: { name, vendorId: id },
    });
    if (vendorProduct) {
      return res.status(403).json({
        message:
          "You cannot create a product with the same name as an existing product you didn't create",
      });
    }

    const product = await models.Product.create({
      vendorId: id,
      name,
      price,
      quantity,
      stock,
      categoryId,
      description,
      expiryDate,
      images,
    });
    res
      .status(201)
      .json({ message: 'product create successful', data: product });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message });
  }
};

// ...........start of PRODUCT-STATUS FUNCTIONALITY......
export const findAvailableProducts = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = JwtUtility.verifyToken(token);
    const { id } = decodedToken;
    const availableProducts = await models.Product.findAll({
      where: {
        stock: 'Available',
        vendorId: id,
      },
    });
    if (availableProducts.length <= 0) {
      res.status(404).json({ status: 'fail', message: 'No product found' });
    } else {
      res.status(200).json({
        status: 'success',
        message: `Here are your ${availableProducts.length} Available Product(s)`,
        data: availableProducts,
      });
    }
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message });
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
    if (availableProduct.length <= 0) {
      res.status(404).json({ status: 'fail', message: 'No product found' });
    } else {
      const updatedProduct = await availableProduct.update({
        stock: 'Out of Stock',
      });
      res.status(200).json({
        status: 'success',
        message: 'Your Product stock status has been updated successfully',
        data: updatedProduct,
      });
    }
  } catch (error) {
    res.status(500).json({ status: 'failss', message: error.message });
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
    if (availableProduct.length <= 0) {
      res.status(404).json({ status: 'fail', message: 'No product found' });
    } else {
      const updatedProduct = await availableProduct.update({
        stock: 'Expired',
      });
      res.status(200).json({
        status: 'success',
        message: 'Your Product stock status has been updated successfully',
        data: updatedProduct,
      });
    }
  } catch (error) {
    res.status(500).json({ status: 'failss', message: error.message });
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
    if (availableProduct.length <= 0) {
      res.status(404).json({ status: 'fail', message: 'No product found' });
    } else {
      const updatedProduct = await availableProduct.update({
        stock: 'Expired',
      });
      res.status(200).json({
        status: 'success',
        message: 'Your Product stock status has been updated successfully',
        data: updatedProduct,
      });
    }
  } catch (error) {
    res.status(500).json({ status: 'failss', message: error.message });
  }
};
// ...........end of PRODUCT-STATUS FUNCTIONALITY......

export const deleteOneProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const availableProduct = await models.Product.findOne({
      where: {
        id: productId,
      },
    });
    if (availableProduct === null) {
      res.status(404).json({ status: 'fail', message: 'No product found' });
    } else {
      await availableProduct.destroy();
      res.status(200).json({
        status: 'success',
        message:
          'This Product status has been removed because it is harmful to the human body, please contact the admin for more info.',
      });
    }
  } catch (error) {
    res.status(500).json({ status: 'failss', message: error.message });
  }
};

export default { findAllCategories };
