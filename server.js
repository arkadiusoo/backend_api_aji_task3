const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const productRoutes = require("./routes/product.routes");
const categoryRoutes = require("./routes/category.routes");
const statusRoutes = require("./routes/status.routes");
const orderRoutes = require("./routes/order.routes");
const authRoutes = require("./routes/auth.routes");
const {
  authenticateToken,
  authorizeRole,
} = require("./middleware/auth.middleware");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the shop backend API!" });
});

// routes register
app.use("/products", authenticateToken, productRoutes);
app.use("/categories", authenticateToken, categoryRoutes);
app.use("/status", authenticateToken, authorizeRole(["WORKER"]), statusRoutes);
app.use("/orders", authenticateToken, orderRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
