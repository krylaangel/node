const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { hash } = require("bcrypt");

/* GET users listing. */
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    console.log("Users from DB:", users);

    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Помилка при отриманні користувачів");
  }
});
router.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("Користувач не знайдений");
    }

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Помилка при отриманні користувача");
  }
});
router.post("/", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: "Email вже зареєстрований" });
    }
    const hashedPassword = await hash(req.body.password, 10);

    const newUser = User.create({
      name: req.body.name,
      email: req.body.email,
      age: req.body.age,
      hobbies: req.body.hobbies || [],
      password: hashedPassword,
      role: "user",
    });
    const user = await newUser.save();
    res.json({ message: "Користувач створений успішно", id: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});
module.exports = router;
