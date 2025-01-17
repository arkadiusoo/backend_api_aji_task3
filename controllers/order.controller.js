const db = require("../models");
const { sequelize } = require("../models");
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
    const { username } = req.params;

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

    const validStatuses = await Status.findAll({
      attributes: ["name"],
    });
    const validStatusNames = validStatuses.map((status) => status.name);

    if (!validStatusNames.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed statuses: ${validStatusNames.join(
          ", "
        )}`,
      });
    }

    if (
      order.status === "COMPLETED" ||
      (order.status === "CONFIRMED" && status === "UNCONFIRMED") ||
      (order.status === "UNCONFIRMED" && status === "COMPLETED")
    ) {
      return res.status(400).json({
        message: `Cannot change the status from ${order.status} to ${status}.`,
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
    const { statust } = req.params;

    // Sprawdź, czy status1 został przesłany i jest stringiem
    if (!statust || typeof statust !== "string") {
      return res
        .status(400)
        .json({ message: 'Invalid or missing "status" parameter.' });
    }

    // Konwersja na wielkie litery
    const status = statust.toUpperCase();

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
      if (!item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          message: "Each product must have a quantity greater than zero.",
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

exports.getAllProductsFromOrders = async (req, res) => {
  try {
    const products = await sequelize.query(
      `
      SELECT 
        p.name, 
        p.description, 
        op.quantity, 
        p.price_unit, 
        p.id, 
        p.weight_unit,
        op.order_id
      FROM 
        order_product as op
      JOIN 
        products as p 
      ON 
        op.product_id = p.id
      `,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found." });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({
      message: "Error fetching products.",
      error: error.message,
    });
  }
};
