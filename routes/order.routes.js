const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller.js");

router.get("/", orderController.getAllOrders);

router.get("/user/:username", orderController.getOrdersByUsername);

router.get("/:id", orderController.getOrderById);

router.patch("/:id/status", orderController.updateOrderStatus);

router.get("/:id/status", orderController.getOrderStatus);

router.get("/status/:statust", orderController.getOrdersByStatus);

router.post("/", orderController.createOrder);

module.exports = router;
