const cars = require("../models").cars;

exports.getCars = (req, res) => {
  cars
    .findAll()
    .then((cars) => {
      res.status(200).json(cars);
    })
    .catch((err) => {
      res.status(500).json("Internal Server Error");
    });
};

exports.getDetailCar = (req, res) => {
  const id = req.params.id;

  cars
    .findByPk(id)
    .then((car) => {
      if (car) {
        res.status(200).json(car);
      } else {
        res.status(404).json({ message: "Data tidak ditemukan!" });
      }
    })
    .catch((err) => {
      res.status(500).json("Internal Server Error");
    });
};

exports.createCar = (req, res) => {
  const { name, rent_price, size, image_url } = req.body;

  if (!name || !rent_price || !size || !image_url) {
    return res.status(400).json({ message: "Lengkapi semua kolom terlebih dahulu!" });
  } else {
    if (
      typeof name !== "string" ||
      typeof rent_price !== "number" ||
      typeof size !== "string" ||
      typeof image_url !== "string"
    ) {
      console.log(`typeof name: ${typeof name}`);
      console.log(`typeof rent_price: ${typeof rent_price}`);
      console.log(`typeof size: ${typeof size}`);
      console.log(`typeof image_url: ${typeof image_url}`);
      return res.status(400).json({ message: "Tipe data pada kolom tidak sesuai!" });
    } else {
      cars
        .create({
          name,
          rent_price,
          size,
          image_url,
        })
        .then((car) => {
          res.status(201).json(car);
        })
        .catch((err) => {
          res.status(500).json("Internal Server Error");
        });
    }
  }
};

exports.updateCar = (req, res) => {
  const id = req.params.id;
  const { name, rent_price, size, image_url } = req.body;

  cars.findByPk(id).then((car) => {
    if (!car) {
      res.status(404).json("Data tidak ditemukan");
    } else {
      car
        .update({ name, rent_price, size, image_url })
        .then((car) => {
          res.status(200).json(car);
        })
        .catch((err) => {
          res.status(500).json("Internal Server Error");
        });
    }
  });
};

exports.deleteCar = (req, res) => {
  const id = req.params.id;

  cars.findByPk(id).then((car) => {
    if (!car) {
      res.status(404).json("Data tidak ditemukan");
    } else {
      car
        .destroy()
        .then(() => {
          res.status(200).json("Data berhasil dihapus");
        })
        .catch((err) => {
          res.status(500).json("Internal Server Error");
        });
    }
  });
};

exports.deleteAllCars = (req, res) => {
  cars
    .destroy({ where: {} })
    .then(() => {
      res.status(200).json("Semua Data berhasil dihapus");
    })
    .catch((err) => {
      res.status(500).json("Internal Server Error");
    });
};
