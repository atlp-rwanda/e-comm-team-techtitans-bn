import models from '../../database/models';
import db from '../../database/models';
import JwtUtility from "../../utils/jwt.util";

const User = db.users;
const Product = models.Product;
const Notification = models.Notification;

const getNotificationForVendor = async (req, res) => {
  const tokenHeader = req.headers.authorization;
  if (!tokenHeader) {
    return res.status(401).json({ message: "Token not provided" });  // assuming the token is sent in the Authorization header
  }

  const token = tokenHeader.split(" ")[1];
  const limit = req.query.limit || 10; // default to 10 products per page
  const page = req.query.page || 1; // default to the first page
  const offset = (page - 1) * limit; // calculate the offset based on the page number
  try {
    const decodedToken = JwtUtility.verifyToken(token);
    const allNotifications = await Notification.findAndCountAll({ where: { email: decodedToken.email }, limit, offset });
    const notifications = allNotifications.rows;
    const totalCount = allNotifications.count;
    if (!notifications || notifications.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "you don't have any notification at the moment",
      });
    }

    return res.status(200).json({
      status: 200,
      message: ` ${notifications.length}  Notifications retrieved successfully`,
      data: {
        notifications,
      },
      currentPage: offset / limit + 1,
      totalPages: Math.ceil(totalCount / limit),
    });


  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
      error: error.message,
    });
  }
}
const getNotificationById = async (req, res) => {
  const tokenHeader = req.headers.authorization;
  if (!tokenHeader) {
    return res.status(401).json({ message: "Token not provided" });  // assuming the token is sent in the Authorization header
  }

  const token = tokenHeader.split(" ")[1];

  try {
    const decodedToken = JwtUtility.verifyToken(token);
    const notificationId = req.params.id; // assuming the notification ID is passed as a parameter in the request

    const notification = await Notification.findOne({
      where: {
        email: decodedToken.email,
        id: notificationId,
      },
    });

    if (!notification) {
      return res.status(404).json({
        status: 404,
        message: "Notification not found",
      });
    }

    await notification.update({
      notificationStatus: 'read',
    });
    return res.status(200).json({
      status: 200,
      message: "Notification retrieved successfully ",
      data: {

        notification,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const deleteNotificationById = async (req, res) => {
  const tokenHeader = req.headers.authorization;
  if (!tokenHeader) {
    return res.status(401).json({ message: "Token not provided" });  // assuming the token is sent in the Authorization header
  }

  const token = tokenHeader.split(" ")[1];

  try {
    const decodedToken = JwtUtility.verifyToken(token);
    const notificationId = req.params.id; // assuming the notification ID is passed as a parameter in the request

    const notification = await Notification.findOne({
      where: {
        email: decodedToken.email,
        id: notificationId,
      },
    });

    if (!notification) {
      return res.status(404).json({
        status: 404,
        message: "Notification not found",
      });
    }

    await notification.destroy();

    return res.status(200).json({
      status: 200,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};
const deleteAllNotificationsForVendor = async (req, res) => {
  const tokenHeader = req.headers.authorization;
  if (!tokenHeader) {
    return res.status(401).json({ message: "Token not provided" });  // assuming the token is sent in the Authorization header
  }

  const token = tokenHeader.split(" ")[1];
  try {
    const decodedToken = JwtUtility.verifyToken(token);
    await Notification.destroy({ where: { email: decodedToken.email } });

    return res.status(200).json({
      status: 200,
      message: 'Notifications deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
      error: error.message,
    });
  }
}

export {
  getNotificationForVendor,
  getNotificationById,
  deleteNotificationById,
  deleteAllNotificationsForVendor
}