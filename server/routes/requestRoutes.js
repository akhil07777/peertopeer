const router = require("express").Router();
const Request = require("../models/Request");
const Notification = require("../models/Notifications");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");


/* SEND REQUEST */

router.post("/send", authMiddleware, async (req, res) => {

try{

const {toUser,skill} = req.body;

const existing = await Request.findOne({
fromUser:req.user._id,
toUser:toUser,
skill:skill,
status:{$ne:"rejected"}
});

if(existing){
return res.json({message:"Request already sent"});
}

const newRequest = await Request.create({
fromUser:req.user._id,
toUser:toUser,
skill:skill,
status:"pending"
});

const sender = await User.findById(req.user._id);

await Notification.create({
user:toUser,
message:`${sender.name} sent you a request`
});

res.json(newRequest);

}catch(error){

console.log(error);
res.status(500).json({message:"Error sending request"});

}

});


/* INCOMING REQUEST COUNT */

router.get("/incoming-count", authMiddleware, async (req, res) => {

try{

const count = await Request.countDocuments({
toUser:req.user._id,
status:"pending"
});

res.json({count});

}catch(error){

res.status(500).json({message:"Error fetching count"});

}

});


/* ACCEPT REQUEST */

router.put("/accept/:id", authMiddleware, async (req, res) => {

try{

const request = await Request.findById(req.params.id);

if(!request){
return res.status(404).json({message:"Request not found"});
}

if(request.toUser.toString() !== req.user._id.toString()){
return res.status(403).json({message:"Not authorized"});
}

request.status = "accepted";
await request.save();

const accepter = await User.findById(req.user._id);

await Notification.create({
user:request.fromUser,
message:`${accepter.name} accepted your request`
});

res.json({message:"Request accepted"});

}catch(error){

console.log(error);
res.status(500).json({message:"Error accepting request"});

}

});


/* REJECT REQUEST */

router.put("/reject/:id", authMiddleware, async (req, res) => {

try{

const request = await Request.findById(req.params.id);

if(!request){
return res.status(404).json({message:"Request not found"});
}

if(request.toUser.toString() !== req.user._id.toString()){
return res.status(403).json({message:"Not authorized"});
}

request.status = "rejected";
await request.save();

const rejecter = await User.findById(req.user._id);

await Notification.create({
user:request.fromUser,
message:`${rejecter.name} rejected your request`
});

res.json({message:"Request rejected"});

}catch(error){

console.log(error);
res.status(500).json({message:"Error rejecting request"});

}

});


/* CANCEL REQUEST */

router.delete("/cancel/:id", authMiddleware, async (req,res)=>{

try{

const request = await Request.findById(req.params.id);

if(!request){
return res.status(404).json({message:"Request not found"});
}

if(request.fromUser.toString() !== req.user._id.toString()){
return res.status(403).json({message:"Not authorized"});
}

if(request.status !== "pending"){
return res.status(400).json({message:"Cannot cancel this request"});
}

await request.deleteOne();

res.json({message:"Request cancelled"});

}catch(error){

res.status(500).json({message:"Error cancelling request"});

}

});


/* DELETE REJECTED REQUEST */

router.delete("/delete/:id", authMiddleware, async (req,res)=>{

try{

const request = await Request.findById(req.params.id);

if(!request){
return res.status(404).json({message:"Request not found"});
}

if(request.fromUser.toString() !== req.user._id.toString()){
return res.status(403).json({message:"Not authorized"});
}

if(request.status !== "rejected"){
return res.status(400).json({message:"Only rejected requests can be deleted"});
}

await request.deleteOne();

res.json({message:"Request deleted"});

}catch(error){

res.status(500).json({message:"Error deleting request"});

}

});


/* CONNECTIONS */

router.get("/connections", authMiddleware, async (req,res)=>{

try{

const connections = await Request.find({
status:"accepted",
$or:[
{fromUser:req.user._id},
{toUser:req.user._id}
]
})
.populate("fromUser","name skillsOffered skillsWanted bio")
.populate("toUser","name skillsOffered skillsWanted bio");

res.json(connections);

}catch(error){

res.status(500).json({message:"Error fetching connections"});

}

});


/* GET USER REQUESTS */

router.get("/all", authMiddleware, async (req, res) => {

try{

const incoming = await Request.find({
toUser:req.user._id,
status:"pending"
}).populate(
"fromUser",
"name skillsOffered skillsWanted bio"
);

const outgoing = await Request.find({
fromUser:req.user._id
}).populate(
"toUser",
"name skillsOffered skillsWanted bio"
);

res.json({
incoming,
outgoing
});

}catch(error){

console.log("Request fetch error:",error);

res.status(500).json({
message:"Error fetching requests"
});

}

});


/* REMOVE CONNECTION */

router.delete("/remove/:id",authMiddleware,async(req,res)=>{

try{

const request = await Request.findById(req.params.id);

if(!request){
return res.status(404).json({message:"Not found"});
}

if(
request.fromUser.toString()!==req.user._id.toString() &&
request.toUser.toString()!==req.user._id.toString()
){
return res.status(403).json({message:"Not allowed"});
}

await Request.findByIdAndDelete(req.params.id);

res.json({message:"Connection removed"});

}catch(error){

res.status(500).json({message:"Error removing connection"});

}

});


/* ADMIN GET ALL REQUESTS */

router.get("/requests", async (req,res)=>{

try{

const requests = await Request.find();
res.json(requests);

}catch(err){
res.status(500).json({message:"Error"});
}

});


module.exports = router;