const router = require("express").Router();
const Feedback = require("../models/Feedback");
const authMiddleware = require("../middleware/authMiddleware");


/* ADD FEEDBACK */

router.post("/add", authMiddleware, async (req,res)=>{

try{

const feedback = new Feedback({

fromUser:req.user._id,
toUser:req.body.toUser,

communication:req.body.communication,
skillQuality:req.body.skillQuality,
helpfulness:req.body.helpfulness,
overall:req.body.overall,

review:req.body.review

});

await feedback.save();

res.json({message:"Feedback saved"});

}catch(err){

console.log(err);
res.status(500).json({message:"Error saving feedback"});

}

});


/* ⭐ USED BY SEARCH PAGE (NO CHANGE) */

router.get("/rating/:userId", async (req,res)=>{

try{

const userId = req.params.userId;

const feedbacks = await Feedback.find({toUser:userId});

if(feedbacks.length === 0){

return res.json({
average:0,
count:0
});

}

const total = feedbacks.reduce((sum,f)=> sum + f.overall ,0);

const avg = total / feedbacks.length;

res.json({
average:Number(avg.toFixed(1)),
count:feedbacks.length
});

}catch(error){

console.log(error);

res.status(500).json({
message:"Error calculating rating"
});

}

});


/* ⭐ NEW ROUTE → PROFILE RATING BREAKDOWN */

router.get("/details/:userId", async (req,res)=>{

try{

const userId = req.params.userId;

const feedbacks = await Feedback.find({toUser:userId});

if(feedbacks.length === 0){

return res.json({
communication:0,
skillQuality:0,
helpfulness:0,
overall:0,
count:0
});

}

let communication=0;
let skillQuality=0;
let helpfulness=0;
let overall=0;

feedbacks.forEach(f=>{

communication += f.communication;
skillQuality += f.skillQuality;
helpfulness += f.helpfulness;
overall += f.overall;

});

const count = feedbacks.length;

res.json({

communication:(communication/count).toFixed(1),
skillQuality:(skillQuality/count).toFixed(1),
helpfulness:(helpfulness/count).toFixed(1),
overall:(overall/count).toFixed(1),
count:count

});

}catch(error){

console.log(error);

res.status(500).json({
message:"Error calculating detailed rating"
});

}

});


/* GET FEEDBACK BETWEEN TWO USERS */

router.get("/existing/:userId", authMiddleware, async (req,res)=>{

try{

const feedback = await Feedback.findOne({
fromUser:req.user._id,
toUser:req.params.userId
});

if(!feedback){
return res.json(null);
}

res.json(feedback);

}catch(error){

console.log(error);
res.status(500).json({message:"Error fetching feedback"});

}

});


module.exports = router;