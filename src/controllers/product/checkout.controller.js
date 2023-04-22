import JwtUtility from '../../utils/jwt.util';

class checkout {
  static async check(req, res) {
    const { receiverName, address, phoneNumber, shippingMethod, amount } = req.body;
    const token = JwtUtility.generateToken({ receiverName, address, phoneNumber, shippingMethod, amount }, '1d');
    res.status(200).json({
      message: 'Thanks you can now proceed with payments.....',
      data: [receiverName, address, phoneNumber, shippingMethod, amount],
      token,
    });
  }
}

export default checkout;
