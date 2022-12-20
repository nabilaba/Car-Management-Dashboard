const express = require("express");
const app = express();
const db = require("./models");
const port = 8000;
const carsRoute = require("./routes/cars.routes");
const { seedingCars } = require("./utils/seeding");
const cors = require("cors");

db.sequelize.sync();

seedingCars(db.sequelize);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/", express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use("/cars", carsRoute);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
