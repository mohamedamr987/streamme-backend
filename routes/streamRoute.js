const express = require("express");
const streamController = require("../controllers/streamController");
const authController = require("../controllers/authController");

const route = express.Router();
route.use(authController.protectWithToken);

route.get("/", streamController.getAllStreams);

route.post("/create", streamController.createStream);
route.post("/join", streamController.joinStream);
route.delete("/delete", streamController.deleteStream);

module.exports = route;
