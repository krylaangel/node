const express = require("express");
const router = express.Router();
const authenticateJWT = require("../routes/authMiddleware");
const { users } = require("../data/users");

router.get("/users", authenticateJWT, (req, res) => {
  res.json({ users });
});

router.get("/users/:id", authenticateJWT, (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user });
});

module.exports = router;
