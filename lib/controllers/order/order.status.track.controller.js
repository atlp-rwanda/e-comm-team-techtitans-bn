// // import jwt from 'jsonwebtoken';
// import JwtUtility from "../../utils/jwt.util";
// // import db from '../../database/models';
// import models from "../../../src/database/models";
// import { WebSocket } from "ws";
// const Order = models.Order;
// export const getOrderStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const token = req.headers.authorization.split(" ")[1];
//     const decoded = JwtUtility.verifyToken(token);
//     const { userId, userRole } = decoded;

//     // Retrieve order from the database
//     // Retrieve order from the database
//     const order = await Order.findOne({ where: { id } });
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     // Check if the user has access to the order information
//     if (userRole === "buyer" && order.buyer.toString() !== roleID) {
//       return res
//         .status(403)
//         .json({ message: "You do not have access to this order." });
//     } else if (userRole === "seller" && order.seller.toString() !== roleId) {
//       // Only sellers can update the order status
//       if (req.method === "POST") {
//         return res.status(403).json({
//           message: "You do not have permission to update the order status.",
//         });
//       }
//     }

//     // If it's a GET request, return the order status information
//     if (req.method === "GET") {
//       return res.status(200).json({
//         orderStatus: order.status,
//         expectedDeliveryDate: order.expectedDeliveryDate,
//         shipped: order.shipped,
//         delivered: order.delivered,
//         cancelled: order.cancelled,
//         refunded: order.refunded,
//         onHold: order.onHold,
//         returned: order.returned,
//       });
//     }

//     // If it's a POST request, update the order status information
//     if (req.method === "POST") {
//       const {
//         status,
//         expectedDeliveryDate,
//         shipped,
//         delivered,
//         cancelled,
//         refunded,
//         returned,
//       } = req.body;

//       // Update the order status information
//       order.status = status;
//       order.expectedDeliveryDate = expectedDeliveryDate;
//       order.shipped = shipped;
//       order.delivered = delivered;
//       order.cancelled = cancelled;
//       order.refunded = refunded;
//       order.returned = returned;
//       await order.save();

//       // Send updated order status to all connected clients via WebSockets
//       const ws = new WebSocket('ws://localhost:3000');//
//       ws.on('open', () => {
//         ws.send(JSON.stringify({ type: 'orderStatusUpdated', id, status }));
//         ws.close();
//       });

//       // Return the updated order status information
//       return res.status(200).json({
//         message: "Order status has been updated successfully.",
//         orderStatus: order.status,
//         expectedDeliveryDate: order.expectedDeliveryDate,
//         shippedOrDispatched: order.shippedOrDispatched,
//         delivered: order.delivered,
//         cancelled: order.cancelled,
//         refunded: order.refunded,
//         onHold: order.onHold,
//         returned: order.returned,
//       });
//     }
//   } catch (err) {
//     console.error(err);
//     return res
//       .status(500)
//       .json({ message: "Something went wrong. Please try again later." });
//   }
// };

// export default getOrderStatus;
"use strict";