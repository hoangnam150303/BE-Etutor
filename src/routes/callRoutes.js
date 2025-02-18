const express = require("express");
const callRoute = express.Router();
const auth = require("../middlewares/auth");
const callController = require("../controllers/callController");
callRoute.post("/makeCall/:id", auth.isAuth, callController.makePhoneCall);
callRoute.put("/acceptCall/:id", auth.isAuth, callController.acceptPhoneCall);

module.exports = callRoute;
