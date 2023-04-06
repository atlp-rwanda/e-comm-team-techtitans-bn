import jwt from "jsonwebtoken";
import db from "../../database/models";
import BcryptUtility from "../../utils/bcrypt.util";
import JwtUtility from "../../utils/jwt.util";
import speakeasy from 'speakeasy';
import response from "../../utils/response.util";
import sendEmail from "../../utils/send.email";
const User = db.users;
const resetSecret = process.env.RESET_SECRET;
const bcrypt = require("bcrypt");
import sendFunc from "../../utils/resetPasswordEmail";

// Create and Save a new User
const verifyUser = async (req, res) => {
  try {
    const user = {
      ...req.body,
    };
    const emailAlreadyExists = await User.findOne({
      where: { email: user.email },
    });
    if (emailAlreadyExists !== null) {
      res.status(401).json({
        message: "Email already exists",
      });
    } else {
      switch (true) {
        case user.fullname.trim() === "":
          res.status(401).json({
            message: "Please enter your name",
          });
          break;
        case user.email.trim() === "":
          res.status(401).json({
            message: "Email can not be empty",
          });
          break;
        case !/\S+@\S+\.\S+/.test(user.email):
          res.status(401).json({
            message: "Please enter a valid email address.",
          });
          break;
        case user.password.trim() === "":
          res.status(401).json({
            message: "Please enter a password.",
          });
          break;
        case user.password.trim().length < 8:
          res.status(401).json({
            message: "Your password must be at least 8 characters long.",
          });
          break;
        //   case !user.password.match(/^[a-z0-9]+$/i):
        case !user.password.match(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/i
        ):
          res.status(401).json({
            message:
              "Your password must contain at least 1 uppercase, 1 lowercase, 1 digit, and one case character.",
          });
          break;
        case user.confirmPassword.trim() === "":
          res.status(401).json({
            message: "Please input your password again.",
          });
          break;
        case user.password !== user.confirmPassword:
          res.status(401).json({
            message: "Both passwords must match.",
          });
          break;
        default:
          // Encrypt the Password
          user.password = await BcryptUtility.hashPassword(req.body.password);
          const to = user.email;
          const userToken = JwtUtility.generateToken(user, "1h");
          const context = {
            verifyUrl: `http://localhost:${process.env.PORT}/api/v1/user/signup/${userToken}`,
            content: "VERIFY YOUR EMAIL",
          };
          sendEmail.sendVerification(to, "verification email", context);
          response.success(
            res,
            200,
            "Check your email and proceed with verification",
            {
              email: user.email,
              password: user.password,
              userToken,
            }
          );
          break;
      }
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Create a new user

const createUser = async (req, res) => {
  const { token } = req.params;
  const check = jwt.verify(token, process.env.SECRET_TOKEN);
  User.create(check)
    .then((data) => {
      res.status(201).json({
        data: data,
        message: "check a welcoming message we sent you...",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
  const context = {
    verifyUrl: `http://localhost:${process.env.PORT}`,
    content: "GET STARTED",
  };
  sendEmail.sendWelcome(check.email, "verification email", context);
};

// Find all Users
const findAllUsers = (req, res) => {
  User.findAll({ where: {} })
    .then((usersList) => {
      res.send({
        message: `${usersList.length} Users were all fetched successfully!`,
        data: usersList,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all users.",
      });
    });
};
// Delete all Users
const deleteAllUsers = (req, res) => {
  User.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Users were all deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all users.",
      });
    });
};

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

if(user.role == 1 ){

  const token = JwtUtility.generateToken(
    {
        id: user.id,
        email: user.email,
    },
    '1d'
);
res.cookie("token", token, {
    httpOnly: true,
    secure: true, // cynthia you must remember to set this to true in production(push) and false in dev
});

// Return a response indicating that the login was successful
return res.status(200).json({
    message: 'Login successful',
    token,
}); 
}
console.log(user)
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
              message: 'Please provide valid OTP/email',
          });
      }

// const mfa_secret = otp 
      // Find the user in the database

      // console.log(otp)
       const user = await User.findOne({ where: {email} });

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
      console.log("isValid", isValid)
      if (!isValid) {


          return res.status(401).json({
              message: 'Invalid one-time code',
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
          secure: true, // cynthia you must remember to set this to true in production(push) and false in dev
      });

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

//FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    //look for email in database
    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(404).json({ error: "Invalid Email" });
    } else {
      // res.status(200).json({message:'User exist'})

      const token = jwt.sign({ user: user.email }, resetSecret, {
        expiresIn: "10m",
      });
      const link = `http://localhost:${process.env.PORT}/api/v1/user/reset-password/${user.id}/${token}`;
      sendFunc(user, link);
      res.status(201).json({
        message: "Password reset Link has been send to your email ....",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getResetPassword = async (req, res) => {
  const { id, token } = req.params;
  //check if id exist
  const user = await User.findOne({ where: { id } });
  if (!user) {
    return res.status(404).json({ error: "user not exist" });
  } else {
    try {
      const payload = jwt.verify(token, resetSecret);
      return res.send({ email: user.email });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password, confirmPassword } = req.body;
  //check if id exist
  const user = await User.findOne({ where: { id } });
  if (!user) {
    return res.status(404).json({ error: "user not exist" });
  } else {
    try {
      const payload = jwt.verify(token, resetSecret);
      switch (true) {
        case password.trim() === "":
          res.status(401).json({
            message: "Please enter a password.",
          });
          break;
        case password.trim().length < 8:
          res.status(401).json({
            message: "Your password must be at least 8 characters long.",
          });
          break;
        //   case !user.password.match(/^[a-z0-9]+$/i):
        case !password.match(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/i
        ):
          res.status(401).json({
            message:
              "Your password must contain at least 1 uppercase, 1 lowercase, 1 digit, and one case character.",
          });
          break;
        case confirmPassword.trim() === "":
          res.status(401).json({
            message: "Please input your password again.",
          });
          break;
        case password !== confirmPassword:
          res.status(401).json({
            message: "Both passwords must match.",
          });
          break;
        default:
          try {
            const payload = jwt.verify(token, resetSecret);
            // user.password = password;
            User.findOne({ where: { id } })
              .then((user) => {
                user.password = bcrypt.hashSync(password, 10);
                return user.save();
              })
              .then((data) => {
                return res.status(200).json({
                  message: "Password successfuly reset",
                  data: data,
                });
              });
          } catch (error) {
            res.status(500).json({ message: error.message });
          }
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
};
// update a profile
const updateProfile = async (req, res) => {
  const { uuid } = req.params;
  const {
    gender,
    birthdate,
    preferredLanguage,
    preferredCurrency,
    location,
    billingAddress,
  } = req.body;

  try {
    const user = await User.findOne({ where: { uuid } });
    user.gender = gender;
    user.birthdate = birthdate;
    user.preferredLanguage = preferredLanguage;
    user.preferredCurrency = preferredCurrency;
    user.location = location;
    user.billingAddress = billingAddress;

    await user.save();
    return res.status(201).json({
      user: {
        gender: user.gender,
        birthdate: user.birthdate,
        preferredLanguage: user.preferredLanguage,
        preferredCurrency: user.preferredCurrency,
        location: user.location,
        billingAddress: user.billingAddress,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: "Server error",
    });
  }
};

export {
  verifyUser,
  createUser,
  verifyOtp,
  deleteAllUsers,
  findAllUsers,
  forgotPassword,
  getResetPassword,
  resetPassword,
  updateProfile,
  login,
};
