function roleMiddleware(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (req.user.role === "admin") {
    return next();
  }
  const userId = req.user.userId.toString();

  if (userId === req.article.authorId.toString()) {
    return next();
  }
  return res.status(403).json({ message: "Access denied" });
}
module.exports = roleMiddleware;
