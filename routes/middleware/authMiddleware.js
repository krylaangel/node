const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}
function authenticateJWT(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    req.user = jwt.verify(token, secretKey);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Forbidden: Invalid token" });
  }
}

module.exports = authenticateJWT;
