const db = require("../models");
const Order = db.orders;
const Opinion = db.opinions;

exports.addOpinion = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, content } = req.body;
    const username = req.user.username;

    if (!rating || rating < 1 || rating > 5 || !content) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5, and content is required.",
      });
    }

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    if (order.username !== username) {
      return res
        .status(403)
        .json({ message: "You are not authorized to review this order." });
    }

    if (!["CONFIRMED", "CANCELLED"].includes(order.status)) {
      return res.status(400).json({
        message:
          "You can only add opinions for orders that are completed or cancelled.",
      });
    }

    const opinion = await Opinion.create({
      order_id: id,
      rating,
      content,
    });

    res.status(201).json({ message: "Opinion added successfully.", opinion });
  } catch (error) {
    console.error("Error adding opinion:", error.message);
    res
      .status(500)
      .json({ message: "Error adding opinion.", error: error.message });
  }
};
