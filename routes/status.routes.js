const express = require("express");
const router = express.Router();
const statusController = require("../controllers/status.controller.js");

// routes definition
router.get("/", statusController.getAllStatus);

// router export
module.exports = router;
