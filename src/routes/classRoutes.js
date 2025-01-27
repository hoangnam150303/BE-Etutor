const express = require("express");
const classRoute = express.Router();
const auth = require("../middlewares/auth");
const classController = require("../controllers/classController");

classRoute.post(
  "/registClass/:studentId",
  auth.isAuth,
  classController.createClass
);

classRoute.put("/acceptClass", auth.isAdmin, classController.acceptClass);

module.exports = classRoute;
