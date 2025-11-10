const Article = require("../models/Article");

exports.getArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const articles = await Article.find(
      {},
      "title author createdAt tags content category authorId",
    )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    const total = await Article.countDocuments();
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Помилка при отриманні публікацій");
  }
};

exports.getOfId = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).lean();
    if (!article) {
      return res.status(404).send("Статтю не знайдено");
    }
    res.json({
      success: true,
      article: {
        id: article._id,
        title: article.title,
        author: article.author,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        category: article.category,
        tags: article.tags,
        content: article.content,
        authorId: article.authorId,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Помилка при отриманні статті");
  }
};

exports.deleteById = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Статтю не знайдено" });
    }
    res.json({
      success: true,
      message: "Статтю успішно видалено",
      id: article._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Помилка при видаленні статті");
  }
};

exports.create = async (req, res) => {
  try {
    const article = await Article.create({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author || "Anonymous",
      category: req.body.category,
      authorId: req.body.authorId,
      tags: req.body.tags,
    });
    res.json({
      success: true,
      article: {
        id: article._id,
        title: article.title,
        author: article.author,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        category: article.category,
        tags: article.tags,
        content: article.content,
        authorId: article.authorId,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};
// exports.replaceById = async (req, res) => {
//   try {
//     const article = await Article.replaceOne({ _id: req.params.id }, req.body);
//     res.json({ message: "Статтю замінено", modified: article.modifiedCount });
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Помилка при заміні статті");
//   }
// };
exports.updateById = async (req, res) => {
  try {
    {
      const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!article) {
        return res
          .status(404)
          .json({ success: false, message: "Статтю не знайдено" });
      }
      res.json({
        success: true,
        article: {
          id: article._id,
          title: article.title,
          author: article.author,
          createdAt: article.createdAt,
          updatedAt: article.updatedAt,
          category: article.category,
          tags: article.tags,
          content: article.content,
          authorId: article.authorId,
        },
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Помилка при оновленні статті");
  }
};

// router.get("/stats", async (req, res) => {
//   try {
//     const stats = await Article.aggregate([
//       {
//         $group: {
//           _id: "$author",
//           totalArticle: { $sum: 1 },
//         },
//       },
//       { $sort: { totalArticle: -1 } },
//     ]);
//     res.render("stats", { stats });
//   } catch (err) {
//     console.log(err);
//   }
// });
//
// router.get("/new", authenticateJWT, (req, res) => {
//   res.render("articles_new", { user: req.user });
// });
//
// router.get("/edit/:id", authenticateJWT, async (req, res) => {
//   try {
//     const article = await Article.findById(req.params.id).lean();
//
//     if (!article) return res.status(404).send("Статтю не знайдено");
//
//     res.render("article_edit", { article });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Помилка при завантаженні форми редагування");
//   }
// });
//

//
// router.post("/", authenticateJWT, async (req, res) => {
//   try {
//     await Article.create({
//       title: req.body.title,
//       content: req.body.content,
//       author: req.body.author || "Anonymous",
//     });
//     res.redirect("/articles");
//   } catch (err) {
//     console.log(err);
//     res.status(500).send(err);
//   }
// });
//
// router.post("/many", authenticateJWT, async (req, res) => {
//   try {
//     const articles = await Article.insertMany(req.body.articles);
//     res.json({ message: "Статті додано", ids: articles.map((a) => a._id) });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Помилка при додаванні статей");
//   }
// });
//

// router.put("/many", authenticateJWT, async (req, res) => {
//   try {
//     const { filter, update } = req.body;
//     await Article.updateMany(filter, { $set: update });
//     res.redirect("/articles");
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Помилка при оновленні статей");
//   }
// });

//
//
//
// router.delete("/", authenticateJWT, async (req, res) => {
//   try {
//     await Article.deleteMany(req.body.filter);
//     res.redirect("/articles");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Помилка при видаленні статей");
//   }
// });
