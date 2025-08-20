const { users } = require("../data/users");
const passport = require("../public/javascript/passport");
const router = require("express").Router();
const bcrypt = require("bcrypt");

router.get("/login", (req, res) => {
  res.render("auth_passport/login");
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({
        message: "Login successful",
        user: { id: user.id, name: user.name },
      });
    });
  })(req, res, next);
});

router.get("/register", (req, res) => {
  res.render("auth_passport/register");
});

router.post("/register", async (req, res) => {
  const { name, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  users.push({ id: users.length + 1, name, password: hashed });
  res.redirect("/auth_passport/login");
});
router.post("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/auth_passport/login");
  });
});

module.exports = router;
