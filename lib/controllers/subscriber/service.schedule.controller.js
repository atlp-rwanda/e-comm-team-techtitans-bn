"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SendNewProductUpdated = void 0;
var _models = _interopRequireDefault(require("../../database/models"));
var _nodeCron = _interopRequireDefault(require("node-cron"));
var _send = _interopRequireDefault(require("../../utils/send.email"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Subscriber = _models.default.subscribers;
const Product = _models.default.Product;
const SendNewProductUpdated = async product => {
  const allSubscriber = await Subscriber.findAll();
  // console.log('AllSubscribers',allSubscriber)
  const products = await Product.findAll({
    where: {
      id: product.id
    }
  });
  // console.log(products);
  if (products && products.length > 0) {
    for (const subscriber of allSubscriber) {
      const to = subscriber.email;
      const subject = "tech titans newsletter";
      const text = "Our Product is updated";
      const context = {
        image: product.images[0],
        price: product.price,
        name: product.name,
        description: product.description,
        id: subscriber.id
      };
      console.log("This is the context", context);
      _send.default.sendPromotion(to, subject, context);
      console.log("This statement is true");
    }
  }
};
exports.SendNewProductUpdated = SendNewProductUpdated;