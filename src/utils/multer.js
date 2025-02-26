const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");
// Cấu hình lưu trữ trên Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ETutor",
    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "webp",
      "mp4",
      "docx",
      "PDF",
    ],
    resource_type: "auto",
  },
});

const upload = multer({
  storage,
});
module.exports = upload;
