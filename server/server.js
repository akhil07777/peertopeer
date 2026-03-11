const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const dns = require("dns");

const notificationRoutes = require("./routes/notificationRoutes");
const feedbackRoutes = require("./routes/feedback");
const adminRoutes = require("./routes/adminRoutes");

// Change DNS
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/skills", require("./routes/skillRoutes"));
app.use("/api/requests", require("./routes/requestRoutes"));
app.use("/api/feedback", feedbackRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

// MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
console.log("MongoDB Connected ✅");
})
.catch((error)=>{
console.log("Error in DB connection:",error);
});

// Server
app.listen(5000,()=>{
console.log("Server running on port 5000 🚀");
});