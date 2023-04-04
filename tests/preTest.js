const db = require("../src/database/models");

const User = db.users;
const Product = db.products;
async function resetData() {
  await db.sequelize.query('TRUNCATE TABLE "Users", "Products" CASCADE;');
  await User.destroy({
    where: {},
    truncate: true,
  });
}
resetData();
