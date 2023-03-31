import jwt from "jsonwebtoken";
import db from "../database/models";
import BcryptUtility from "../utils/bcrypt.util";
import JwtUtility from "../utils/jwt.util";
import response from "../utils/response.util";
import sendEmail from "../utils/send.email";
const User = db.users;
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
        message: "Please provide both email and password",
      });
    }
    // Find the email of the user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    // Check if the user password matches
    const passwordMatch = await BcryptUtility.verifyPassword(
      password,
      user.password
    );
    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = JwtUtility.generateToken(
      {
        id: user.id,
        email: user.email,
      },
      "1d"
    );

    // Set cookie with the token as its value
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // cynthia you must remember to set this to true in production(push) and false in dev
    });

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
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
  deleteAllUsers,
  findAllUsers,
  updateProfile,
  login,
};
