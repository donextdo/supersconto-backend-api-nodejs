const express = require("express");

const router = express.Router();

let userController = require("../controllers/user-controller");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getOneUser);
router.patch("/:id/:pwd", userController.updateUserPassword);
router.patch("/:id", userController.updateUser);

module.exports = router;