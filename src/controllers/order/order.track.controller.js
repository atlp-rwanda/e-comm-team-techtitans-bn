import models from "../../database/models";
const UpdateOrderStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const { status } = req.body;
    const order = await models.Order.findOne({ where: { id } });
    if (!order) {
      return res.status(401).json({
        message: "No order with such id",
      });
    } else {
      const updatedOrder = await order.update({
        status: status,
      });

      res.status(200).json({
        status: "success",
        message: `🍀 The order has been marked as ${status} successfully.`,
        data: updatedOrder,
      });
    }
  } catch (error) {
    console.log("Error #####", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export default UpdateOrderStatus;
