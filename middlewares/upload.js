const multer = require("multer");
const path = require("path");
const timeDir = path.join(__dirname, "../", "tmp");
const multerConfig = multer.diskStorage({
  destination: timeDir,
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});
const upload = multer({ storage: multerConfig });
module.exports = upload;
