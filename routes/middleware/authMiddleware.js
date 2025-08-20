const jwt = require("jsonwebtoken");
const secretKey = "mySecretKey";

function authenticateJWT(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token" });
    }

    try {
      req.user = jwt.verify(token, secretKey);
      next();
    } catch (err) {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
}

module.exports = authenticateJWT;
