const router = require("express").Router();
const User = require("../models/User");

router.post("/add", async (req, res) => {
    try {
        const { userId, skill } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.skillsOffered.push(skill);
        await user.save();

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;