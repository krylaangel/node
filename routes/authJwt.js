const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { users } = require("../data/users");

const secretKey = "mySecretKey";

router.get("/login", (req, res) => {
  res.render("auth_jwt/login");
});
router.post("/login", (req, res) => {
  const { name } = req.body;

  const user = users.find((u) => u.name === name);

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  const token = jwt.sign({ userId: user.id, name: user.name }, secretKey, {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000, // 1 час
    path: "/",
  });

  res.json({ message: "Logged in successfully" });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
