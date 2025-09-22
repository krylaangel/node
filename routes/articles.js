const express = require("express");
const authenticateJWT = require("./middleware/authMiddleware");
const router = express.Router();
const Article = require("../models/Article");

router.get("/", async (req, res) => {
  try {
    const articles = await Article.find({}, "title author createdAt").lean();
    res.render("articles", { articles });
  } catch (err) {
    console.error(err);
    res.status(500).send("Помилка при отриманні публікацій");
  }
});

router.get("/stats", async (req, res) => {
  try {
    const stats = await Article.aggregate([
      {
        $group: {
          _id: "$author",
          totalArticle: { $sum: 1 },
        },
      },
      { $sort: { totalArticle: -1 } },
    ]);
    res.render("stats", { stats });
  } catch (err) {
    console.log(err);
  }
});

router.get("/new", authenticateJWT, (req, res) => {
  res.render("articles_new", { user: req.user });
});

router.get("/edit/:id", authenticateJWT, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).lean();

    if (!article) return res.status(404).send("Статтю не знайдено");

    res.render("article_edit", { article });
  } catch (err) {
    console.error(err);
    res.status(500).send("Помилка при завантаженні форми редагування");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).lean();
    if (!article) {
      return res.status(404).send("Статтю не знайдено");
    }
    res.render("article", { article });
  } catch (err) {
    console.error(err);
    res.status(500).send("Помилка при отриманні статті");
  }
});

router.post("/", authenticateJWT, async (req, res) => {
  try {
    await Article.create({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author || "Anonymous",
    });
    res.redirect("/articles");
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.post("/many", authenticateJWT, async (req, res) => {
  try {
    const articles = await Article.insertMany(req.body.articles);
    res.json({ message: "Статті додано", ids: articles.map((a) => a._id) });
  } catch (err) {
    console.error(err);
    res.status(500).send("Помилка при додаванні статей");
  }
});

router.put("/:id", authenticateJWT, async (req, res) => {
  try {
    {
      await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.redirect("/articles");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Помилка при оновленні статті");
  }
});
router.put("/many", authenticateJWT, async (req, res) => {
  try {
    const { filter, update } = req.body;
    await Article.updateMany(filter, { $set: update });
    res.redirect("/articles");
  } catch (err) {
    console.log(err);
    res.status(500).send("Помилка при оновленні статей");
  }
});
router.put("/replace/:id", authenticateJWT, async (req, res) => {
  try {
    const article = await Article.replaceOne({ _id: req.params.id }, req.body);
    res.json({ message: "Статтю замінено", modified: article.modifiedCount });
  } catch (err) {
    console.log(err);
    res.status(500).send("Помилка при заміні статті");
  }
});

router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect("/articles");
  } catch (err) {
    console.error(err);
    res.status(500).send("Помилка при видаленні статті");
  }
});

router.delete("/", authenticateJWT, async (req, res) => {
  try {
    await Article.deleteMany(req.body.filter);
    res.redirect("/articles");
  } catch (err) {
    console.error(err);
    res.status(500).send("Помилка при видаленні статей");
  }
});
module.exports = router;
