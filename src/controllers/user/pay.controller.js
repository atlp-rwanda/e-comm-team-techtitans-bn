import dotenv from 'dotenv';
import Stripe from 'stripe';
import JwtUtility from '../../utils/jwt.util';
import sendEmail from '../../utils/send.email';

dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

class payments {
  static checkCard(cardNumber) {
    // Remove any spaces or dashes from the card number
    cardNumber = cardNumber.replace(/[\s-]/g, '');

    // Check if the card number is between 12 and 19 digits
    if (cardNumber.length < 12 || cardNumber.length > 19) {
      return false;
    }
    // Apply the Luhn algorithm
    let sum = 0;
    let isEven = false;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i), 10);
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  static async pay(req, res) {
    const tokenHeader = req.headers.authorization;
    if (!tokenHeader) {
      return res.status(401).json({ message: 'Token not provided' }); // assuming the token is sent in the Authorization header
    }
    const token = tokenHeader.split(' ')[1];
    const { payToken } = req.params;
    const { cvc, cardNumber } = req.body;
    const decodedToken = JwtUtility.verifyToken(payToken);
    const authToken = JwtUtility.verifyToken(token);
    const checks = payments.checkCard(cardNumber);
    if (!checks) {
      return res.status(500).json({ message: 'card declined' });
    }
    const stripeToken = await stripe.tokens.create({
      card: {
        number: cardNumber,
        exp_month: 12,
        exp_year: 2024,
        cvc,
      },
    });

    const customer = await stripe.customers.create({
      email: authToken.email,
      source: stripeToken.id,
    });
    try {
      const charge = await stripe.charges.create({
        // amount: 1000 / 10,
        // amount: decodedToken.amount / 10,
        amount: decodedToken.amount,
        currency: 'usd',
        description: 'payment',
        customer: customer.id,
      });
      // console.log(charge.receipt_url);
      res.status(200).json({
        message: 'your payment is successful',
        success: true,
        charge,
      });
      const context = {
        verifyUrl: `${charge.receipt_url}`,
        content: 'View Receipt',
      };
      sendEmail.confirmPayment(
        authToken.email,
        'Payment Confirmation',
        context,
      );
    } catch (error) {
      res.status(500).json({ message: error.message, error });
    }
  }
}
/*
token Example:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbW91bnQiOjUwMCwiZW1haWwiOiJpc2
hpbXdlcmljaGFyZDI2QGdtYWlsLmNvbSIsImlhdCI6MTY4MTU3ODgzMSwiZXhwIjoxNjgxNjY1
MjMxfQ.azeTZ6yxGEBN6maOj9BjwkiZfnLksPaPHLWh4AVZKZY
*/

export default payments;
