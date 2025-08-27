const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("./passportMiddleware");

router.get("/", ensureAuthenticated, (req, res) => {
  res.send("Protected Passport page");
});

module.exports = router;
