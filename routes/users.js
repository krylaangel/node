const express = require("express");
const connectDB = require("../connect");
const { ObjectId } = require("mongodb");
const router = express.Router();

/* GET users listing. */
router.get("/", async (req, res) => {
  try {
    const db = await connectDB();
    const users = await db.collection("users").find().toArray();
    console.log("Users from DB:", users);

    res.render("users", { users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Помилка при отриманні користувачів");
  }
});
router.get("/:id", async (req, res, next) => {
  try {
    const db = await connectDB();
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!user) {
      return res.status(404).send("Користувач не знайдений");
    }

    res.render("user", { user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Помилка при отриманні користувача");
  }
});

module.exports = router;
