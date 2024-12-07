const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const seoDescriptionController = require("../controllers/seoDescription.controller");
const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/auth.middleware");
const multer = require("multer");
// config multer for file managment
const upload = multer({ storage: multer.memoryStorage() });

// for all users
router.get("/", authenticateToken, productController.getAllProducts);

router.get("/:id", authenticateToken, productController.getProductById);

router.get(
  "/:id/seo-description",
  authenticateToken,
  seoDescriptionController.getSeoDescription
);

// only for workers
router.post(
  "/init",
  authenticateToken,
  authorizeRole(["WORKER"]),
  upload.single("file"),
  productController.initializeProducts
);

router.post(
  "/",
  authenticateToken,
  authorizeRole(["WORKER"]),
  productController.createProduct
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRole(["WORKER"]),
  productController.updateProduct
);

// router export
module.exports = router;
