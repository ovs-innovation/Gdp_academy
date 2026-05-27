const express = require("express");

const {
  login,
  me,
  register,
  forgotPassword,
  resetPassword,
  changePassword,
  googleLogin,
} = require("../controllers/authController.js");

const { verifyToken } = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google-login", googleLogin);
// router.post("/firebase-login", firebaseLogin);
router.post("/forgot", forgotPassword);
router.post("/reset", resetPassword);
router.get("/me", verifyToken, me);
router.post("/change-password", verifyToken, changePassword);

module.exports = router;
