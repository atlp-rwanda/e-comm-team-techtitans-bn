import models from "../../database/models";
import db from "../../database/models";
import jwt from "jsonwebtoken";
import JwtUtility from "../../utils/jwt.util";
import bcrypt from "bcrypt";

const Users = db.users;
const Products = models.Product;
const Wishlists = models.Wishlist;

const secretToken = process.env.SECRET_TOKEN;

const wishlist = async (req, res) => {
  const tokenHeader = req.headers.authorization;
  if (!tokenHeader) {
    return res.status(401).json({ message: "Token not provided" });
  }
  const token = tokenHeader.split(" ")[1];
  try {
    const decodedToken = JwtUtility.verifyToken(token);
    const { product_id } = req.body;

    const user = await Users.findOne({ where: { email: decodedToken.email } });

    const product = await Products.findOne({ where: { id: product_id } });

    if (!product) {
      return res.status(500).json({
        message: `Product does not exist`,
      });
    } else {
      const user_id = user.id;
      const product_id = product.id;
      const product_name = product.name;
      const product_price = product.price;
      const product_image = product.images;
      console.log(product_name);
      const productExist = await Wishlists.findOne({
        where: { product_id, user_id },
      });

      if (productExist) {
        return res.status(500).json({
          message: `Product already exists in your wishlist`,
        });
      }

      const wishList = await Wishlists.create({
        user_id,
        product_id,
        product_name,
        product_price,
        product_image,
      });

      return res.status(201).json({
        message: "Product successfully added to the wishlist",
        data: wishList,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllWishes = async (req, res) => {
  const { token } = req.params;
  const limit = req.query.limit || 10;
  const offset = req.query.offset || 0;

  try {
    const payload = jwt.verify(token, secretToken);
    const { email } = payload;

    const userId = await Users.findOne({ where: { email } });
    const user_id = userId.id;

    const allWishList = await Wishlists.findAndCountAll({
      where: { user_id },
      limit,
      offset,
    });

    const result = allWishList.rows;
    const totalCount = allWishList.count;

    if (result.length <= 0) {
      res.status(404).json({
        status: "fail",
        message: "No wishlist found at the moment.",
      });
    } else {
      res.status(200).json({
        status: "success",
        message: `${result.length} wishlists fetched successfully.`,
        data: result,
        currentPage: offset / limit + 1,
        totalPages: Math.ceil(totalCount / limit),
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const removeWishlistItem = async (req, res) => {
  const tokenHeader = req.headers.authorization;
  if (!tokenHeader) {
    return res.status(401).json({ message: "Token not provided" });
  }
  const token = tokenHeader.split(" ")[1];
  try {
    const decodedToken = JwtUtility.verifyToken(token);
    const { product_id } = req.body;

    const user = await Users.findOne({ where: { email: decodedToken.email } });
    const user_id = user.id;

    const deletedCount = await Wishlists.destroy({
      where: { product_id, user_id },
    });

    if (deletedCount === 0) {
      return res.status(404).json({
        message: "Product not found in the wishlist",
      });
    }

    return res.status(200).json({
      message: "Product successfully removed from the wishlist",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { wishlist, getAllWishes, removeWishlistItem };
