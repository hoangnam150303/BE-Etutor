const express = require("express");
const classRoute = express.Router();
const auth = require("../middlewares/auth");
const classController = require("../controllers/classController");
const upload = require("../utils/multer");

classRoute.post(
  "/registClass/:studentId",
  auth.isAuth,
  classController.createClass
);

classRoute.put("/acceptClass", auth.isAdmin, classController.acceptClass);
classRoute.put("/updateClass/:id", auth.isAdmin, classController.updateClass);
classRoute.put("/finishClass/:id", auth.isAdmin, classController.finishClass);
classRoute.put(
  "/uploadFile/:classId",
  upload.fields([
    { name: "video", maxCount: 5 },
    { name: "document", maxCount: 5 },
  ]),
  auth.isAuth,
  classController.uploadFile
);
module.exports = classRoute;
