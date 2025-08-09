const express = require("express");
const { users } = require("../data/users");
const router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("users", { users });
});
router.get("/:id", function (req, res, next) {
  const user = users.find((u) => u.id === parseInt(req.params.id));

  if (!user) {
    return res.status(404).send("Користувач не знайдений");
  }

  res.render("user", { user });
});

module.exports = router;
