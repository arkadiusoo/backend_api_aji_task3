const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller.js");
const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/auth.middleware");

// only for workers
router.get(
  "/",
  authenticateToken,
  authorizeRole(["WORKER"]),
  orderController.getAllOrders
);

router.get(
  "/user/:username",
  authenticateToken,
  authorizeRole(["WORKER"]),
  orderController.getOrdersByUsername
);

router.get(
  "/:id",
  authenticateToken,
  authorizeRole(["WORKER"]),
  orderController.getOrderById
);

router.patch(
  "/:id/status",
  authenticateToken,
  authorizeRole(["WORKER"]),
  orderController.updateOrderStatus
);

router.get(
  "/:id/status",
  authenticateToken,
  authorizeRole(["WORKER"]),
  orderController.getOrderStatus
);

router.get(
  "/status/:statust",
  authenticateToken,
  authorizeRole(["WORKER"]),
  orderController.getOrdersByStatus
);

// only for clients
router.post(
  "/",
  authenticateToken,
  authorizeRole(["CLIENT"]),
  orderController.createOrder
);

module.exports = router;
