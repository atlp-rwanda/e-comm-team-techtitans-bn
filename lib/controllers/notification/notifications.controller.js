"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notifyVendorProductOutOfStock = exports.notifyVendorOnProductDeletion = exports.notifyVendorOnProductCreate = exports.notifyVendorOnProductBought = exports.notifyUserOnProductOrderShipped = exports.ExpiringProducts = void 0;
var _models = _interopRequireDefault(require("../../database/models"));
var _nodeCron = _interopRequireDefault(require("node-cron"));
var _send = _interopRequireDefault(require("../../utils/send.email"));
var _cheerio = _interopRequireDefault(require("cheerio"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Pusher = require("pusher");
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
  useTLS: true
});
const Products = _models.default.Product;
const User = _models.default.users;
const Orders = _models.default.orders;
const Notifications = _models.default.Notification;

//cron job to find products that are going to expire in 7 days
//cron job  to run every day at 12:00 am:(0 0 * * *)
const ExpiringProducts = _nodeCron.default.schedule('* * * * *', async () => {
  try {
    const products = await Products.findAll();
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);
    for (const product of products) {
      const productExpiryDate = product.expiryDate;
      const vendors = await User.findAll({
        where: {
          id: product.vendorId
        }
      });
      console.log("ALL vendors", vendors);
      for (const vendor of vendors) {
        if (productExpiryDate < expirationDate) {
          // Send notification to vendors via email using nodemailer:
          const to = vendor.email;
          const subject = 'Product Update Reminder';
          const text = `Dear,</br> Vendor <br/><br/><strong>${vendor.fullname}</strong><br/><br/>You have to the remove or update the product that are about to expire in 7 Days <br/>
               <br/><br/> <a href="https://ecommerce-tech-titans.herokuapp.com/api/v1/user/login">Please login in to update your stock</a> <br/><br/>
    Expired products are: <br/><br/></br><label><strong>Product Name : &nbsp; &nbsp; </strong></label> ${product.name} <br/></br></br><label><strong>Product Decription : &nbsp; &nbsp;</strong></label> ${product.description} <br/></br></br> <label><strong>Product Price : &nbsp; &nbsp;</strong></label>${product.price} <br/></br></br> <label><strong>Product Remaining Qantity: &nbsp; &nbsp;</strong></label>${product.quantity} <br/></br></br> <label><strong>Product exp Date : &nbsp; &nbsp;</strong></label>${product.expiryDate} <br/></br></br> <label><strong>Your ID as VENDOR : &nbsp; &nbsp;</strong></label>${product.vendorId} <br/></br></br> <label><strong>Product Category id : &nbsp; &nbsp;</strong></label>${product.categoryId} <br/></br></br><label><strong>Product creation time : &nbsp; &nbsp;</strong></label> ${product.createdAt} <br/></br></br> <label><strong>Product Last update : &nbsp; &nbsp; </strong></label>${product.updatedAt} <br/></br></br> <label><strong>Product Deletion time : &nbsp; &nbsp;</strong></label>${product.deletedAt} <br/></br></br><label><strong>Product id : &nbsp; &nbsp;</strong></label> ${product.id} <br/></br></br>  <br/></br></br> `;
          // const text=html

          _send.default.sendUpdatePassword(to, subject, text);
          // load the HTML body into cheerio
          const $ = _cheerio.default.load(text);

          // extract the text content
          const textBody = $.root().text();
          const neWnotification = await Notifications.create({
            email: to,
            subject: subject,
            body: textBody
          });
          console.log('SOme products are about to be expired in 7 days');
          pusher.trigger("my-channel", "my-event", {
            message: `Your product <strong>${product.name}</strong> is about to be expired`,
            recipient: vendor.email
          });
        }
        if (!productExpiryDate < expirationDate) {
          console.log('No expired product date');
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
});
exports.ExpiringProducts = ExpiringProducts;
const notifyVendorOnProductCreate = async product => {
  try {
    const vendor = await User.findOne({
      where: {
        id: product.vendorId
      }
    });
    if (vendor) {
      const to = vendor.email;
      const subject = 'New Product added to your collection';
      const text = `Dear,</br> Vendor <br/><br/><strong>${vendor.fullname}</strong><br/><br/>New product has been added to your collection <br/>
               <br/><br/> <a href="https://ecommerce-tech-titans.herokuapp.com/api/v1/user/login">Please login in to check your collection</a> <br/><br/>
               Expired products are: <br/><br/></br><label><strong>Product Name : &nbsp; &nbsp; </strong></label> ${product.name} <br/></br></br><label><strong>Product Decription : &nbsp; &nbsp;</strong></label> ${product.description} <br/></br></br> <label><strong>Product Price : &nbsp; &nbsp;</strong></label>${product.price} <br/>
             `;
      _send.default.sendUpdatePassword(to, subject, text);
      console.log('Product created successfully');
      _send.default.sendUpdatePassword(to, subject, text);
      const $ = _cheerio.default.load(text);

      // extract the text content
      const textBody = $.root().text();
      const neWnotification = await Notifications.create({
        email: to,
        subject: subject,
        body: textBody
      });
      // pusher.trigger("my-channel", "my-event", {
      //     message: "New Product added to your collection",
      // });
      pusher.trigger("my-channel", "my-event", {
        message: `New product <strong>${product.name}</strong> added to your collection`,
        recipient: vendor.email
      });
    }
  } catch (err) {
    console.error(err);
  }
};
exports.notifyVendorOnProductCreate = notifyVendorOnProductCreate;
const notifyVendorOnProductDeletion = async product => {
  try {
    const vendor = await User.findOne({
      where: {
        id: product.vendorId
      }
    });
    if (vendor) {
      const to = vendor.email;
      const subject = 'Product Deletion update';
      const text = `Dear,</br> Vendor <br/><br/><strong>${vendor.fullname}</strong><br/><br/>One of your product has been deleted from your collection <br/>
               <br/><br/> <a href="https://ecommerce-tech-titans.herokuapp.com/api/v1/user/login">Please login in to check your collection</a> <br/><br/>
               Expired products are: <br/><br/></br><label><strong>Product Name : &nbsp; &nbsp; </strong></label> ${product.name} <br/></br></br><label><strong>Product Decription : &nbsp; &nbsp;</strong></label> ${product.description} <br/></br></br> <label><strong>Product Price : &nbsp; &nbsp;</strong></label>${product.price} <br/>
             `;
      _send.default.sendUpdatePassword(to, subject, text);
      console.log('Product deleted successfully 2');
      const $ = _cheerio.default.load(text);

      // extract the text content
      const textBody = $.root().text();
      const neWnotification = await Notifications.create({
        email: to,
        subject: subject,
        body: textBody
      });
      // io.emit('New notification', neWnotification.toJSON());
      pusher.trigger("my-channel", "my-event", {
        message: `Product <strong>${product.name}</strong> deleted from your collection`,
        recipient: vendor.email
      });
    }
  } catch (err) {
    console.error(err);
  }
};
exports.notifyVendorOnProductDeletion = notifyVendorOnProductDeletion;
const notifyUserOnProductOrderShipped = async order => {
  try {
    const user = await User.findOne({
      where: {
        id: order.user_id
      }
    });
    if (user) {
      if (order.status === 'shipped') {
        // const to = user.email;
        console.log('Your order has been shipped');
      }
    }
  } catch (err) {
    console.error(err);
  }
};
exports.notifyUserOnProductOrderShipped = notifyUserOnProductOrderShipped;
const notifyVendorOnProductBought = async order => {
  try {
    const orders = await Orders.findAll({
      where: {
        product_id: Products.id
      }
    });
    const orderdPrducts = await Products.findAll({
      where: {
        id: orders.product_id
      }
    });
    const vendor = await User.findOne({
      where: {
        id: orderdPrducts.vendorId
      }
    });
    if (vendor) {
      if (order.status === 'checkedout') {
        // const to = vendor.email;
        console.log('one of your product has been bought');
      }
    }
  } catch (err) {
    console.error(err);
  }
};
exports.notifyVendorOnProductBought = notifyVendorOnProductBought;
const notifyVendorProductOutOfStock = _nodeCron.default.schedule('* * * * *', async () => {
  try {
    const products = await Products.findAll();
    for (const product of products) {
      const vendors = await User.findAll({
        where: {
          id: product.vendorId
        }
      });
      console.log("ALL vendors", vendors);
      for (const vendor of vendors) {
        if (product.quantity === 0 || product.stock === 'out of stock') {
          const to = vendor.email;
          const subject = 'You are out of stock for one of your product';
          const text = `Dear,</br> Vendor <br/><br/><strong>${vendor.fullname}</strong><br/><br/>Some of your product are out of stock <br/>
               <br/><br/> <a href="https://ecommerce-tech-titans.herokuapp.com/api/v1/user/login">Please login in to check your collection</a> <br/><br/>
               Expired products are: <br/><br/></br><label><strong>Product Name : &nbsp; &nbsp; </strong></label> ${product.name} <br/></br></br><label><strong>Product Decription : &nbsp; &nbsp;</strong></label> ${product.description} <br/></br></br> <label><strong>Product Price : &nbsp; &nbsp;</strong></label>${product.price} <br/>
             `;
          _send.default.sendUpdatePassword(to, subject, text);
          const $ = _cheerio.default.load(text);

          // extract the text content
          const textBody = $.root().text();
          const neWnotification = await Notifications.create({
            email: to,
            subject: subject,
            body: textBody
          });
          pusher.trigger("my-channel", "my-event", {
            message: `Product <strong>${product.name}</strong> is out of stock`,
            recipient: vendor.email
          });

          // Send notification to vendors  email using nodemailer:
          console.log('Your product is out of stock');
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
});
exports.notifyVendorProductOutOfStock = notifyVendorProductOutOfStock;