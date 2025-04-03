const express = require("express");
const userRoute = express.Router();
const userController = require("../controllers/userController");
const passport = require("../passport");
const auth = require("../middlewares/auth");
const upload = require("../utils/multer");

userRoute.get("/getUser", auth.isAuth, userController.getUser);
userRoute.post("/register", userController.registerUser);
userRoute.post("/login", userController.loginLocal);
userRoute.post(
  "/loginGoogle",
  passport.authenticate("google-token", { session: false }),
  userController.loginGoogle
);
userRoute.post("/approveAccount", userController.approveAccount);
userRoute.post(
  "/createTutor",
  upload.single("avatar"),
  auth.isAdmin,
  userController.createTutorAccount
);
userRoute.put(
  "/updateStatusUser/:id",
  auth.isAdmin,
  userController.activeOrDeactiveUser
);
userRoute.put(
  "/updateProfile",
  upload.single("avatar"),
  auth.isAuth,
  userController.updateUser
);

userRoute.get("/getAllUser", userController.getAllUser);
userRoute.get("/getUserById/:id", auth.isAuth, userController.getUserById);
userRoute.post("/forgotPassword", userController.forgotPassword);
userRoute.put("/resetPassword", userController.updatePassword);
userRoute.get("/getAllStudent",auth.isTutor,userController.getAllStudentByTutor);
userRoute.get("/getAllTutor",auth.isAuth,userController.getAllTutorByStudent);
module.exports = userRoute;
