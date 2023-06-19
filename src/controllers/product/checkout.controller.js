import JwtUtility from '../../utils/jwt.util';

class checkout {
  static async check(req, res) {
    const { receiverName, address, phoneNumber, shippingMethod, orderToken } =
      req.body;
    const decodedToken = JwtUtility.verifyToken(orderToken);
    const amount = decodedToken.total;
    const tokens = JwtUtility.generateToken(
      { receiverName, address, phoneNumber, shippingMethod, amount },
      '1y',
    );
    res.status(200).json({
      message: 'Thanks you can now proceed with payments.....',
      data: [receiverName, address, phoneNumber, shippingMethod, amount],
      payToken: tokens,
    });
  }
}

export default checkout;
