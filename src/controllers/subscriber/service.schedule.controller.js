import db from "../../database/models";
import models from "../../database/models";
import cron from "node-cron";
import sendEmail from "../../utils/send.email";
const Subscriber = db.subscribers;
const Product = models.Product;
//(****)
// const scheduleEmail = cron.schedule("* * * * *", async (product) => {
//   const allSubscriber = await Subscriber.findAll();
//   // const Allproducts= await Product.findAll();
//   for (const subscriber of allSubscriber) {
//     const to = subscriber.email;
//     const subject = "tech titans newsletter";
//     const text = "tech titans news letter is there to update you";
//     const context = {
//       price: 1000,
//     };
//     sendEmail.sendPromotion(to, subject, context);
//   }
// });
const SendNewProductUpdated =  async (product) => {
  const allSubscriber = await Subscriber.findAll();
  // console.log('AllSubscribers',allSubscriber)
  const products= await Product.findAll({where:{id:product.id}});
  // console.log(products);
if (products && products.length>0){
    for (const subscriber of allSubscriber) {
      const to = subscriber.email;
      const subject = "tech titans newsletter";
      const text = "Our Product is updated";
      const context = {
        image:product.images[0],
        price: product.price,
        name:product.name,
        description:product.description,
        id:subscriber.id,
      };
      console.log("This is the context",context);
      sendEmail.sendPromotion(to, subject, context);
      console.log("This statement is true");
    }


}};
export {SendNewProductUpdated};
