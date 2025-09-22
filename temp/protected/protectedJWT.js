const express = require("express");
const router = express.Router();
const authenticateJWT = require("../../routes/middleware/authMiddleware");
const User = require("../../models/User");
router.get("/users", authenticateJWT, async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/users/:id", authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
