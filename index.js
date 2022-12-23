const express = require("express");
const app = express();
const db = require("./models");
const carsRoute = require("./routes/cars.routes");
const { seedingCars } = require("./utils/seeding");
const cors = require("cors");
const config = require("./config/config")[process.env.NODE_ENV || "development"];

db.sequelize.sync();

seedingCars(db.sequelize);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/", express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use("/cars", carsRoute);

app.listen(config.port, () => {
  console.log(`Server running at ${config.host}:${config.port}`);
});
