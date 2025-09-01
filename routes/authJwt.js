const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const connectDB = require("../connect");
const bcrypt = require("bcrypt");
const authenticateJWT = require("./middleware/authMiddleware");

const secretKey = process.env.JWT_SECRET;

router.get("/login", (req, res) => {
  res.render("auth_jwt/login");
});

router.post("/login", async (req, res) => {
  try {
    const db = await connectDB();
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, name: user.name },
      secretKey,
      {
        expiresIn: "1h",
      },
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000, // 1 час
    });
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login error", error: err.message });
  }
});

router.post("/api_login", async (req, res) => {
  try {
    const db = await connectDB();
    const { email, password } = req.body;
    const user = await db.collection("users").findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        name: user.name,
      },
      secretKey,
      { expiresIn: "1h" },
    );
    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Login error", error: err.message });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.redirect("/");
});
router.get("/register", (req, res) => {
  res.render("auth_jwt/register");
});
router.post("/register", async (req, res) => {
  try {
    const db = await connectDB();
    const { name, email, password, age, hobbies } = req.body;
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      name,
      email,
      password: hashedPassword,
      age,
      hobbies: hobbies || [],
      role: "user",
    };

    const user = await db.collection("users").insertOne(newUser);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration error", error: err.message });
  }
});

module.exports = router;
