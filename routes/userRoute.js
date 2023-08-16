const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const route = express.Router();

route
  .post("/signup", authController.signUp)
  .post("/login", authController.login);

route
  .route(`/`)
  .get(userController.getAllUsers)
  .post(userController.createUser);
route
  .route(`/:id`)
  .get(userController.getUserById)
  .delete(authController.restrictTo("admin"), userController.deleteUser);

module.exports = route;
