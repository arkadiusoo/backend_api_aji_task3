const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");

// routes definition
router.get("/", categoryController.getAllCategories);

// router export
module.exports = router;
