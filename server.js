const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const productRoutes = require("./routes/product.routes.js");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Prosty endpoint testowy
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the shop backend API!" });
});

// Rejestrowanie tras
app.use("/products", productRoutes); // Trasy dla produktów

// Uruchamianie serwera
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
