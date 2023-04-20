// import Wishlist from "../../database/models/wishlist";
// import Product from "../../database/models/product";
import models from "../../database/models";
import jwt from "jsonwebtoken";
import JwtUtility from "../../utils/jwt.util";
import bcrypt from "bcrypt";
// import User from "../../database/models/user";

const Users = models.User;
const Products = models.Product;
const Wishlists = models.Wishlist;

const secretToken = process.env.SECRET_TOKEN;
const wishlist = async (req, res) => {
  const tokenHeader = req.headers.authorization;
  if (!tokenHeader) {
    return res.status(401).json({ message: "Token not provided" }); // assuming the token is sent in the Authorization header
  }
  const token = tokenHeader.split(" ")[1];
  try {
    const decodedToken = JwtUtility.verifyToken(token);
    // const user = await User.findOne({ where: { id: decodedToken.id } });
    const { product_id } = req.body;

    const user = await Users.findOne({ where: { email: decodedToken.email } });

    const product = await Products.findOne({ where: { id: product_id } });

    if (!product) {
      return res.status(500).json({
        message: `Product not exist`,
      });
    } else {
      const user_id = user.id;
      //   console.log(user_id);
      const productExist = await Wishlists.findOne({
        where: { product_id, user_id },
      });

      if (productExist) {
        return res.status(500).json({
          message: `product already exist in your wish list`,
        });
      }
      const wishList = await Wishlists.create({ user_id, product_id });

      return res.status(201).json({
        message: "product successfully added to a wishlist",
        data: wishList,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllWishes = async (req, res) => {
  const { token } = req.params;

  // const allWishes = await Wishlist.findOne({ where: { user_id } });
  try {
    const payload = jwt.verify(token, secretToken);
    const { email } = payload;

    const userId = await Users.findOne({ where: { email } });
    const user_id = userId.id;

    const allWishList = await Wishlists.findAll({ where: { user_id } });
    const { product_id } = allWishList;
    const newWishListArray = [];
    await Promise.all(
      allWishList.map(async (prod) => {
        let prodId = await Products.findAll({ where: { id: prod.product_id } });
        newWishListArray.push(prodId);
      })
    );
    // allWishList.forEach(async (prod) => {
    //   let prodId = await Product.findAll({ where: { id: prod.product_id } });

    //   newWishListArray.push(JSON.stringify(prodId));
    // });

    return res.status(200).json({
      message: `${newWishListArray.length} all wish list`,
      data: newWishListArray,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export { wishlist, getAllWishes };
