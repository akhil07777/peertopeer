const router = require("express").Router();

const Notification = require("../models/Notifications"); // ✅ FIXED name
const authMiddleware = require("../middleware/authMiddleware");


/* ---------------- GET USER NOTIFICATIONS ---------------- */

router.get("/", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user._id   // ✅ FIXED field
    }).sort({ createdAt: -1 });

    res.json(notifications);

  } catch (err) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
});


/* ---------------- MARK AS READ (OPTIONAL) ---------------- */

router.put("/read/:id", authMiddleware, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      isRead: true
    });

    res.json({ message: "Notification marked as read" });

  } catch (err) {
    res.status(500).json({ message: "Error updating notification" });
  }
});


/* ---------------- DELETE NOTIFICATION (OPTIONAL) ---------------- */

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);

    res.json({ message: "Notification deleted" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting notification" });
  }
});


module.exports = router;