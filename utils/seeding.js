const fs = require("fs");

exports.seedingCars = async (sequelize) => {
  const seedQuery = fs.readFileSync(`seeds/cars.sql`, { encoding: "utf8" });
  sequelize
    .query(seedQuery)
    .then((data) => {
      console.log("Seeding tabel cars berhasil");
    })
    .catch((err) => {
      console.log(err);
    });
};
