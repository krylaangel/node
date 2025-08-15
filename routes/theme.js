const express = require("express");
const router = express.Router();

router.get("/get-theme", (req, res) => {
  const theme = req.cookies.siteTheme || "light";
  res.json({ theme });
});

router.post("/set-theme", (req, res) => {
  const { theme } = req.body;

  if (!theme) {
    return res.status(400).json({ message: "Theme is required" });
  }

  res.cookie("siteTheme", theme, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    path: "/",
  });

  res.json({ message: `Theme set to ${theme}` });
});

module.exports = router;
