const express = require("express");
const router = express.Router();
const authenticateJWT = require("./middleware/authMiddleware");

router.get("/", authenticateJWT, (req, res) => {
  res.render("dashboard", { user: req.user });
});

module.exports = router;
