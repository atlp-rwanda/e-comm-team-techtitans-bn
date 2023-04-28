"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNotificationForVendor = exports.getNotificationById = exports.deleteNotificationById = exports.deleteAllNotificationsForVendor = void 0;
var _models = _interopRequireDefault(require("../../database/models"));
var _jwt = _interopRequireDefault(require("../../utils/jwt.util"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const User = _models.default.users;
const Product = _models.default.Product;
const Notification = _models.default.Notification;
const getNotificationForVendor = async (req, res) => {
  const tokenHeader = req.headers.authorization;
  if (!tokenHeader) {
    return res.status(401).json({
      message: "Token not provided"
    }); // assuming the token is sent in the Authorization header
  }

  const token = tokenHeader.split(" ")[1];
  const limit = req.query.limit || 10; // default to 10 products per page
  const page = req.query.page || 1; // default to the first page
  const offset = (page - 1) * limit; // calculate the offset based on the page number
  try {
    const decodedToken = _jwt.default.verifyToken(token);
    const allNotifications = await Notification.findAndCountAll({
      where: {
        email: decodedToken.email
      },
      limit,
      offset
    });
    const notifications = allNotifications.rows;
    const totalCount = allNotifications.count;
    if (!notifications || notifications.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "you don't have any notification at the moment"
      });
    }
    return res.status(200).json({
      status: 200,
      message: ` ${notifications.length}  Notifications retrieved successfully`,
      data: {
        notifications
      },
      currentPage: offset / limit + 1,
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
      error: error.message
    });
  }
};
exports.getNotificationForVendor = getNotificationForVendor;
const getNotificationById = async (req, res) => {
  const tokenHeader = req.headers.authorization;
  if (!tokenHeader) {
    return res.status(401).json({
      message: "Token not provided"
    }); // assuming the token is sent in the Authorization header
  }

  const token = tokenHeader.split(" ")[1];
  try {
    const decodedToken = _jwt.default.verifyToken(token);
    const notificationId = req.params.id; // assuming the notification ID is passed as a parameter in the request

    const notification = await Notification.findOne({
      where: {
        email: decodedToken.email,
        id: notificationId
      }
    });
    if (!notification) {
      return res.status(404).json({
        status: 404,
        message: "Notification not found"
      });
    }
    return res.status(200).json({
      status: 200,
      message: "Notification retrieved successfully",
      data: {
        notification
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: error.message
    });
  }
};
exports.getNotificationById = getNotificationById;
const deleteNotificationById = async (req, res) => {
  const tokenHeader = req.headers.authorization;
  if (!tokenHeader) {
    return res.status(401).json({
      message: "Token not provided"
    }); // assuming the token is sent in the Authorization header
  }

  const token = tokenHeader.split(" ")[1];
  try {
    const decodedToken = _jwt.default.verifyToken(token);
    const notificationId = req.params.id; // assuming the notification ID is passed as a parameter in the request

    const notification = await Notification.findOne({
      where: {
        email: decodedToken.email,
        id: notificationId
      }
    });
    if (!notification) {
      return res.status(404).json({
        status: 404,
        message: "Notification not found"
      });
    }
    await notification.destroy();
    return res.status(200).json({
      status: 200,
      message: "Notification deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: error.message
    });
  }
};
exports.deleteNotificationById = deleteNotificationById;
const deleteAllNotificationsForVendor = async (req, res) => {
  const tokenHeader = req.headers.authorization;
  if (!tokenHeader) {
    return res.status(401).json({
      message: "Token not provided"
    }); // assuming the token is sent in the Authorization header
  }

  const token = tokenHeader.split(" ")[1];
  try {
    const decodedToken = _jwt.default.verifyToken(token);
    await Notification.destroy({
      where: {
        email: decodedToken.email
      }
    });
    return res.status(200).json({
      status: 200,
      message: 'Notifications deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
      error: error.message
    });
  }
};
exports.deleteAllNotificationsForVendor = deleteAllNotificationsForVendor;