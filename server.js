const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./models");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Proste endpointy testowe
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the shop backend API!" });
});

// Pobranie wszystkich kategorii
app.get("/test", async (req, res) => {
  try {
    const test = await db.statuses.findAll(); // Pobiera wszystkie rekordy z tabeli `categories`
    res.status(200).json(test); // Zwraca kategorie w formacie JSON
  } catch (error) {
    res.status(500).json({
      message: "Wystąpił błąd podczas pobierania kategorii.",
      error: error.message,
    });
  }
});

// Uruchom serwer
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
