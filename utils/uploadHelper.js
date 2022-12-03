const path = require("path");
const multer = require("multer");

const imageStorage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    return cb(new Error("Upload file berupa gambar!"));
  }
}

const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 1000000,
  },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single("image");

module.exports = imageUpload;
