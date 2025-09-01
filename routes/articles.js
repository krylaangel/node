const express = require("express");
const connectDB = require("../connect");
const { ObjectId } = require("mongodb");
const authenticateJWT = require("./middleware/authMiddleware");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = await connectDB();
    const cursor = await db
      .collection("articles")
      .find({}, { projection: { title: 1, author: 1, createdAt: 1 } });

    const articles = [];
    for await (const article of cursor) {
      articles.push(article);
    }
    res.render("articles", { articles });
  } catch (err) {
    console.log(err);
    res.status(500).send("Помилка при отриманні публікацій");
  }
});

router.get("/stats", async (req, res) => {
  try {
    const db = await connectDB();
    const cursor = await db.collection("articles").aggregate([
      {
        $group: {
          _id: "$author",
          totalArticle: { $sum: 1 },
        },
      },
      { $sort: { totalArticle: -1 } },
    ]);
    const stats = [];
    for await (const stat of cursor) {
      stats.push(stat);
    }

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
    const db = await connectDB();
    const article = await db
      .collection("articles")
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!article) return res.status(404).send("Статтю не знайдено");

    res.render("article_edit", { article });
  } catch (err) {
    console.error(err);
    res.status(500).send("Помилка при завантаженні форми редагування");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const db = await connectDB();
    const article = await db
      .collection("articles")
      .findOne({ _id: new ObjectId(req.params.id) });
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
    const db = await connectDB();
    const newArticle = {
      title: req.body.title,
      content: req.body.content,
      author: req.body.author || "Anonymous",
      createdBy: req.user.userId,
      createdAt: new Date(),
    };
    await db.collection("articles").insertOne(newArticle);
    res.redirect("/articles");
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.post("/many", authenticateJWT, async (req, res) => {
  try {
    const db = await connectDB();
    const article = await db
      .collection("articles")
      .insertMany(req.body.articles);
    res.json({ message: "Статті додано", ids: article.insertedIds });
  } catch (err) {
    console.error(err);
    res.status(500).send("Помилка при додаванні статей");
  }
});

router.put("/:id", authenticateJWT, async (req, res) => {
  try {
    {
      const db = await connectDB();
      await db
        .collection("articles")
        .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });

      res.redirect("/articles");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Помилка при оновленні статті");
  }
});
router.put("/many", authenticateJWT, async (req, res) => {
  try {
    const db = await connectDB();
    const { filter, update } = req.body;
    await db.collection("articles").updateMany(filter, { $set: update });
    res.redirect("/articles");
  } catch (err) {
    console.log(err);
    res.status(500).send("Помилка при оновленні статей");
  }
});
router.put("/replace/:id", authenticateJWT, async (req, res) => {
  try {
    const db = await connectDB();
    const article = await db
      .collection("articles")
      .replaceOne({ _id: new ObjectId(req.params.id) }, req.body);
    res.json({ message: "Статтю замінено", modified: article.modifiedCount });
  } catch (err) {
    console.log(err);
    res.status(500).send("Помилка при заміні статті");
  }
});

router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    const db = await connectDB();
    await db
      .collection("articles")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    res.redirect("/articles");
  } catch (err) {
    console.error(err);
    res.status(500).send("Помилка при видаленні статті");
  }
});

router.delete("/", authenticateJWT, async (req, res) => {
  try {
    const db = await connectDB();
    await db.collection("articles").deleteMany(req.body.filter);
    res.redirect("/articles");
  } catch (err) {
    console.error(err);
    res.status(500).send("Помилка при видаленні статей");
  }
});
module.exports = router;
