const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller.js");

// routes definition
router.post("/create", userController.createUser);

// router export
module.exports = router;
