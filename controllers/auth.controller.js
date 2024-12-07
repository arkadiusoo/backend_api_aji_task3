const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = db.users;

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: "Login failed.", error: error.message });
  }
};
