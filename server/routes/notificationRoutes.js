const router = require("express").Router();
const Notification = require("../models/Notifications");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/",authMiddleware,async(req,res)=>{

const notifications = await Notification.find({
user:req.user._id
}).sort({createdAt:-1});

res.json(notifications);

});

module.exports = router;