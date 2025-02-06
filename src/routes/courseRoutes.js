const express = require("express");
const courseRoute = express.Router();
const auth = require("../middlewares/auth");
const courseController = require("../controllers/courseController");

courseRoute.post("/createCourse", auth.isAdmin, courseController.createCourse);
courseRoute.put(
  "/updateCourse/:id",
  auth.isAdmin,
  courseController.updateCourse
);
courseRoute.delete(
  "/deleteCourse/:id",
  auth.isAdmin,
  courseController.deleteCourse
);
courseRoute.get("/getAllCourse", courseController.getAllCourse);
courseRoute.get("/getDetailCourse/:id", courseController.getDetailCourse);
module.exports = courseRoute;
