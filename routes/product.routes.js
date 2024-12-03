const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");

// Definicja tras
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

// Eksport routera
module.exports = router;
