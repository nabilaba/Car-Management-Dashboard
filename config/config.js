require("dotenv").config();

module.exports = {
  development: {
    username: "postgres",
    password: "nabilaba",
    database: "ch5_development",
    host: "localhost",
    dialect: "postgres",
    port: 8000,
  },
  test: {
    username: "postgres",
    password: "nabilaba",
    database: "ch5_test",
    host: "localhost",
    dialect: "postgres",
    port: 8000,
  },
  production: {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    dialect: "postgres",
    port: process.env.PGPORT,
  },
};
