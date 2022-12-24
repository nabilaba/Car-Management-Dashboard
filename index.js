const express = require("express");
const app = express();
const db = require("./models");
const carsRoute = require("./routes/cars.routes");
const { seedingCars } = require("./utils/seeding");
const cors = require("cors");
const port = process.env.PORT || 8000;

db.sequelize.sync().then(() => {
  seedingCars(db.sequelize);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/", express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use("/cars", carsRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
