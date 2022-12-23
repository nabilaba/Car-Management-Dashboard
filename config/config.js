require("dotenv").config();

module.exports = {
  development: {
    username: "postgres",
    password: "nabilaba",
    database: "ch5_development",
    host: "localhost",
    dialect: "postgres",
  },
  test: {
    username: "postgres",
    password: "nabilaba",
    database: "ch5_test",
    host: "localhost",
    dialect: "postgres",
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
  },
};
