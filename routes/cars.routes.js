const router = require("express").Router();
const {
  getCars,
  getDetailCar,
  createCar,
  updateCar,
  deleteCar,
  deleteAllCars,
} = require("./../controllers/cars.controller");
const { uploadThumbnail } = require("./../controllers/upload.controller");

router.get("/", getCars);
router.get("/:id", getDetailCar);
router.post("/", createCar);
router.put("/:id", updateCar);
router.delete("/:id", deleteCar);
router.delete("/", deleteAllCars);

router.post("/upload", uploadThumbnail);

module.exports = router;
