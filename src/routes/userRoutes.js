const express = require("express");
const userRoute = express.Router();
const userController = require("../controllers/userController");
const passport = require("../passport");

userRoute.post("/register", userController.registerUser);
userRoute.post("/login", userController.loginLocal);
userRoute.post(
  "/loginGoogle",
  passport.authenticate('google-token', { session: false }),
  userController.loginGoogle
);
userRoute.put("/approveAccount", userController.approveAccount);
userRoute.get("/getUser", userController.getUser);

module.exports = userRoute;
