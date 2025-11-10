const express = require("express");
const router = express.Router();
const articlesController = require("./../controllers/articlesController");
const authenticateJWT = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");
const loadArticleMiddleware = require("./middleware/loadArticleMiddleware");

router.get("/posts", articlesController.getArticles);
router.get("/posts/:id", articlesController.getOfId);
router.delete(
  "/posts/:id",
  authenticateJWT,
  loadArticleMiddleware,
  roleMiddleware,
  articlesController.deleteById,
);
router.post("/posts", authenticateJWT, articlesController.create);
router.put("/posts/:id", authenticateJWT, articlesController.updateById);
module.exports = router;
