const express = require("express");
const {
  getCategories,
  getCategory,
} = require("../../controllers/categoryController.js");

const router = express.Router();

router.get("/", getCategories);
router.get("/:id", getCategory);

module.exports = router;
