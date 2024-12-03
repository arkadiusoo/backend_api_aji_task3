const db = require("../models");
const Order = db.orders;
const Product = db.products;
const OrderProduct = db.orderProduct;
const Status = db.statuses;

// get order list
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching orders.",
      error: error.message,
    });
  }
};

// get order by username
exports.getOrdersByUsername = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({
        message: "Field username is required in query parameters.",
      });
    }

    const orders = await Order.findAll({
      where: { username },
    });

    if (orders.length === 0) {
      return res.status(404).json({
        message: "No orders found for the specified username.",
      });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching orders.",
      error: error.message,
    });
  }
};

// get order by id
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching order.",
      error: error.message,
    });
  }
};
// get order status by id
exports.getOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json(order.status);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching order.",
      error: error.message,
    });
  }
};
// changing order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // validation
    if (order.status === "CANCELLED") {
      return res.status(400).json({
        message: "Cannot change the status of a cancelled order.",
      });
    }

    const validStatuses = [
      "UNCONFIRMED",
      "CONFIRMED",
      "CANCELLED",
      "COMPLETED",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed statuses: ${validStatuses.join(
          ", "
        )}`,
      });
    }

    if (
      (order.status === "COMPLETED" && status !== "CANCELLED") ||
      (order.status === "CONFIRMED" && status === "UNCONFIRMED")
    ) {
      return res.status(400).json({
        message: `Cannot change the status from "${order.status}" to "${status}".`,
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      message: "Error updating order status.",
      error: error.message,
    });
  }
};

// adding new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price_unit, weight_unit, category } = req.body;

    // validation input data
    if (
      !name ||
      !category ||
      price_unit === undefined ||
      weight_unit === undefined
    ) {
      return res.status(400).json({
        message:
          "Fields name, price_unit, weight_unit, and category are required.",
      });
    }

    if (price_unit <= 0) {
      return res.status(400).json({
        message: "price_unit must be greater than zero.",
      });
    }
    if (weight_unit <= 0) {
      return res.status(400).json({
        message: "weight_unit must be greater than zero.",
      });
    }

    const newProduct = await Product.create({
      name,
      description: description || "",
      price_unit,
      weight_unit,
      category,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({
      message: "Error creating product.",
      error: error.message,
    });
  }
};
// show by status
exports.getOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.query;

    if (!status) {
      return res.status(400).json({
        message: 'Field "status" is required in query parameters.',
      });
    }

    const orders = await Order.findAll({
      where: { status },
    });

    if (orders.length === 0) {
      return res.status(404).json({
        message: `No orders found with status "${status}".`,
      });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching orders by status.",
      error: error.message,
    });
  }
};

// creating order
exports.createOrder = async (req, res) => {
  try {
    const { username, email, phone_number, status, products } = req.body;

    if (!username || !email || !phone_number) {
      return res.status(400).json({
        message: "Fields username, email, and phone_number are required.",
      });
    }

    if (!/^\d+$/.test(phone_number)) {
      return res.status(400).json({
        message: "Field phone_number must contain only digits.",
      });
    }

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        message: "Field products must be a non-empty array.",
      });
    }

    for (const item of products) {
      if (!item.product_id || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          message:
            "Each product must have a valid product_id and quantity greater than zero.",
        });
      }

      const product = await Product.findByPk(item.product_id);
      if (!product) {
        return res.status(404).json({
          message: `Product with ID ${item.product_id} does not exist.`,
        });
      }
    }

    const newOrder = await Order.create({
      username,
      email,
      phone_number,
      status: status || "UNCONFIRMED",
      approval_date: null,
    });

    for (const item of products) {
      await OrderProduct.create({
        order_id: newOrder.id,
        product_id: item.product_id,
        quantity: item.quantity,
      });
    }

    res.status(201).json({
      message: "Order created successfully.",
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating order.",
      error: error.message,
    });
  }
};
