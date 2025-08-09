const express = require("express");
const { articles } = require("../data/articles");
const router = express.Router();
router.get("/", (req, res) => {
  res.render("ejs/articles.ejs", { articles });
});
router.get("/:id", (req, res) => {
  const article = articles.find((a) => a.id === parseInt(req.params.id));
  if (!article) {
    return res.status(404).send("Статтю не знайдено");
  }
  res.render("ejs/article.ejs", { article });
});
module.exports = router;
