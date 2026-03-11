const router = require("express").Router();
const { register, login } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

/* ------------------ AUTH ROUTES ------------------ */
router.post("/register", register);
router.post("/login", login);

/* ------------------ GET LOGGED-IN USER ------------------ */
router.get("/me", authMiddleware, async (req, res) => {
  res.json(req.user);
});

/* ------------------ UPDATE PROFILE ------------------ */
router.put("/update-profile", authMiddleware, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: req.body.name,
        skillsOffered: req.body.skillsOffered,
        skillsWanted: req.body.skillsWanted,
        hobbies: req.body.hobbies,
        bio: req.body.bio
      },
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
});

module.exports = router;

/* ---------------- SEARCH USERS BY SKILL ---------------- */

router.get("/search", authMiddleware, async (req, res) => {

  try {

    const skill = req.query.skill;

    if (!skill) {
      return res.json([]);
    }

    const Request = require("../models/Request");

    /* FIND USERS ALREADY CONNECTED OR REQUESTED */

    const relations = await Request.find({
      $or: [
        { fromUser: req.user._id },
        { toUser: req.user._id }
      ]
    });

    const excludedUsers = relations.map(r =>
      r.fromUser.toString() === req.user._id.toString()
        ? r.toUser
        : r.fromUser
    );

    /* SPLIT SEARCH SKILLS */

    const searchSkills = skill
      .toLowerCase()
      .split(",")
      .map(s => s.trim());

    const regexPattern = searchSkills.join("|");

    /* SEARCH USERS */

    const users = await User.find({
      skillsOffered: {
        $regex: regexPattern,
        $options: "i"
      },
      _id: {
        $nin: [req.user._id, ...excludedUsers]
      }
    }).select("-password");

    res.json(users);

  } catch (error) {

    console.log("Search error:", error);
    res.status(500).json({ message: "Search failed" });

  }

});