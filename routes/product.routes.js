const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const seoDescriptionController = require("../controllers/seoDescription.controller");

// routes definition
router.get("/", productController.getAllProducts);

router.get("/:id", productController.getProductById);

router.post("/", productController.createProduct);

router.put("/:id", productController.updateProduct);

router.get("/:id/seo-description", seoDescriptionController.getSeoDescription);
// router export
module.exports = router;
