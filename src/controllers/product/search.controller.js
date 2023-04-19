import { Op } from "sequelize";
import models from "../../database/models";

export const searchProducts = async (req, res, next) => {
  try {
    const { name, category, price, page = 1, limit = 10 } = req.query;

    let query = {};
    // check if name query param exists and add it to the query object
    if (name) {
      query.name = { [Op.iLike]: `%${name}%` };
    }
    // check if category query param exists and add it to the query object using the correct alias
    if (category) {
      query["$Category.name$"] = { [Op.eq]: category };
    }
    // check if price query param exists and add it to the query object
    if (price) {
      query.price = { [Op.eq]: price };
    }

    // calculate the offset based on page and limit
    const offset = (page - 1) * limit;

    // fetch products based on the query object and include the Category model using the correct alias
    const products = await models.Product.findAndCountAll({
      where: query,
      include: [
        {
          model: models.Category,
          as: "Category",
        },
      ],
      limit,
      offset,
    });

    // check if any products were found and send appropriate response
    if (products.count <= 0) {
      res.status(404).json({
        status: "fail",
        message: "🚫 Oops...no product found at the moment.",
      });
    } else {
      res.status(200).json({
        status: "success",
        message: `🚀${products.count} Products Found Successfully.🚀`,
        data: products.rows,
        pagination: {
          page,
          totalPages: Math.ceil(products.count / limit),
        },
      });
    }
  } catch (error) {
    // handle any errors and send appropriate response
    res.status(500).json({ status: "fail", message: error.message });
  }
};

export default searchProducts;
