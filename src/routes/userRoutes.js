const express = require("express");
const userRoute = express.Router();
const userController = require("../controllers/userController");
const passport = require("../passport");
const auth = require("../middlewares/auth");
const upload = require("../utils/multer");

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
  upload.single("image"),
  auth.isAdmin,
  userController.createTutorAccount
);
userRoute.get("/getUser", auth.isAuth, userController.getUser);
userRoute.get("/getAllUser", auth.isAuth, userController.getAllUser);
module.exports = userRoute;
