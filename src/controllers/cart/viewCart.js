import db from '../../database/models'

const User = db.users
const Product = db.products
const Cart = db.carts

const viewCart = async (req, res) => {
    const user = await User.findOne({ where: { email: req.user.email } });
    const cart = await Cart.findAll({ where: { userId: user.id } });
    const products = await Product.findAll();
    const cartProducts = [];
    cart.forEach((cartItem) => {
        products.forEach((product) => {
            if (cartItem.productId === product.id) {
                cartProducts.push(product);
            }
        });
        res.status(200).json({
            message: 'Cart retrieved successfully',
            cartProducts,
        });

    });
}

