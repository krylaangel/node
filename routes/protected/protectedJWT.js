const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middleware/authMiddleware");
const { users } = require("../../data/users");
const connectDB = require("../../connect");
const { ObjectId } = require("mongodb");

router.get("/users", authenticateJWT, async (req, res) => {
  try {
    const db = await connectDB();
    const users = await db.collection("users").find().toArray();
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/users/:id", authenticateJWT, async (req, res) => {
  try {
    const db = await connectDB();
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
