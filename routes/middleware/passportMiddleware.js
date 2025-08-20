function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/auth_passport/login");
}

module.exports = { ensureAuthenticated };
