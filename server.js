const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./models");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Synchronizacja z bazą danych
db.sequelize
  .sync()
  .then(() => {
    console.log("Synced database.");
  })
  .catch((err) => {
    console.error("Failed to sync database: " + err.message);
  });

// Proste endpointy testowe
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the shop backend API!" });
});

// Podłącz trasy
require("./routes/category.routes")(app);
require("./routes/product.routes")(app);
require("./routes/order.routes")(app);
require("./routes/status.routes")(app);

// Uruchom serwer
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
