"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifySubscriber = exports.updateSubscriber = exports.deleteSubscriber = exports.createSubscriber = void 0;
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _models = _interopRequireDefault(require("../../database/models"));
var _bcrypt = _interopRequireDefault(require("../../utils/bcrypt.util"));
var _jwt = _interopRequireDefault(require("../../utils/jwt.util"));
var _response = _interopRequireDefault(require("../../utils/response.util"));
var _send = _interopRequireDefault(require("../../utils/send.email"));
<<<<<<< HEAD
=======
var _superagent = _interopRequireDefault(require("superagent"));
var _app = _interopRequireDefault(require("../../app"));
>>>>>>> 8f01b1f521c56b12da8affa7772b787b4dd27ca2
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
const Subscriber = _models.default.subscribers;
<<<<<<< HEAD
=======
var mailchimpInstance = "us10",
  listUniqueId = "4c847bb5ee",
  mailchimpApiKey = "dea0bd7eedd46d80b152607219da99d0-us10";
>>>>>>> 8f01b1f521c56b12da8affa7772b787b4dd27ca2
const verifySubscriber = async (req, res) => {
  try {
    const subscriber = _objectSpread({}, req.body);
    const emailAlreadyExists = await Subscriber.findOne({
      where: {
        email: subscriber.email
      }
    });
    if (emailAlreadyExists !== null) {
      res.status(401).json({
        message: "Email already exists"
      });
    } else {
      switch (true) {
        case subscriber.firstName.trim() === "":
          res.status(401).json({
            message: "Please enter your name"
          });
          break;
        case subscriber.lastName.trim() === "":
          res.status(401).json({
            message: "Please enter your name"
          });
          break;
        case subscriber.email.trim() === "":
          res.status(401).json({
            message: "Email can not be empty"
          });
          break;
        case !/\S+@\S+\.\S+/.test(subscriber.email):
          res.status(401).json({
            message: "Please enter a valid email address."
          });
          break;
        default:
          const subscriberToken = _jwt.default.generateToken(subscriber, "1h");
          const to = subscriber.email;
          const context = {
<<<<<<< HEAD
            verifyUrl: `${process.env.VERIFICATION_URL}/api/v1/user/subscribe/${subscriberToken}`,
=======
            verifyUrl: `${process.env.VERIFICATION_URL}/api/v1/user/subscriber/${subscriberToken}`,
>>>>>>> 8f01b1f521c56b12da8affa7772b787b4dd27ca2
            content: "VERIFY YOUR EMAIL"
          };
          _send.default.sendEmailSubscriber(to, "verification email", context);
          _response.default.success(res, 200, "Check your email and proceed with verification", {
            email: subscriber.email,
            subscriberToken
          });
          break;
      }
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
exports.verifySubscriber = verifySubscriber;
const createSubscriber = async (req, res) => {
  try {
    const {
      token
    } = req.params;
    const check = _jsonwebtoken.default.verify(token, process.env.SECRET_TOKEN);
    const subscriberExist = await Subscriber.findOne({
      where: {
        email: check.email
      }
    });
    if (subscriberExist) {
      res.status(400).send({
        message: "User already VERIFIED"
      });
    }
    if (!subscriberExist) {
      Subscriber.create(check).then(data => {
        res.status(201).send({
          message: "check a welcoming message we sent you..."
        });
<<<<<<< HEAD
=======
      }).then(dat => {
        _superagent.default.post("https://" + mailchimpInstance + ".api.mailchimp.com/3.0/lists/" + listUniqueId + "/members/").set("Content-Type", "application/json;charset=utf-8").set("Authorization", "Basic " + new Buffer("any:" + mailchimpApiKey).toString("base64")).send({
          email_address: req.body.email,
          status: "subscribed",
          merge_fields: {
            FNAME: req.body.firstName,
            LNAME: req.body.lastName
          }
        }).end(function (err, response) {
          if (response.status < 300 || response.status === 400 && response.body.title === "Member Exists") {
            res.send("Signed Up!");
          } else {
            res.send("Sign Up Failed :(");
          }
        });
>>>>>>> 8f01b1f521c56b12da8affa7772b787b4dd27ca2
      }).catch(err => {
        res.status(500).send({
          message: "Internal Server Error"
        });
      });
    }
    const context = {
      verifyUrl: `${process.env.WELCOME_URL}`,
      content: "GET STARTED"
    };
    _send.default.sendWelcome(check.email, "verification email", context);
  } catch (error) {
    return res.status(500).json({
      message: err
    });
  }
};
exports.createSubscriber = createSubscriber;
const updateSubscriber = async (req, res) => {
  const subcriber_id = req.params.id;
  const {
    firstName,
    lastName,
    email
  } = req.body;
  const findSubscriber = await Subscriber.findOne({
    where: {
      id: subcriber_id
    }
  });
  if (!findSubscriber) {
    return res.status(404).json({
      message: `subscriber not found`
    });
  }
  Subscriber.update({
    email,
    firstName,
    lastName
  }, {
    where: {
      id: subcriber_id
    }
  }).then(findSubscriber => {
    Subscriber.findOne({
      where: {
        id: subcriber_id
      }
    }).then(sub => {
      return res.status(200).json({
        message: `subscriber with id ${subcriber_id} successfully updated`,
        data: sub
      });
    });
  }).catch(err => {
    console.log(err);
  });
};
exports.updateSubscriber = updateSubscriber;
const deleteSubscriber = async (req, res) => {
  try {
    const subcriber_id = req.params.id;
    const findSubscriber = await Subscriber.findOne({
      where: {
        id: subcriber_id
      }
    });
    if (!findSubscriber) {
      return res.status(404).json({
        message: `subscriber not found`
      });
    } else {
      await findSubscriber.destroy();
      res.status(200).json({
        message: `🍀 The subscriber has been removed.`
      });
    }
  } catch (error) {
    return res.status(404).json({
      message: error
    });
  }
};
exports.deleteSubscriber = deleteSubscriber;