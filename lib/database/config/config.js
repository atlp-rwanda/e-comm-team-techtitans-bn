"use strict";

require('dotenv').config();
module.exports = {
  development: {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },
  test: {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },
  production: {
<<<<<<< HEAD
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
=======
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres'
    // dialectOptions: {
    //   ssl: {
    //     require: false,
    //     rejectUnauthorized: false,
    //   },
    // },
  },

  staging: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres'
    // dialectOptions: {
    //   ssl: {
    //     require: false,
    //     rejectUnauthorized: false,
    //   },
    // },
>>>>>>> e776560 (fix (2factor authentication))
  }
};