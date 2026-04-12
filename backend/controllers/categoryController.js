const Category = require("../models/Category");
const Resource = require("../models/Resource");
const Subject = require("../models/Subject");
const asyncHandler = require("../utils/asyncHandler");
const ensureObjectId = require("../utils/objectId");

const createCategory = asyncHandler(async (req, res) => {
  const { title, subjectId } = req.body;

  if (!title?.trim() || !subjectId) {
    return res
      .status(400)
      .json({ message: "Category title and subject are required." });
  }

  ensureObjectId(subjectId, "subject id");
  const subject = await Subject.findById(subjectId);

  if (!subject) {
    return res.status(404).json({ message: "Subject not found." });
  }

  const category = await Category.create({ title: title.trim(), subjectId });
  res.status(201).json(category);
});

const updateCategory = asyncHandler(async (req, res) => {
  ensureObjectId(req.params.id, "category id");
  const { title } = req.body;

  if (!title?.trim()) {
    return res.status(400).json({ message: "Category title is required." });
  }

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { title: title.trim() },
    { new: true, runValidators: true },
  );

  if (!category) {
    return res.status(404).json({ message: "Category not found." });
  }

  res.json(category);
});

const deleteCategory = asyncHandler(async (req, res) => {
  ensureObjectId(req.params.id, "category id");
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ message: "Category not found." });
  }

  await Resource.deleteMany({ categoryId: category._id });
  await category.deleteOne();

  res.json({ message: "Category deleted successfully." });
});

module.exports = {
  createCategory,
  deleteCategory,
  updateCategory,
};
