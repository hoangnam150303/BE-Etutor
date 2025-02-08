const express = require("express");
const courseRoute = express.Router();
const auth = require("../middlewares/auth");
const courseController = require("../controllers/courseController");
const upload = require("../utils/multer");
courseRoute.post(
  "/createCourse",
  upload.single("image"),
  auth.isAdmin,
  courseController.createCourse
);
courseRoute.put(
  "/updateCourse/:id",
  upload.single("image"),
  auth.isAdmin,
  courseController.updateCourse
);
courseRoute.put(
  "/deleteCourse/:id",
  auth.isAdmin,
  courseController.activeOrDeactiveCourse
);

courseRoute.get("/getDetailCourse/:id", courseController.getDetailCourse);
courseRoute.get("/getAllCourse", courseController.getAllCourse);
module.exports = courseRoute;
