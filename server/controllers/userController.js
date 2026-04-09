const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ---------------- REGISTER ---------------- */
const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // ✅ validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const cleanEmail = email.trim().toLowerCase();

    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: cleanEmail,
      password: hashed,
      name: name || "User",
      isApproved: false
    });

    res.json({
      message: "Registered successfully. Wait for admin approval"
    });

  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message }); // ✅ fixed
  }
};
/* ---------------- LOGIN ---------------- */

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ ADD THIS
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.isApproved) {
      return res.status(403).json({
        message: "Your account is waiting for admin approval"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name || "User",
        role: user.role
      }
    });

  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login };
