require('dotenv').config();

module.exports = {
  development: {
    url: process.env.DEV_DB_URL,
    logging: false,
  },
  test: {
    url: process.env.DEV_DB_URL,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
  production: {
    url: process.env.DEV_DB_URL,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
