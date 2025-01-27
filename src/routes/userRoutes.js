const express = require("express");
const userRoute = express.Router();
const userController = require("../controllers/userController");
const passport = require("../passport");
const auth = require("../middlewares/auth");

userRoute.post("/register", userController.registerUser);
userRoute.post("/login", userController.loginLocal);
userRoute.post(
  "/loginGoogle",
  passport.authenticate('google-token', { session: false }),
  userController.loginGoogle
);
userRoute.post("/approveAccount", userController.approveAccount);
userRoute.get("/getUser", auth.isAuth, userController.getUser);

module.exports = userRoute;
