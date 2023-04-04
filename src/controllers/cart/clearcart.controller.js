import models from "../../database/models";
import JwtUtility from '../../utils/jwt.util';
import { isBuyer } from '../../middleware/auth/auth.middleware';
import db from '../../database/models';
import { where } from "sequelize";

const { getCart } = require('./cartFunction');

const User = db.users;
const Product = db.products;
const Cart = db.carts;

//function to delete the cart
const clearCart = async (req, res) => {
    try {
        const tokenHeader = req.headers.authorization;
        const token = tokenHeader.split(' ')[1];
        const decodedToken = JwtUtility.verifyToken(token);
        const user = await User.findOne({ where: { id: decodedToken.id } });

        if (user && decodedToken && decodedToken.roleId === 3) {
            const { uid } = req.params;
            if (uid !== decodedToken.id) {
                return res.status(401).json({
                    status: "fail",
                    message: "🚫 Sorry, You are unauthorised to perform action ..",
                });
            }
          const availableCart = await models.Cart.findOne({
                where: {
                    userId: uid,
                },
            });
            if (!availableCart) {
               return res.status(404).json({
                    status: "fail",
                    message: "🚫 Sorry, this cart was not found...",
                });
            }
            else {
                await availableCart.destroy();
                res.status(200).json({
                    status: "success",
                    message: `🍀 This Cart is cleared`,
                });
            }
        }
    }
    catch (error) {
        res.status(500).json({
            ror: error.message,
            message: 'Sorry, we encountered an error while trying to delete your cart.',
        });
    };

};
export default clearCart;