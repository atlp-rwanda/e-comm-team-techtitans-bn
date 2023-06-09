import jwt from "jsonwebtoken";
import db from "../../database/models";
import BcryptUtility from "../../utils/bcrypt.util";
import JwtUtility from "../../utils/jwt.util";
import response from "../../utils/response.util";
import sendEmail from "../../utils/send.email";
import request from "superagent";
import app from "../../app";
const Subscriber = db.subscribers;
var mailchimpInstance = process.env.mail_instance,
  listUniqueId = process.env.mail_list_id,
  mailchimpApiKey = process.env.mail_api_key;
const verifySubscriber = async (req, res) => {
  try {
    const subscriber = {
      ...req.body,
    };
    const emailAlreadyExists = await Subscriber.findOne({
      where: { email: subscriber.email },
    });
    if (emailAlreadyExists !== null) {
      res.status(401).json({
        message: "Email already exists",
      });
    } else {
      switch (true) {
        case subscriber.firstName.trim() === "":
          res.status(401).json({
            message: "Please enter your name",
          });
          break;
        case subscriber.lastName.trim() === "":
          res.status(401).json({
            message: "Please enter your name",
          });
          break;
        case subscriber.email.trim() === "":
          res.status(401).json({
            message: "Email can not be empty",
          });
          break;
        case !/\S+@\S+\.\S+/.test(subscriber.email):
          res.status(401).json({
            message: "Please enter a valid email address.",
          });
          break;
        default:
          const subscriberToken = JwtUtility.generateToken(subscriber, "1h");
          const to = subscriber.email;
          const context = {
            verifyUrl: `${process.env.VERIFICATION_URL}/api/v1/user/subscriber/${subscriberToken}`,
            content: "VERIFY YOUR EMAIL",
          };
          sendEmail.sendEmailSubscriber(to, "verification email", context);
          response.success(
            res,
            200,
            "Check your email and proceed with verification",
            {
              email: subscriber.email,
              subscriberToken,
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
const createSubscriber = async (req, res) => {
  try {
    const { token } = req.params;
    const check = jwt.verify(token, process.env.SECRET_TOKEN);
    const subscriberExist = await Subscriber.findOne({
      where: { email: check.email },
    });
    if (subscriberExist) {
      return res.status(400).send({
        message: "User already VERIFIED",
      });
    }
    request
      .post(
        "https://" +
          mailchimpInstance +
          ".api.mailchimp.com/3.0/lists/" +
          listUniqueId +
          "/members/"
      )
      .set("Content-Type", "application/json;charset=utf-8")
      .set(
        "Authorization",
        "Basic " + new Buffer("any:" + mailchimpApiKey).toString("base64")
      )
      .send({
        email_address: check.email,
        status: "subscribed",
        merge_fields: {
          FNAME: check.firstName,
          LNAME: check.lastName,
        },
      })
      .end(function (err, response) {
        if (err) {
          console.error(err);
          return res.status(500).send("Failed to subscribe to the list");
        }
        if (
          response.status < 300 ||
          (response.status === 400 && response.body.title === "Member Exists")
        ) {
          Subscriber.create(check)
            .then((data) => {
              return res.status(201).send({
                message: "check a welcoming message we sent you...",
              });
            })
            .catch((err) => {
              console.error(err);
              return res.status(500).send({
                message: "Failed to create subscriber",
              });
            });
        } else {
          console.error(response.body);
          return res.status(500).send("Failed to subscribe to the list");
        }
      });
    const context = {
      verifyUrl: `${process.env.WELCOME_URL}`,
      content: "GET STARTED",
    };
    sendEmail.sendWelcome(check.email, "verification email", context);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
const updateSubscriber = async (req, res) => {
  const subcriber_id = req.params.id;
  const { firstName, lastName, email } = req.body;
  const findSubscriber = await Subscriber.findOne({
    where: { id: subcriber_id },
  });
  if (!findSubscriber) {
    return res.status(404).json({
      message: `subscriber not found`,
    });
  }
  Subscriber.update(
    {
      email,
      firstName,
      lastName,
    },
    {
      where: {
        id: subcriber_id,
      },
    }
  )
    .then((findSubscriber) => {
      Subscriber.findOne({ where: { id: subcriber_id } }).then((sub) => {
        return res.status(200).json({
          message: `subscriber with id ${subcriber_id} successfully updated`,
          data: sub,
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
const deleteSubscriber = async (req, res) => {
  try {
    const subcriber_id = req.params.id;
    const findSubscriber = await Subscriber.findOne({
      where: { id: subcriber_id },
    });
    if (!findSubscriber) {
      return res.status(404).json({
        message: `subscriber not found`,
      });
    } else {
      await findSubscriber.destroy();
      res.status(200).json({
        message: `:four_leaf_clover: The subscriber has been removed.`,
      });
    }
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};
export {
  verifySubscriber,
  createSubscriber,
  updateSubscriber,
  deleteSubscriber,
};
