const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const dns = require("dns");

const notificationRoutes = require("./routes/notificationRoutes");
const feedbackRoutes = require("./routes/feedback");
const adminRoutes = require("./routes/adminRoutes");

// Optional DNS fix
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000", 
    "https://p2p-5qd2.onrender.com"   // change this to your frontend URL after deployment
  ],
  credentials: true
}));

app.use(express.json());

// Root route (used to check if backend is running)
app.get("/", (req, res) => {
  res.send("Backend API running 🚀");
});

// API Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/skills", require("./routes/skillRoutes"));
app.use("/api/requests", require("./routes/requestRoutes"));
app.use("/api/feedback", feedbackRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB Connected ✅");
})
.catch((error) => {
  console.log("Error in DB connection:", error);
});

// Server Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});