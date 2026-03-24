const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  email: { 
    type: String, 
    unique: true 
  },

  password: String,

  name: { 
    type: String, 
    default: "" 
  },

  skillsOffered: { 
    type: String, 
    default: "" 
  },

  skillsWanted: { 
    type: String, 
    default: "" 
  },

  hobbies: { 
    type: String, 
    default: "" 
  },

  bio: { 
    type: String, 
    default: "" 
  },

  // ✅ NEW FIELD (IMPORTANT)
  isApproved: {
    type: Boolean,
    default: false
  },

  // ADMIN ROLE
  role: {
    type: String,
    enum: ["user","admin"],
    default: "user"
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);