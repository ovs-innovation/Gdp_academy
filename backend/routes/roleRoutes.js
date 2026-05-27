const express = require("express");
const {
  createRole,
  listRoles,
  updateRole,
} = require("../controllers/roleController.js");
const { verifyToken } = require("../middlewares/authMiddleware.js");
const { requirePermission } = require("../middlewares/permissionMiddleware.js");

const router = express.Router();

router.get("/", verifyToken, requirePermission("roles.view"), listRoles);
router.post("/", verifyToken, requirePermission("roles.manage"), createRole);
router.patch(
  "/:id",
  verifyToken,
  requirePermission("roles.manage"),
  updateRole,
);

module.exports = router;
