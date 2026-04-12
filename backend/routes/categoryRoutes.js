const express = require("express");
const {
  createCategory,
  deleteCategory,
  updateCategory,
} = require("../controllers/categoryController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.route("/").post(createCategory);
router.route("/:id").put(updateCategory).delete(deleteCategory);

module.exports = router;
