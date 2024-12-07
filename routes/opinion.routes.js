const express = require("express");
const router = express.Router();
const opinionController = require("../controllers/opinion.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

router.post(
  "/orders/:id/opinions",
  authenticateToken,
  opinionController.addOpinion
);

module.exports = router;
