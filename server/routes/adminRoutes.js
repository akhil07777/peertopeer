const router = require("express").Router();

const User = require("../models/User");
const Feedback = require("../models/Feedback");
const Request = require("../models/Request");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");


/* ADMIN STATS */

router.get("/stats", authMiddleware, adminMiddleware, async (req,res)=>{

try{

const users = await User.countDocuments();
const feedbacks = await Feedback.countDocuments();
const requests = await Request.countDocuments();

res.json({
users,
feedbacks,
requests
});

}catch(err){

res.status(500).json({message:"Error fetching stats"});

}

});


/* GET USERS */

router.get("/users", authMiddleware, adminMiddleware, async (req,res)=>{

try{

const users = await User.find().select("-password");

res.json(users);

}catch(err){

res.status(500).json({message:"Error fetching users"});

}

});


/* DELETE USER */

router.delete("/users/:id", authMiddleware, adminMiddleware, async (req,res)=>{

try{

await User.findByIdAndDelete(req.params.id);

res.json({message:"User deleted"});

}catch(err){

res.status(500).json({message:"Error deleting user"});

}

});


/* GET FEEDBACK */

router.get("/feedbacks", authMiddleware, adminMiddleware, async (req,res)=>{

try{

const feedbacks = await Feedback.find()
.populate("fromUser","name")
.populate("toUser","name");

res.json(feedbacks);

}catch(err){

res.status(500).json({message:"Error fetching feedback"});

}

});


/* DELETE FEEDBACK */

router.delete("/feedback/:id", authMiddleware, adminMiddleware, async (req,res)=>{

try{

await Feedback.findByIdAndDelete(req.params.id);

res.json({message:"Feedback deleted"});

}catch(err){

res.status(500).json({message:"Error deleting feedback"});

}

});

module.exports = router;