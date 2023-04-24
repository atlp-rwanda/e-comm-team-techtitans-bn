
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import db from '../../database/models';
import models from '../../database/models';
import SendEmail from '../../utils/send.email';



const cron = require('node-cron');

const Products = models.Product;
const User = db.users;



// cron schedule run every day at midnight: (0 0 * * *)
const ExpiredProductRemover = cron.schedule('* * * * *', async () => {
  try {
    const products = await Products.findAll();

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate());
    for (const product of products) {
    const productExpiryDate = product.expiryDate;
       const vendors = await User.findAll({where: {id: product.vendorId}});
      
       for (const vendor of vendors) {
    if (productExpiryDate < expirationDate) {
        // Send notification to vendors via email using nodemailer:
        const to = vendor.email;
        const subject = 'Product Expired';
        const text = `Dear,</br> Vendor <br/><br/><strong>${vendor.fullname}</strong><br/><br/>The following product has expired and has been removed from the list of available products<br/>
         
Expired products are: <br/><br/></br><label><strong>Product Name : &nbsp; &nbsp; </strong></label> ${product.name}<br/></br></br>`;
        // const text=html
        SendEmail.sendProductExpired(to,subject, text);

        await product.update({
           stock: 'expired',
        });  
  
    }
    }}
} catch (err) {
    console.error(err);
}
 
});

export default ExpiredProductRemover;




