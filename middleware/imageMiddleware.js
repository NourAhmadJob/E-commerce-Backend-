const multer = require("multer");

const ApiError = require("../utils/apiError");

exports.uploadSingleImage = (fileName) => {
  // // 1- DiskStorage engine
// // const multerStorage = multer.diskStorage({
// //   destination: function (req, file, cb) {
// //     cb(null, "uploads/category");
// //   },
// //   filename: function (req, file, cb) {
// //     // category-${id}-Date.now().jpeg
// //     const ext = file.mimetype.split("/")[1];
// //     const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
// //     cb(null, filename);
// //   },
// // });
  const multerStorage = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Please Uploads images not files", 400), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  return upload.single(fileName);
};
