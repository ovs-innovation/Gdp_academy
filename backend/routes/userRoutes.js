const express = require("express");
const {
  createUser,
  deleteUser,
  listUsers,
  updateUser,
} = require("../controllers/userController.js");
const { verifyToken } = require("../middlewares/authMiddleware.js");
const { requirePermission } = require("../middlewares/permissionMiddleware.js");

const router = express.Router();

router.get("/", verifyToken, requirePermission("users.view"), listUsers);
router.post("/", verifyToken, requirePermission("users.create"), createUser);
router.patch("/:id", verifyToken, requirePermission("users.edit"), updateUser);
router.delete(
  "/:id",
  verifyToken,
  requirePermission("users.delete"),
  deleteUser,
);

module.exports = router;
