const bcrypt = require("bcrypt");
const db = require("../models");
const User = db.users;

// Funkcja do tworzenia użytkowników
exports.createUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
      role: "CLIENT",
    });

    return res.status(201).json({
      message: "User created successfully.",
    });
  } catch (error) {
    console.error("Error creating user:", error.message);
    return res
      .status(500)
      .json({ message: "An error occurred while creating the user." });
  }
};
