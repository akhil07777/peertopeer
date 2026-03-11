const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({

  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  skill: {
    type: String
  },

  status: {
    type: String,
    default: "pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("Request", requestSchema);