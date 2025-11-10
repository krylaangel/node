const Article = require("../../models/Article");

async function loadArticleMiddleware(req, res, next) {
  try {
    const article = await Article.findById(req.params.id);
    if (!article)
      return res.status(404).json({ message: "Статтю не знайдено" });
    req.article = article;
    next();
  } catch (e) {
    res.status(500).json({ message: "Помилка при пошуку статті" });
  }
}
module.exports = loadArticleMiddleware;
