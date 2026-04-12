const express = require("express");
const {
  createResource,
  deleteResource,
  updateResource,
} = require("../controllers/resourceController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.route("/").post(createResource);
router.route("/:id").put(updateResource).delete(deleteResource);

module.exports = router;
