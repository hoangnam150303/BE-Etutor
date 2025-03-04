const express = require("express");
const classRoute = express.Router();
const auth = require("../middlewares/auth");
const classController = require("../controllers/classController");
const upload = require("../utils/multer");
classRoute.get("/getAllClass", auth.isAuth, classController.getAllClass);
classRoute.get(
  "/getClassByTutor",
  auth.isTutor,
  classController.getAllClassByTutor
);
classRoute.get(
  "/getClassByStudent",
  auth.isAuth,
  classController.getAllClassByStudent
);
classRoute.get("/getClassById/:id", auth.isAuth, classController.getClassById);

classRoute.post(
  "/registClass/:courseId",
  auth.isAuth,
  classController.createClass
);

classRoute.put(
  "/acceptClass/:classId/:tutorId",
  auth.isAdmin,
  classController.acceptClass
);
classRoute.put("/updateClass/:id", auth.isAdmin, classController.updateClass);
classRoute.put("/finishClass/:id", auth.isAdmin, classController.finishClass);
classRoute.put(
  "/uploadFile/:classId",
  upload.fields([
    { name: "video", maxCount: 5 },
    { name: "pdf", maxCount: 5 },
  ]),
  auth.isAuth,
  classController.uploadFile
);

module.exports = classRoute;
