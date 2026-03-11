const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({

fromUser:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

toUser:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

communication:Number,
skillQuality:Number,
helpfulness:Number,
overall:Number,

review:String,

createdAt:{
type:Date,
default:Date.now
}

});

module.exports = mongoose.model("Feedback",feedbackSchema);