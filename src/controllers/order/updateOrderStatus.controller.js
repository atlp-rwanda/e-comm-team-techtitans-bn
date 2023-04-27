import models from '../../database/models';
import {notifyUserOnProductOrderShipped} from "../notification/notifications.controller";


const OrderStatus = async (req, res) => {
    const { uuid } = req.params
    try {

      // Find the order
      const order = await models.Order.findOne({ where: { uuid } });
      if (!order) {
        return res.status(401).json({
          message: 'no order with such id',
        });
      }
      // Change order status
      else{
        const updatedOrder = await order.update({
            status: "shipped",
          });
          res.status(200).json({
            status: "success",
            message: "🍀 The order has been marked shipped sucessfully.",
            data: updatedOrder,
          });

          await  notifyUserOnProductOrderShipped(updatedOrder);
      }


    }
    catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  export default OrderStatus
