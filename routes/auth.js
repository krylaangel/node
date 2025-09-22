const express = require("express");
const router = express.Router();
const authController = require("./../controllers/authController");
const authenticateJWT = require("./middleware/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", authenticateJWT, authController.me);
router.put("/update", authenticateJWT, authController.update);

module.exports = router;
