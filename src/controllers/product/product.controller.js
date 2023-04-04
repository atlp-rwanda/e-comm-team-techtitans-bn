import { Product } from "../database/models";

class ProductController {
  static async addProduct(req, res) {
    try {
      const { name, price, quantity, available, category } = req.body;
      const images = req.body.images || [];
      const existingProduct = await models.Product.findOne({
        where: { name },
      });
    //   check if product already exists
      if (existingProduct) {
        return res.status(409).json({
          message: "Product already exists you can update that product instead",
        });
      }
      const product = await models.Product.create({
        userId: req.user.id,
        name,
        price,
        quantity,
        available,
        category,
        bonus,
        images,
        ec,
      });
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ status: "fail", message: error.message });
    }
  }
}
export default ProductController;
