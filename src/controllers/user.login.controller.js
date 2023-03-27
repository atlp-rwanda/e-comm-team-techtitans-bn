import db from '../database/models';
import BcryptUtility from '../utils/bcrypt.util';
import JwtUtility from '../utils/jwt.util';
// import jwt from 'jsonwebtoken';

const User = db.users;

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: 'Please provide both email and password',
            });
        }
        // Find the amail of the user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password',
            });
        }
        // this check if the user password match

        const passwordMatch = await BcryptUtility.verifyPassword(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                message: 'Invalid email or password',
            });
        }

        const token = JwtUtility.generateToken({
            id: user.id,
            email: user.email,
        }, '1d');
        res.status(200).json({
            message: 'Login successful',
            token,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export { login };
