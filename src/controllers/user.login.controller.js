
import db from '../database/models';
import BcryptUtility from '../utils/bcrypt.util';
import JwtUtility from '../utils/jwt.util';
import speakeasy from 'speakeasy';
import sendEmail from "../utils/send.email";

const User = db.User;

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: 'Please provide both email and password',
            });
        }
        // Find the email of the user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password',
            });
        }
        // Check if the user password matches
        const passwordMatch = await BcryptUtility.verifyPassword(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                message: 'Invalid email or password',
            });
        }
        const secret = speakeasy.generateSecret();

        user.mfa_secret = secret.base32;
        await user.save();

        const otp = speakeasy.totp({
            secret: secret.base32,
            encoding: 'base32',
        });
        const to=email;
        const subject='your Otp';
        const text=otp;
        sendEmail.sendEmail(to,subject,text)


        console.log(`Your one-time code is: ${otp}`);

        // Return a response indicating that the user needs to enter their one-time code
        return res.status(202).json({
            message: 'Please enter your OTP',
            user: {
                id: user.id,
                email: user.email,
                secondFactorEnabled: user.mfa_secret ? true : false,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({
                message: 'Please provide both email and OTP',
            });
        }

        // Find the user in the database
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or OTP',
            });
        }

        // Verify the one-time code
        const secret = user.mfa_secret;
        const isValid = speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token: otp,
            window: 1,
        });
        if (!isValid) {
            return res.status(401).json({
                message: 'Invalid email or one-time code',
            });
        }

        // Generate a new JWT token and set it as a cookie
        const token = JwtUtility.generateToken(
            {
                id: user.id,
                email: user.email,
            },
            '1d'
        );
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // cynthia you must remember to set this to true in production(push) and false in dev
        });


        // Send a confirmation email to the user
        // const transporter = nodemailer.createTransport({
        //     host: 'smtp.gmail.com',
        //     port: 587,
        //     auth: {
        //         user: '',
        //         pass: '',
        //     },
        // });
        // const mailOptions = {
        //     from: '',
        //     to: email,
        //     subject: 'Login Successful',
        //     text: 'Your login was successful.',
        // };
        // await transporter.sendMail(mailOptions);

        // Return a response indicating that the login was successful
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


export { login, verifyOtp };