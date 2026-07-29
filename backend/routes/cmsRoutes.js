const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware.js");
const { authorize } = require("../middlewares/permissionMiddleware.js");
const { noStoreCache } = require("../middlewares/noStoreCache.js");
const {
  saveCMS,
  getCMSByKey,
  getCMSBySection,
  getAllCMS,
  deleteCMS,
} = require("../controllers/cmsController.js");

const router = express.Router();

// Public
router.get("/section/:section", noStoreCache, getCMSBySection);
router.get("/key/:key", noStoreCache, getCMSByKey);

// Admin only
router.post("/", verifyToken, authorize("admin"), saveCMS);
router.get("/", verifyToken, authorize("admin"), getAllCMS);
router.delete("/:id", verifyToken, authorize("admin"), deleteCMS);

module.exports = router;
