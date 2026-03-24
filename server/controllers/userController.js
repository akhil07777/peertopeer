const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ---------------- REGISTER ---------------- */

const register = async (req, res) => {
try {
const { email, password, name } = req.body;

```
const cleanEmail = email.trim().toLowerCase();

const hashed = await bcrypt.hash(password, 10);

const user = await User.create({
  email: cleanEmail,
  password: hashed,
  name: name || "User",          // ✅ FIX: store name
  isApproved: false
});

res.json({
  message: "Registered successfully. Wait for admin approval"
});
```

} catch (error) {
res.status(400).json({ error: error.message });
}
};

/* ---------------- LOGIN ---------------- */

const login = async (req, res) => {
try {
const { email, password } = req.body;


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
    _id: user._id,              // ✅ FIX: use _id (important)
    email: user.email,
    name: user.name || "User", // ✅ FIX: send name
    role: user.role
  }
});
} catch (error) {
res.status(500).json({ message: "Server error" });
}
};

module.exports = { register, login };
